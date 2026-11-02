import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import engineImages from '../src/data/engine-module-images.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'src', 'content', 'engine')

/** @typedef {{ slug: string, title: string, description: string, moduleGroup: string, sortOrder: number, heroPlaceholder: string, overview: string[], howItWorks: string[], architecture: string, relationships: string[], technicalFeatures: string[], implementationNotes: string[], placeholders: string[] }} ModuleDef */

/** @type {ModuleDef[]} */
const MODULES = [
  {
    slug: 'application-engine',
    title: 'Application / Engine',
    description:
      'Coordinates the engine lifecycle and module execution order. Manages application initialization, update, rendering, and shutdown.',
    moduleGroup: 'core',
    sortOrder: 1,
    heroPlaceholder: '[ARCHITECTURE DIAGRAM]',
    overview: [
      '`Application` is the composition root. It owns every `Module*`, exposes typed accessors, tracks **engine state** (`EDITOR` / `PLAYING` / `PAUSED`), pause/quit flags, optional **per-module update profiling**, **frame phase timings**, and the **active editor camera perspective** (`CameraComponent*`) used when rendering the scene editor viewport.',
      'Module registration order in the constructor defines default update/render ordering. Initialization is strictly forward; cleanup strictly reverse—matching typical dependency teardown (render before D3D12 device destruction). Release builds bootstrap from `build.cfg` (scene UID/hash, optional bank, named scene library IDs) without the asset scanner.'
    ],
    howItWorks: [
      'Win32 creates HWND; `Application` is constructed with the ordered module list.',
      '`init()` initializes all modules forward; `cleanUp()` tears them down in reverse order.',
      'Each `WM_PAINT` calls `update()` unless the window is minimized-paused.',
      'When not paused, each frame runs **update → preRender → render → postRender** on every module, with optional per-module CPU timing.',
      'In `PLAYING`, `ModuleTime::deltaTime()` uses scaled real delta; otherwise delta stays 0.',
      'GPU work is bracketed by `ModuleD3D12::preRender` / `postRender` around module render hooks.'
    ],
    architecture: `Application
├── Module registry (vector<Module*>)
├── ENGINE_STATE + pause/quit
├── FrameCpuTimings / ModuleUpdateTiming
├── Settings
├── ThreadPool
└── Lifecycle drivers
    ├── init() — forward init
    ├── update() — update → preRender → render → postRender
    └── cleanUp() — reverse cleanUp`,
    relationships: [
      'Central hub: all modules are owned here; the global `app` pointer is used throughout the codebase.',
      '`ModuleScene` receives profiling hooks from `Application::update`.',
      '`ModuleRender` requests simulation stop via `requestStopSimulation` → `ModuleGameView::stopGameSimulation`.'
    ],
    technicalFeatures: [
      'Win32 host (`Engine.cpp` → `wWinMain`); **each `WM_PAINT` triggers one full engine frame** via `Application::update()`.',
      'Orthogonal state: `ENGINE_STATE` (`EDITOR` / `PLAYING` / `PAUSED`) and `Application::m_paused` when minimized.',
      'Four-phase frame with recorded CPU timings: update, preRender, render, postRender.',
      '`GAME_RELEASE` bootstrap from `build.cfg` without editor asset scanning.'
    ],
    implementationNotes: [
      '**Verified:** module order, four-phase frame, reverse cleanup, `GAME_RELEASE` bootstrap.',
      '**Partial:** `ModuleTime::waitForNextFrame()` not used; 120 FPS target in constructor does not limit frames in practice.',
      '**Verified:** default state `EDITOR`; release forces `PLAYING`.'
    ],
    placeholders: [
      'Diagram: module init order vs shutdown order (forward/reverse arrows).',
      'Screenshot: editor with debug overlay showing module update timings (`Settings` debug flags).'
    ]
  },
  {
    slug: 'module-time',
    title: 'ModuleTime',
    description: 'Controls runtime time, delta time, update frequency, and frame limiting.',
    moduleGroup: 'core',
    sortOrder: 2,
    heroPlaceholder: '[ARCHITECTURE DIAGRAM]',
    overview: [
      'Uses two `Timer` instances (real and game). Each frame `update()` computes **unscaled** delta from real timer milliseconds.',
      '**`deltaTime()`** multiplies by `timeScale`. **`time()`** returns scaled elapsed seconds. **`realtimeSinceStartup()`** is unscaled wall time.',
      '`waitForNextFrame()` spins with 1 ms sleeps until `1000/targetFps` ms elapsed—**not called** from `Application::update` (commented out).'
    ],
    howItWorks: [
      '`init()` starts timers.',
      'Each `update()`, delta = (now − last) ms × 0.001.',
      '`Application` reads `deltaTime()` only when `ENGINE_STATE` is `PLAYING`.'
    ],
    architecture: `ModuleTime
├── m_realTimer / m_gameTimer
├── m_lastRealDelta, m_scale, m_frames
└── waitForNextFrame() (optional pacing — unused in main loop)`,
    relationships: [
      'Consumed by gameplay systems, particles (`ModuleParticleSystem::deltaTime`), haptics envelopes, scripts (via engine APIs), and logger timestamps (`WindowLogger`).'
    ],
    technicalFeatures: [
      'Separate real vs game timers with configurable **time scale**.',
      'Target FPS stored at construction (`ModuleTime(120)`); pacing API exists but is not wired into the main loop.'
    ],
    implementationNotes: [
      '**Verified:** delta/time scale API.',
      '**Partial:** frame limiting API exists but **not integrated** into main loop.'
    ],
    placeholders: [
      'Graph: real delta vs scaled delta when changing time scale in settings/scripts.',
      'Debug overlay: frame count and delta when profiling enabled.'
    ]
  },
  {
    slug: 'module-input',
    title: 'ModuleInput',
    description:
      'Manages keyboard, mouse, and gamepads. Exposes press, release, movement, analog sticks, and triggers.',
    moduleGroup: 'core',
    sortOrder: 3,
    heroPlaceholder: '[ENGINE SCREENSHOT]',
    overview: [
      'Combines **Win32/DirectXTK-style** `Keyboard` and `Mouse` (messages forwarded in `Engine.cpp` `WndProc`) with **SDL3** initialized for gamepad hot-plug.',
      'Up to **2 local players** with `PlayerBinding` (device type + index). Gamepad API mirrors Xbox-style buttons, sticks (with dead-zone filtering), triggers, and D-pad with pressed/just-pressed/released semantics via frame snapshots.'
    ],
    howItWorks: [
      'OS messages update keyboard/mouse state.',
      '`update()` processes SDL gamepad connect/disconnect and button/trigger snapshots.',
      'Game code and `ModuleCamera` query input through accessor methods.'
    ],
    architecture: `ModuleInput
├── Keyboard + KeyboardStateTracker
├── Mouse + ButtonStateTracker (position, delta, wheel)
├── SDL3 gamepads[MAX_GAMEPADS]
├── PlayerBinding[MAX_LOCAL_PLAYERS]
└── update() — poll SDL events, sync trackers`,
    relationships: [
      '`ModuleCamera` (editor navigation), `ModuleEventSystem` (mouse for UI), `ModuleGameView`, `ModuleHaptics` (reads mixed output context), `WindowSceneEditor` (picking, gizmo).'
    ],
    technicalFeatures: [
      'Keyboard/mouse via DirectXTK trackers; gamepads via SDL3 with hot-plug.',
      'Dead-zone filtering on analog sticks; frame-accurate pressed/released/just-pressed queries.'
    ],
    implementationNotes: ['**Verified:** keyboard, mouse, SDL gamepad surface area in header/implementations.'],
    placeholders: [
      'Screenshot: input debug showing stick values and trigger thresholds.',
      'Video: hot-plug gamepad and haptic feedback together.'
    ]
  },
  {
    slug: 'module-d3d12',
    title: 'ModuleD3D12',
    description:
      'Initializes DirectX 12 and manages the graphics device, command queues, command lists, swap chain, and GPU synchronization.',
    moduleGroup: 'graphics',
    sortOrder: 4,
    heroPlaceholder: '[RENDERING PIPELINE DIAGRAM]',
    overview: [
      'Constructor calls `loadPipeline()` to create DXGI factory, adapter, **ID3D12Device4**, and **CommandQueue**. `init()` builds **SwapChain** and **GraphicsMemory** (DirectXTK allocator). Owns the primary **ID3D12GraphicsCommandList4** recycled through the queue.',
      'Synchronization: **double-buffered frames** (`FRAMES_IN_FLIGHT = 2` in `Globals.h`), per-slot fence values, `waitForFenceValue` before reusing command allocators. `executeCurrentCommandList()` submits work and returns new fence value.'
    ],
    howItWorks: [
      'Device/queue created at construction.',
      'Each frame `preRender` waits for current back-buffer slot fence.',
      'Render modules record into shared command list.',
      '`postRender` executes, presents, commits transient allocations.'
    ],
    architecture: `ModuleD3D12
├── DXGI adapter/factory
├── ID3D12Device4
├── CommandQueue + command list
├── SwapChain → RenderSurface (COMPOSITE + DEPTH)
├── GraphicsMemory
└── Fence / frame index tracking
    ├── preRender — wait, reset list
    └── postRender — execute, Present, Commit`,
    relationships: [
      'Feeds device to `ModuleDescriptors`, `ModuleResources`, and all render passes.',
      '`ModuleRender` executes mid-frame command lists.',
      'Window resize triggers `SwapChain::resize`.'
    ],
    technicalFeatures: [
      'DirectX 12 device, command queue, and shared graphics command list.',
      'Swap chain with composite + depth surfaces; DirectXTK `GraphicsMemory`.',
      'Fence-based frame-in-flight synchronization (`FRAMES_IN_FLIGHT = 2`).'
    ],
    implementationNotes: ['**Verified:** device, swap chain, fence model, list execution helpers.'],
    placeholders: [
      'Diagram: CPU frame timeline vs GPU fences (two frames in flight).',
      'PIX capture screenshot of command list markers (pass names use `BEGIN_EVENT`).'
    ]
  },
  {
    slug: 'module-descriptors',
    title: 'ModuleDescriptors',
    description:
      'Manages descriptor heaps and allocation of descriptors for textures, buffers, and GPU resources.',
    moduleGroup: 'graphics',
    sortOrder: 5,
    heroPlaceholder: '[ARCHITECTURE DIAGRAM]',
    overview: [
      'Central heap manager for **RTV, DSV, CBV/SRV/UAV, Sampler** heaps plus a **StagingDescriptorHeap** for dynamic SRV tables (e.g. render surface descriptor tables).',
      'Creates default samplers (`LINEAR/PPOINT` × `WRAP/CLAMP`). **`defferDescriptorRelease`** queues frees until GPU completes; **`preRender`** reclaims descriptors/blocks when `lastCompletedFrame` allows.'
    ],
    howItWorks: [
      'Constructed with device; heaps sized (e.g. 4096×8 SRV slots).',
      'Textures/surfaces allocate RTV/DSV/SRV via heap APIs.',
      'Each frame, completed frames trigger descriptor recycling.'
    ],
    architecture: `ModuleDescriptors
├── DescriptorHeap map (by D3D12 heap type)
├── StagingDescriptorHeap
├── Default samplers
└── Deferred release lists (handles + heap blocks)`,
    relationships: [
      'Used by every pass and `Texture`/`RenderSurface`.',
      'ImGui pass receives GPU/CPU heap base handles from CBV/SRV heap slot 0.'
    ],
    technicalFeatures: [
      'Multi-heap management (RTV, DSV, CBV/SRV/UAV, samplers).',
      'Staging heap for dynamic SRV tables.',
      'Deferred descriptor release tied to completed GPU frames.'
    ],
    implementationNotes: ['**Verified:** multi-heap management and deferred free pattern.'],
    placeholders: ['Infographic: heap types and what references them (GBuffer SRV table vs material SRVs).']
  },
  {
    slug: 'module-resources',
    title: 'ModuleResources',
    description:
      'Loads, creates, and maintains graphic resources such as buffers, textures, materials, and shaders.',
    moduleGroup: 'graphics',
    sortOrder: 6,
    heroPlaceholder: '[ARCHITECTURE DIAGRAM]',
    overview: [
      '**Low-level GPU factory** (comment in header: owns no asset objects—callers hold `shared_ptr`s). Creates upload/default buffers, vertex/index buffers, **ring buffers**, depth/HDR/GBuffer/SSAO/outline textures, shadow maps, volume textures, **RenderSurface**, and builds **`BasicMesh` / `BasicMaterial`** from `MeshAsset`/`MaterialAsset`.',
      'Uses **DirectXTex** for texture upload paths and a **WeakCache** keyed by content hash.',
      '**Deferred GPU release:** `deferResourceRelease` queues `ID3D12Resource` until fence passes; `preRender` → `collectCompletedResources`.',
      'Shader compilation is generally **offline** (`.cso` blobs read in passes); this module focuses on resource objects, not HLSL compilation at runtime.'
    ],
    howItWorks: [
      'Passes/modules request resources at init or resize.',
      'Uploads may use upload buffers + command list transitions (`uploadTextureAndTransition`).',
      'Freed GPU resources wait for safe fence before destruction.'
    ],
    architecture: `ModuleResources
├── Device + CommandQueue refs
├── create* family (buffers, textures, surfaces)
├── Asset-driven createMesh/createMaterial/createTexture
├── RingBuffer factory
├── WeakCache<MD5Hash, ICacheable>
└── DeferredResource queue (fence-gated free)`,
    relationships: [
      '`ModuleRender::initSceneRenderTargets` creates GBuffer/SSAO attachments.',
      '`ModuleAssets::load` triggers mesh/material/texture creation.',
      'Environment BRDF texture stored here for IBL.'
    ],
    technicalFeatures: [
      'Broad create API for buffers, textures, surfaces, and asset-driven meshes/materials.',
      'Ring buffer factory and WeakCache keyed by content hash.',
      'Fence-gated deferred GPU resource release.',
      'Shaders: precompiled `.cso` in passes (e.g. `GeometryPass`), not compiled in this module.'
    ],
    implementationNotes: [
      '**Verified:** broad create API and deferred release.',
      'Shaders: **verified** as precompiled `.cso` in passes (e.g. `GeometryPass`), not compiled in this module.'
    ],
    placeholders: [
      'Before/after: resize viewport → GBuffer recreation.',
      'Diagram: upload → default heap → shader-visible SRV.'
    ]
  },
  {
    slug: 'module-haptics',
    title: 'ModuleHaptics',
    description: 'Controls vibration and haptic feedback effects.',
    moduleGroup: 'simulation',
    sortOrder: 7,
    heroPlaceholder: '[MODULE DEMONSTRATION VIDEO]',
    overview: [
      'Library of **`HapticEffectDefinition`** entries with envelopes (attack/release/curves). Up to **4 players**, **16 concurrent instances**.',
      '**`update`** advances instances; **`getMixedOutput`** combines to motor amplitudes (including trigger motors). Uses **SDL3** for sending rumble to connected controllers.',
      '**`playEffect` / `playAtScale` / `submitAnonymous`**. Initialized early in module list (before scripting)—comment mentions LOG setup ordering.'
    ],
    howItWorks: [
      'Effect definitions are scheduled into per-player instance slots.',
      'Each frame `update()` advances envelope evaluation.',
      '`getMixedOutput()` mixes active instances into motor amplitudes sent via SDL rumble.'
    ],
    architecture: `ModuleHaptics
├── HapticEffectLibrary
├── Per-player instance slots
├── Envelope evaluation
└── SDL rumble output mixing`,
    relationships: [
      'Gameplay/scripts trigger effects; reads time via `ModuleTime`; coexists with `ModuleInput` gamepads.'
    ],
    technicalFeatures: [
      'Envelope-based haptic effects (attack/release/curves).',
      'Up to 4 players and 16 concurrent instances.',
      'SDL3 rumble output including trigger motors.'
    ],
    implementationNotes: [
      '**Verified:** effect scheduling and mixing API; SDL used for device output in implementation file.'
    ],
    placeholders: [
      'Chart: envelope curves (Linear, Exponential, Punch).',
      'Video: synchronized haptic + on-screen hit effect.'
    ]
  },
  {
    slug: 'module-scripting',
    title: 'ModuleScripting',
    description:
      'Compiles, loads, and reloads game script DLLs. Also instantiates and maintains scripting components associated with the scene.',
    moduleGroup: 'content',
    sortOrder: 8,
    heroPlaceholder: '[EDITOR INTERFACE SCREENSHOT]',
    overview: [
      '**`ScriptLibraryLoader`** loads game script DLL at init. **`ScriptBuildSystem`** + async **`std::future`** rebuilds DLL from `script_build_settings.ini` when requested.',
      'Hot reload saves **`ScriptComponent`** serialized fields (RapidJSON), reloads DLL, restores instances.',
      '**`instantiateSceneScripts` / `destroySceneScripts`** called around play mode (`ModuleGameView`). State machine behaviours also destroyed on reload. Cannot rebuild while **`PLAYING`.**'
    ],
    howItWorks: [
      'Init loads the game scripts DLL via `ScriptLibraryLoader`.',
      'Editor-triggered rebuild runs MSBuild asynchronously through `ScriptBuildSystem`.',
      'On reload, serialized script fields are preserved, DLL is swapped, and scene script instances are restored.',
      'Play mode start/stop hooks instantiate or destroy scene scripts via `ModuleGameView`.'
    ],
    architecture: `ModuleScripting
├── ScriptLibraryLoader (DLL)
├── ScriptBuildSystem + MSBuild worker
├── Reload state machine (Idle/Building/…)
└── Scene script lifecycle hooks`,
    relationships: [
      '`ScriptComponent` on `GameObject`s; `ModuleGameView` play/stop; editor windows for script settings.'
    ],
    technicalFeatures: [
      'Game script DLL load at init.',
      'Async MSBuild rebuild from `script_build_settings.ini`.',
      'RapidJSON-backed hot reload of `ScriptComponent` fields.',
      'Play-mode instantiation rules tied to `ENGINE_STATE`.'
    ],
    implementationNotes: ['**Verified:** DLL load, async build/reload, play-mode instantiation rules.'],
    placeholders: ['Screen recording: edit C++ script → build → reload without restarting editor.']
  },
  {
    slug: 'module-assets',
    title: 'ModuleAssets',
    description:
      'Manages the editor asset system: scanning, import, identification, references, metadata, and dependencies.',
    moduleGroup: 'content',
    sortOrder: 9,
    heroPlaceholder: '[EDITOR INTERFACE SCREENSHOT]',
    overview: [
      '**Editor build:** `AssetScanner` refresh on init, `ContentRegistry`, import via `ImporterRegistry`, `AssetIndex`, in-memory `AssetCache`, `PrefabManager`, deferred `AssetFileDialog` flush on `postRender`.',
      '**Release build:** scanner/registry/dialog stripped; prefab manager remains; loading via library/index paths used by runtime.',
      'Provides templated `load<T>(AssetId&)`, save, import, dependency registration, `fixAllAssetReferences` (re-bake pipeline), and UID→`AssetId` resolution.',
      'Importers include **glTF** (`ImporterGltf` + tinygltf) producing prefabs, meshes, materials, animations, skins.'
    ],
    howItWorks: [
      '`init()` builds subsystems; editor rescans disk.',
      'Import: pick importer by extension → typed asset → library binary + index entry.',
      '`load` pulls from cache or deserializes container, resolves `AssetId` references.'
    ],
    architecture: `ModuleAssets
├── AssetIndex (UID, hash, type, paths)
├── ImporterRegistry → ImporterGltf, etc.
├── AssetCache
├── PrefabManager
├── [Editor] AssetScanner, ContentRegistry, AssetFileDialog
└── persistAsset / registerSubAsset / dependency graph`,
    relationships: [
      '`ModuleScene` load/save uses scene assets.',
      '`ModuleResources` materializes GPU data from assets.',
      '`ModuleFont` loads `FontAsset`. `ModuleMusic` loads sound banks.'
    ],
    technicalFeatures: [
      'Editor scan/import/cache pipeline with `AssetIndex` and importers.',
      'glTF import via tinygltf.',
      'Dependency graph and reference fixup (`fixAllAssetReferences`).',
      'Large editor-only paths gated with `#ifndef GAME_RELEASE`.'
    ],
    implementationNotes: [
      '**Verified:** editor scan/import/cache pipeline.',
      '**Verified:** large parts `#ifndef GAME_RELEASE` gated.'
    ],
    placeholders: [
      'Screen recording: drag-drop import in asset browser.',
      'Diagram: source file → importer → library hash → runtime `AssetId`.'
    ]
  },
  {
    slug: 'module-editor',
    title: 'ModuleEditor',
    description:
      'Contains editor-specific functionality: windows, inspector, hierarchy, asset explorer, settings, and debugging tools.',
    moduleGroup: 'editor',
    sortOrder: 10,
    heroPlaceholder: '[EDITOR INTERFACE SCREENSHOT]',
    overview: [
      'Manages **`EditorWindow`** instances via factory map (`registerWindowType`), persisted layout **`editor_windows.ini`**, ImGui styling, **selection** (GameObject / Asset), **scene tools** (move/rotate/scale/transform/nav), **gizmo local/world**, **prefab edit sessions**, simulation mode enum mirrored by play toolbar.',
      'Registered windows include **Hierarchy, Inspector, Scene Editor, Game view, Logger, Hardware, Settings, File dialog, Scene config, Animation state machine, Music/Video debug, Data container manager**, etc.',
      '**`render`** draws editor UI through ImGui (with `ModuleEditor::render` override).'
    ],
    howItWorks: [
      'Window types register with the editor factory; instances are created and laid out via ImGui docking.',
      'Selection, scene tools, and gizmo modes drive manipulation of `ModuleScene` content.',
      'Play toolbar coordinates simulation mode with `ModuleGameView` and `ENGINE_STATE`.',
      '`render()` draws the full editor UI each frame in non-release builds.'
    ],
    architecture: `ModuleEditor
├── EditorWindow registry + instances
├── Selection + scene tools + gizmo flags
├── PrefabEditSession
├── WindowSceneEditor / WindowGame references
└── ImGui integration (style, dock layout)`,
    relationships: [
      'Drives `ModuleCamera`, talks to `ModuleScene`/`ModuleAssets`, registers debug drawables, coordinates with `ModuleGameView` for play/stop.'
    ],
    technicalFeatures: [
      'ImGui docked editor with persisted `editor_windows.ini` layout.',
      'Broad window ecosystem (hierarchy, inspector, scene/game views, debug tools).',
      'Prefab edit sessions and scene manipulation tools.'
    ],
    implementationNotes: [
      '**Verified:** broad editor window ecosystem; **`#ifndef GAME_RELEASE`** for much asset UI elsewhere, editor module itself always present in non-release builds.'
    ],
    placeholders: [
      'High-quality editor screenshot annotated with window names.',
      'Video: prefab edit mode header + apply/revert flow.'
    ]
  },
  {
    slug: 'module-event-system',
    title: 'ModuleEventSystem',
    description: 'Provides event-based communication between different parts of the engine.',
    moduleGroup: 'editor',
    sortOrder: 11,
    heroPlaceholder: '[ARCHITECTURE DIAGRAM]',
    overview: [
      'Unity-style **UI event routing**: each frame **`process`** raycasts UI hierarchy from scene roots, resolves deepest **`UIButton`/`UISlider`/etc.** under pointer, sends **PointerEnter/Exit/Down/Drag/Up/Click** with **`PointerEventData`.**',
      'Separate **controller navigation** path via **`UINavigation`**. Tracks per-button (3 mouse buttons) press targets.',
      'Not a general publish/subscribe bus for gameplay—**verified focus is UI interaction**.'
    ],
    howItWorks: [
      'Each frame `process` walks UI hierarchies from scene roots under the pointer.',
      'Deepest interactive component receives pointer events with `PointerEventData`.',
      'Controller navigation uses a separate `UINavigation` branch.',
      'Per mouse button press targets are tracked across enter/exit/down/drag/up/click.'
    ],
    architecture: `ModuleEventSystem
├── Mouse raycast (hierarchy walk)
├── Controller navigation branch
├── ButtonState[3]
└── Hover tracking`,
    relationships: ['Depends on `ModuleScene` UI objects, `ModuleInput`, viewport mouse mapping.'],
    technicalFeatures: [
      'Pointer event pipeline for UI components (buttons, sliders, etc.).',
      'Controller navigation branch for gamepad-driven UI.',
      'Scope is UI interaction routing, not a general gameplay event bus.'
    ],
    implementationNotes: [
      '**Verified:** UI pointer pipeline.',
      '**Not verified as general gameplay event bus**—name is broader than implementation scope.'
    ],
    placeholders: ['Diagram: pointer event bubble from leaf button to root canvas.']
  },
  {
    slug: 'module-ui',
    title: 'ModuleUI',
    description:
      'Controls UI elements and their on-screen representation, including images, text, buttons, sliders, and navigation.',
    moduleGroup: 'presentation',
    sortOrder: 12,
    heroPlaceholder: '[ENGINE SCREENSHOT]',
    overview: [
      'Does not draw directly in `update`; **`preRender`** clears command buffers; **`buildCommandsForViewport`** walks active scene `GameObject`s with **Canvas / UIImage / UIText / UIButton / UISlider / UISheet** components, computing screen rects (layout utils), producing **`UITextCommand`** and **`UIImageCommand`** vectors consumed by **`FontPass`** and **`UIImagePass`** during `renderScene`.',
      'World-space canvas modes transform with canvas world matrix; screen-space overlays use orthographic projection in passes.'
    ],
    howItWorks: [
      '`preRender` clears UI command buffers.',
      '`buildCommandsForViewport` traverses scene UI components and builds draw commands.',
      '`ModuleRender::renderScene` consumes commands in `FontPass` and `UIImagePass`.'
    ],
    architecture: `ModuleUI
├── Scene graph UI traversal
├── UITextCommand / UIImageCommand buffers
└── Integration with FontPass / UIImagePass`,
    relationships: [
      '`ModuleEventSystem` handles interaction; `ModuleFont` supplies glyphs; `ModuleRender` triggers build before GPU UI draws.'
    ],
    technicalFeatures: [
      'Command-buffer UI architecture (text + image commands).',
      'Supports world-space and screen-space canvas modes.',
      'Layout utilities produce screen rects for UI components.'
    ],
    implementationNotes: ['**Verified:** command-buffer UI architecture tied to render passes.'],
    placeholders: [
      'Screen recording: button hover + slider drag with event routing.',
      'Split: UI command list vs final composite.'
    ]
  },
  {
    slug: 'module-particle-system',
    title: 'ModuleParticleSystem',
    description:
      'Updates and renders particle systems via emitters, behavior modules, and dedicated buffers.',
    moduleGroup: 'simulation',
    sortOrder: 13,
    heroPlaceholder: '[MODULE DEMONSTRATION VIDEO]',
    overview: [
      'Maintains a **fixed pool** of particle slots shared by **`ParticleSystemComponent`** instances.',
      '**`update`** advances emitter modules (engine-specific `ParticleSystem` types).',
      '**`preRender`** builds **`ParticleEmitterCommand`** list for **`ParticlesPass`**. Supports editor time scaling separate from game delta.'
    ],
    howItWorks: [
      '`update()` simulates emitters against the shared particle pool.',
      '`preRender()` builds render commands for active emitters.',
      '`ParticlesPass` renders billboards during `ModuleRender::renderScene`.'
    ],
    architecture: `ModuleParticleSystem
├── Particle pool + slot bookkeeping
├── EmitterInstance ownership
├── update() — simulation
├── buildParticleCommands() — render prep
└── ParticlesPass (GPU billboards)`,
    relationships: [
      '`ModuleScene` cache of `ParticleSystemComponent`; reset on play start (`ModuleGameView`).'
    ],
    technicalFeatures: [
      'Fixed particle pool with slot bookkeeping.',
      'Emitter modules and dedicated `ParticlesPass` GPU path.',
      'Editor time scaling separate from game delta.'
    ],
    implementationNotes: ['**Verified:** pool, commands, dedicated render pass.'],
    placeholders: [
      'Video: burst emitter + trail combination.',
      'Debug: pool slot exhaustion behavior.'
    ]
  },
  {
    slug: 'module-navigation',
    title: 'ModuleNavigation',
    description:
      'Manages navmesh-based navigation using Recast/Detour. Allows building navigation meshes, querying paths, and applying dynamic blockers.',
    moduleGroup: 'simulation',
    sortOrder: 14,
    heroPlaceholder: '[RENDERING PIPELINE DIAGRAM]',
    overview: [
      'Wraps **`dtNavMesh`** / **`dtNavMeshQuery`** loaded from scene navmesh assets or built at runtime via **`NavMeshBuilder`** (Recast pipeline in `ModuleNavigation.cpp`).',
      'Collects **`NavModifierVolume`** / runtime blockers from scene components. Exposes **`findStraightPath`**, runtime blocker tests, debug polyline generation, **`IDebugDrawable`** integration in **`DebugDrawPass`.**',
      'Agent profiles map to Detour include flags.'
    ],
    howItWorks: [
      'Navmesh data is loaded from scene assets or built per scene via Recast.',
      'Runtime modifier/blocker volumes update queryable navigation.',
      'Path queries use Detour; debug geometry draws through `DebugDrawPass`.'
    ],
    architecture: `ModuleNavigation
├── NavMeshBuilder (Recast)
├── Detour nav mesh + query
├── Runtime modifier/blocker volumes
├── Path debug + draw lines
└── Editor build/load per scene name`,
    relationships: [
      '`Scene::m_navMesh` asset reference; `ModuleScene` static quadtree includes `NAVMESH` layer; editor nav tool in `ModuleEditor`.'
    ],
    technicalFeatures: [
      'Recast build pipeline and Detour runtime queries.',
      'Dynamic blockers and modifier volumes.',
      'Debug draw integration for navmesh and paths.'
    ],
    implementationNotes: ['**Verified:** Detour integration, build API, debug draw registration.'],
    placeholders: [
      'Overlay video: navmesh wireframe + computed path.',
      'Before/after: dynamic blocker carving effect (if used in project scenes).'
    ]
  },
  {
    slug: 'module-render',
    title: 'ModuleRender',
    description:
      "Executes the full graphics pipeline and coordinates render passes. It is one of the engine's main modules.",
    moduleGroup: 'presentation',
    sortOrder: 15,
    heroPlaceholder: '[RENDERING PIPELINE DIAGRAM]',
    overview: [
      'Orchestrates **two rendering contexts**: editor/play viewports (off-screen `RenderSurface`s) in **`preRender`** when not `GAME_RELEASE`, and the **swap chain** in **`render`** (clear, **`ImGuiPass::apply`**, present).',
      'Core scene drawing is **`renderScene()`**—a explicit multi-stage GPU sequence, then a loop over **`m_renderPasses`.**',
      'Pulls scene lists from `ModuleScene`, UI commands from `ModuleUI`/`ModuleParticleSystem`, settings from `Scene`, camera from `ModuleCamera` (editor) or default `CameraComponent` (game).'
    ],
    howItWorks: [
      '`init()` builds passes, one-shot `StaticTexturesPass`, registers debug drawables.',
      '`preRender`: ring buffer free, viewport resize, render visible viewports, execute CL, ImGui start.',
      '`render`: swap chain + ImGui end.',
      '`renderScene` builds `RenderContext` and runs skinning compute, GBuffer geometry, shadows, SSAO, deferred lighting, forward/transparent stack, post-process, debug, and UI passes.'
    ],
    architecture: `ModuleRender
├── Viewport registry (Editor/Play RenderSurfaces)
├── renderScene()
│   ├── Pre-pass compute & shadows pipeline
│   ├── GBuffer + light/shadow/SSAO
│   └── m_renderPasses (forward/deferred composite stack)
├── ImGuiPass (startFrame / apply)
├── VideoPass (optional takeover)
├── RingBuffer
└── GPU/CPU pass profiler`,
    relationships: [
      'Depends on `ModuleD3D12` for command list execution and swap chain.',
      'Reads filtered scene render lists and settings from `ModuleScene`.',
      'Consumes UI/particle command buffers; coordinates with `ModuleCamera` and `ModuleVideo` takeover.'
    ],
    technicalFeatures: [
      'Verified `renderScene` order: skinning compute → occlusion/transparency masks → forward prepass → **GeometryPass** (5-target GBuffer) → shadow/light culling → shadow maps → volumetric fog → SSAO → deferred shading → sky/fog/particles/trails/lines/transparent/outline → post-process → debug → UI images/fonts.',
      'Editor/play viewports rendered off-screen; ImGui composites to swap chain.',
      'Ring-buffer constant uploads with fence commit; optional GPU timestamp profiling in game view.',
      '**Partial / unused:** `PlayerPass` compiled but **never instantiated** in the pass list.'
    ],
    implementationNotes: [
      '**Verified:** GBuffer deferred + forward prepass + transparent forward + post stack.',
      '**Verified:** skinning compute, SSAO, tiled light culling, cascaded shadows, volumetric fog, particles/trails/lines.',
      '**Partial / unused:** `PlayerPass` compiled and included in `ModuleRender.cpp` but **never instantiated** in the pass list—likely superseded by deferred/forward split.',
      '**Verified:** ImGui and debug draw integrated.'
    ],
    placeholders: [
      'Pipeline diagram (strong candidate for website hero graphic).',
      'Side-by-side: GBuffer channel debug views.'
    ]
  },
  {
    slug: 'module-game-view',
    title: 'ModuleGameView',
    description: 'Manages the window or viewport where game execution is displayed.',
    moduleGroup: 'editor',
    sortOrder: 16,
    heroPlaceholder: '[ENGINE SCREENSHOT]',
    overview: [
      'Coordinates **play mode simulation**: **`startGameSimulation`** captures **`SceneSnapshot`**, resets particles, **`instantiateSceneScripts`**, **`initializeRuntimeSceneSystems`.',
      '**`stopGameSimulation`** clears runtime systems, **`Scene::onGameStop`**, restores snapshot.',
      '**`WindowGame`** registers a **`ModuleRender` PLAY viewport** surface. Stop can be requested asynchronously via **`ModuleRender::requestStopSimulation`.**'
    ],
    howItWorks: [
      'Play toolbar triggers `startGameSimulation`, setting `ENGINE_STATE` to `PLAYING` and cloning the scene via `SceneSnapshot`.',
      'Runtime systems (scripts, particles, etc.) initialize for the play session.',
      'Stop restores the snapshot and tears down runtime systems; F3 toggles `WindowGameDebug` in play mode.'
    ],
    architecture: `ModuleGameView
├── SceneSnapshot clone
├── start/stop simulation hooks
├── ModuleScene / Scripting / ParticleSystem refs
└── Debug window flag (F3)`,
    relationships: [
      '`PlayToolbar` → `startGameSimulation`; `ModuleRender` stop hook; `ENGINE_STATE::PLAYING`.'
    ],
    technicalFeatures: [
      'Snapshot-based play/stop isolation for editor vs running game.',
      'Dedicated play viewport surface registered with `ModuleRender`.',
      'Async stop path through `ModuleRender::requestStopSimulation` (GPU flush, music stop).'
    ],
    implementationNotes: ['**Verified:** snapshot-based play/stop isolation.'],
    placeholders: ['Side-by-side editor scene vs play viewport after snapshot restore.']
  },
  {
    slug: 'module-camera',
    title: 'ModuleCamera',
    description: 'Manages editor and game cameras, transforms, projections, and camera switching.',
    moduleGroup: 'presentation',
    sortOrder: 17,
    heroPlaceholder: '[EDITOR INTERFACE SCREENSHOT]',
    overview: [
      '**Editor navigation camera** (not the scene\'s `CameraComponent` by default): orbit, pan, zoom, fly modes driven by `ModuleEditor` navigation mode and `ModuleInput`.',
      'Maintains view/projection matrices, FOV, clip planes, mouse state per mode. **`createRayFromViewport`** supports scene editor picking rays.',
      'When a scene **`CameraComponent`** is chosen as "current perspective" (`Application::setCurrentCameraPerspective`), **`ModuleRender::getEditorCamera`** uses that component instead of free camera. Game rendering uses **`Scene::getDefaultCamera()`.**'
    ],
    howItWorks: [
      'Editor navigation modes update view/projection from `ModuleInput` and editor tool state.',
      'Scene editor picking uses `createRayFromViewport` from the active editor camera.',
      'Optional scene `CameraComponent` can replace the free camera for editor viewport rendering.'
    ],
    architecture: `ModuleCamera
├── View/projection state
├── Navigation modes (pan/orbit/zoom/fly)
├── ModuleEditor + ModuleInput coupling
└── Ray from viewport helper`,
    relationships: ['`WindowSceneEditor`, `ModuleRender` editor path, picking in scene editor.'],
    technicalFeatures: [
      'Orbit, pan, zoom, and fly editor navigation modes.',
      'Viewport picking ray helper.',
      'Distinct editor camera vs scene `CameraComponent` / default game camera.'
    ],
    implementationNotes: ['**Verified:** editor camera + ray helper; game uses scene camera separately.'],
    placeholders: [
      'GIF: orbit vs fly mode in scene view.',
      'Diagram: editor camera vs scene camera component.'
    ]
  },
  {
    slug: 'module-scene',
    title: 'ModuleScene',
    description:
      'Manages the active scene, GameObjects, components, gameplay updates, and spatial queries.',
    moduleGroup: 'content',
    sortOrder: 18,
    heroPlaceholder: '[SCENE HIERARCHY SCREENSHOT]',
    overview: [
      'Owns `std::shared_ptr<Scene> m_scene`, **`m_activeScene` atomic** for thread-safe load boundaries, **dual quadtrees** (static: `ENVIRONMENT`, `NAVMESH`; dynamic: `DEFAULT`, `PLAYER`, `ENEMY`, `PROJECTILE`, `BREAKABLE`, `PICKUP`), and **typed component caches**.',
      '**Scene asset** stores GameObjects, lighting/skybox/SSAO/post/fog settings, navmesh `AssetId`, default camera, trigger system, serialized JSON, pending add/destroy queues with **GPU fence-deferred destruction**.',
      '**Gameplay (`Scene::update`):** only if `PLAYING`—remove marked objects, `update`/`lateUpdate`, `TriggerSystem::update`, flush pending spawns.',
      '**Picking:** `collectAABBHits` then triangle tests in local space. **Async** load/change via worker futures. **Snapshots** for play mode (`ModuleGameView`).'
    ],
    howItWorks: [
      'Default empty scene at construct; quadtrees init with debug colors.',
      'Each frame: resolve pending loads → scene update → rebuild quadtrees if culling toggled → refit trees.',
      'On transform/layer changes, `moveGameObjectInQuadtrees` (scene thread only).',
      'Render modules pull filtered mesh/light lists from caches.'
    ],
    architecture: `ModuleScene
├── Scene (Asset)
│   ├── GameObjects + hierarchy
│   ├── Settings blocks (lighting, skybox, SSAO, fog, post)
│   ├── TriggerSystem
│   └── Pending add/remove/destroy queues
├── Component caches (rebuild on dirty)
├── Static Quadtree / Dynamic Quadtree
├── Picking (AABB → triangle)
├── Load/save + async futures
└── Profiling (detailed update + script spikes)`,
    relationships: [
      'Central data hub for render, UI, navigation, audio, scripting.',
      '`ModuleRender` reads scene settings every frame.',
      '`ModuleNavigation` builds/loads navmesh per scene.',
      '`ModuleEditor` selection/picking.'
    ],
    technicalFeatures: [
      'Component caches and dual quadtrees tied to frustum culling setting.',
      'PLAYING-only gameplay update; editor still loads/saves and maintains spatial structures.',
      'Frustum queries in parameterless `Quadtree::query()` use **`Scene::getDefaultCamera()`** frustum.',
      'Picking does **not** use quadtree culling (full renderer list).'
    ],
    implementationNotes: [
      '**Verified:** caches, dual quadtrees, PLAYING-only gameplay update, picking, snapshots, async load scaffolding.',
      '**Nuance verified:** frustum queries use default scene camera in parameterless quadtree query.',
      '**Verified:** picking does **not** use quadtree culling (full renderer list).'
    ],
    placeholders: [
      'Debug draw: quadtree nodes (static red/green, dynamic cyan/yellow via `IDebugDrawable`).',
      'Video: Play mode snapshot restore on Stop.'
    ]
  },
  {
    slug: 'module-music',
    title: 'ModuleMusic',
    description: 'Integrates music playback and sound bank management via Wwise.',
    moduleGroup: 'simulation',
    sortOrder: 19,
    heroPlaceholder: '[MODULE DEMONSTRATION VIDEO]',
    overview: [
      '**`WwiseManager`** wraps Audiokinetic API: register game objects/listeners, post events, RTPC/switch/state, 3D transforms.',
      'Loads **`WwiseBank`** assets (Init bank + scene banks). **`stopAllSounds`** on simulation stop (called from `ModuleRender::preRender` stop path).',
      '**`MusicPlaybackTracker`** and grouped event cooldowns reduce SFX spam. Scene tracks loaded bank refs; crossfade via Wwise states.'
    ],
    howItWorks: [
      'Banks load from assets (Init + scene banks); scene holds loaded bank references.',
      'Events post through `WwiseManager` with RTPC/switch/state and 3D positioning.',
      'Simulation stop triggers `stopAllSounds` via the render module stop path.'
    ],
    architecture: `ModuleMusic
├── WwiseManager
├── Bank list + Init bank
├── Event posting + grouping/cooldown
└── Scene bank refs (Scene::m_loadedBankRefs)`,
    relationships: [
      'Audio components on entities; `ModuleGameView` stop; release `build.cfg` bank load.'
    ],
    technicalFeatures: [
      'Audiokinetic Wwise integration (events, RTPC, switches, states, 3D).',
      'Bank asset loading and scene bank reference tracking.',
      'Grouped event cooldowns and music playback tracking.'
    ],
    implementationNotes: ['**Verified:** Wwise integration surface in module API.'],
    placeholders: [
      'Wwise profiler screenshot paired with in-engine event trigger.',
      'Diagram: GameObject → SoundSource → Wwise emitter ID.'
    ]
  },
  {
    slug: 'module-video',
    title: 'ModuleVideo',
    description:
      'Manages video loading and playback and its integration with rendering and the interface.',
    moduleGroup: 'simulation',
    sortOrder: 20,
    heroPlaceholder: '[MODULE DEMONSTRATION VIDEO]',
    overview: [
      '**`VideoPlayback`** instances; **`IXAudio2`** mastering voice for audio. **`playVideo`** from path or memory.',
      '**`update`** advances playback. When active, **`ModuleRender::renderPlayScene`** / **`renderGameToBackbuffer`** delegate to **`VideoPass`** + UI overlay instead of full 3D scene.',
      'Editor debug window **`WindowVideoDebug`** loads `VideoAsset` via `ModuleAssets`.'
    ],
    howItWorks: [
      '`update()` advances active `VideoPlayback` instances.',
      'When video is playing, render path short-circuits to `VideoPass` with optional UI overlay.',
      'Audio routed through XAudio2 mastering voice.'
    ],
    architecture: `ModuleVideo
├── VideoPlayback instances
├── XAudio2 master voice
├── VideoPass (full-screen video)
└── UI overlay path (ModuleUI commands)`,
    relationships: ['`VideoComponent`; render short-circuit; optional UI on top.'],
    technicalFeatures: [
      'Video playback from path or memory with XAudio2 audio.',
      'Full-screen `VideoPass` takeover of play/game backbuffer rendering.',
      'Editor `WindowVideoDebug` for `VideoAsset` inspection.'
    ],
    implementationNotes: ['**Verified:** playback API and render takeover path.'],
    placeholders: [
      'Full-screen cinematic takeover demo.',
      'Split: video frame + subtitle UI overlay.'
    ]
  },
  {
    slug: 'module-font',
    title: 'ModuleFont',
    description: 'Loads and prepares fonts for rendering in the engine and UI.',
    moduleGroup: 'presentation',
    sortOrder: 21,
    heroPlaceholder: '[ENGINE SCREENSHOT]',
    overview: [
      'Registry of **`SpriteFont`** objects (DirectXTK) with names and GPU descriptor handles.',
      '**`loadFonts`** called from font pass init path: editor enumerates **`AssetType::FONT`** from asset index; release reads **`build.cfg`** font lines.',
      'Exposes glyph lookup, texture SRV, line spacing for **`FontPass`.**'
    ],
    howItWorks: [
      'Font pass init invokes `loadFonts` with device, upload batch, and descriptor heap.',
      'Editor loads all font assets from the asset index; release loads fonts listed in `build.cfg`.',
      '`FontPass` queries glyphs, SRVs, and line spacing at draw time.'
    ],
    architecture: `ModuleFont
├── SpriteFont vector + name table
├── loadFonts(device, upload batch, heap)
└── Glyph/texture queries for FontPass`,
    relationships: ['`ModuleAssets` font assets; `ModuleUI` UIText; `ModuleRender::FontPass`.'],
    technicalFeatures: [
      'DirectXTK `SpriteFont` registry with GPU descriptor handles.',
      'Editor asset-index-driven loading vs release `build.cfg` font lines.'
    ],
    implementationNotes: ['**Verified:** asset-driven font loading paths for editor and release.'],
    placeholders: ['Texture atlas screenshot + rendered glyph grid.']
  }
]

function yamlString(value) {
  return JSON.stringify(value)
}

function bulletList(items) {
  return items.map(item => `- ${item}`).join('\n')
}

function blogFigure(fig) {
  const lines = [
    '<BlogFigure',
    `  src=${yamlString(fig.src)}`,
    `  alt=${yamlString(fig.alt)}`,
    '  fullWidth={true}',
    '  fit="contain"'
  ]
  if (fig.caption) lines.push(`  caption=${yamlString(fig.caption)}`)
  lines.push('/>')
  return lines.join('\n')
}

function buildMdx(mod) {
  const images = engineImages[mod.slug]
  if (!images) {
    throw new Error(`Missing engine images for slug: ${mod.slug}`)
  }

  const heroUrl = images.imageUrl?.trim()
  const figureBlocks = []
  if (heroUrl) {
    figureBlocks.push(
      blogFigure({
        src: heroUrl,
        alt: images.imageAlt || mod.title,
        caption: images.imageAlt || mod.title
      })
    )
  }
  figureBlocks.push(...images.figures.map(fig => blogFigure(fig)))

  const hasFigures = figureBlocks.length > 0
  const imageFrontmatter =
    heroUrl && images.imageAlt
      ? `imageUrl: ${yamlString(heroUrl)}\nimageAlt: ${yamlString(images.imageAlt)}\n`
      : heroUrl
        ? `imageUrl: ${yamlString(heroUrl)}\nimageAlt: ${yamlString(mod.title)}\n`
        : ''

  const body = [
    ...(hasFigures ? ["import BlogFigure from '@/components/blog-media/blog-figure.astro'", ''] : []),
    '## Overview',
    '',
    mod.overview.join('\n\n'),
    '',
    ...(hasFigures ? [...figureBlocks, ''] : []),
    '## How it works',
    '',
    bulletList(mod.howItWorks),
    '',
    '## Internal architecture',
    '',
    '```',
    mod.architecture,
    '```',
    '',
    '## Relationships',
    '',
    bulletList(mod.relationships),
    '',
    '## Technical features',
    '',
    bulletList(mod.technicalFeatures),
    '',
    '## Implementation notes',
    '',
    bulletList(mod.implementationNotes),
    ''
  ].join('\n')

  return `---
slug: ${yamlString(mod.slug)}
title: ${yamlString(mod.title)}
description: ${yamlString(mod.description)}
moduleGroup: ${mod.moduleGroup}
sortOrder: ${mod.sortOrder}
${imageFrontmatter}---

${body}`
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const written = []
for (const mod of MODULES) {
  const filePath = path.join(OUT_DIR, `${mod.slug}.mdx`)
  fs.writeFileSync(filePath, buildMdx(mod), 'utf8')
  written.push(path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/'))
}

console.log(`Wrote ${written.length} engine module MDX files:`)
for (const file of written) {
  console.log(`  - ${file}`)
}
