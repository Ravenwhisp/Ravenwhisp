import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { withBasePath } from '@/lib/paths'

const MODEL_URL = withBasePath('/3dmodels/RedPartScene.glb')
const CAMERA_NAME = 'camera'
const LIGHT_INTENSITY_MULTIPLIER = 2.5
const CAMERA_PARALLAX_STRENGTH = 0.1
const CAMERA_PARALLAX_SMOOTHING = 0.08
const DOLLY_MAX_DISTANCE = 10
const DOLLY_MAX_FOV_REDUCTION = 20
const DOLLY_SMOOTHING = 0.08

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to load the 3D scene.'
}

const disposeMaterial = (material: THREE.Material) => {
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) {
      value.dispose()
    }
  }

  material.dispose()
}

const normalizeSceneLights = (scene: THREE.Group) => {
  let lightCount = 0

  scene.traverse(object => {
    if (!(object instanceof THREE.Light)) {
      return
    }

    lightCount += 1
    object.visible = true
    object.intensity *= LIGHT_INTENSITY_MULTIPLIER
  })

  if (lightCount > 0) {
    return
  }

  const hemisphere = new THREE.HemisphereLight(0xffffff, 0x2f243d, 0.9)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
  keyLight.position.set(6, 10, 4)

  scene.add(hemisphere)
  scene.add(keyLight)
}

const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.toneMappingExposure = 1
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    container.appendChild(renderer.domElement)

    let frameId = 0
    let mounted = true
    let sceneCamera: THREE.PerspectiveCamera | null = null
    let loadedScene: THREE.Group | null = null
    let baseCameraPosition: THREE.Vector3 | null = null
    let baseCameraQuaternion: THREE.Quaternion | null = null
    let baseCameraFov: number | null = null
    let targetDollyDistance = 0
    let currentDollyDistance = 0
    let targetFovReduction = 0
    let currentFovReduction = 0

    const targetPointer = new THREE.Vector2(0, 0)
    const currentPointer = new THREE.Vector2(0, 0)
    const rightDirection = new THREE.Vector3()
    const upDirection = new THREE.Vector3()
    const forwardDirection = new THREE.Vector3()

    const heroSection = container.closest('section#home')

    const getScrollProgress = () => {
      if (!heroSection) {
        return 0
      }

      const rect = heroSection.getBoundingClientRect()

      if (!rect.height) {
        return 0
      }

      return THREE.MathUtils.clamp(-rect.top / rect.height, 0, 1)
    }

    const updateScrollTargets = () => {
      const scrollProgress = getScrollProgress()
      targetDollyDistance = scrollProgress * DOLLY_MAX_DISTANCE
      targetFovReduction = scrollProgress * DOLLY_MAX_FOV_REDUCTION
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()

      if (!rect.width || !rect.height) {
        return
      }

      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1

      targetPointer.set(normalizedX, normalizedY)
    }

    const onPointerLeave = () => {
      targetPointer.set(0, 0)
    }

    const resize = () => {
      const { clientWidth, clientHeight } = container

      if (!clientWidth || !clientHeight) {
        return
      }

      renderer.setSize(clientWidth, clientHeight, false)

      if (sceneCamera) {
        sceneCamera.aspect = clientWidth / clientHeight
        sceneCamera.updateProjectionMatrix()
      }

      updateScrollTargets()
    }

    const renderFrame = () => {
      if (!mounted || !loadedScene || !sceneCamera) {
        return
      }

      if (baseCameraPosition && baseCameraQuaternion) {
        currentPointer.lerp(targetPointer, CAMERA_PARALLAX_SMOOTHING)
        currentDollyDistance = THREE.MathUtils.lerp(currentDollyDistance, targetDollyDistance, DOLLY_SMOOTHING)
        currentFovReduction = THREE.MathUtils.lerp(currentFovReduction, targetFovReduction, DOLLY_SMOOTHING)

        rightDirection.set(1, 0, 0).applyQuaternion(baseCameraQuaternion)
        upDirection.set(0, 1, 0).applyQuaternion(baseCameraQuaternion)
        forwardDirection.set(0, 0, -1).applyQuaternion(baseCameraQuaternion)

        sceneCamera.position
          .copy(baseCameraPosition)
          .addScaledVector(forwardDirection, -currentDollyDistance)
          .addScaledVector(rightDirection, currentPointer.x * CAMERA_PARALLAX_STRENGTH)
          .addScaledVector(upDirection, -currentPointer.y * CAMERA_PARALLAX_STRENGTH)
        sceneCamera.quaternion.copy(baseCameraQuaternion)

        if (baseCameraFov !== null) {
          sceneCamera.fov = baseCameraFov - currentFovReduction
          sceneCamera.updateProjectionMatrix()
        }
      }

      renderer.render(loadedScene, sceneCamera)
      frameId = window.requestAnimationFrame(renderFrame)
    }

    resize()

    const loader = new GLTFLoader()
    loader.load(
      MODEL_URL,
      gltf => {
        if (!mounted) {
          return
        }

        loadedScene = gltf.scene
        normalizeSceneLights(loadedScene)
        loadedScene.updateMatrixWorld(true)

        const embeddedCamera = gltf.cameras.find(camera => {
          const cameraNames = [camera.name, camera.parent?.name].filter(Boolean).map(name => name.toLowerCase())
          return cameraNames.includes(CAMERA_NAME)
        })

        if (!(embeddedCamera instanceof THREE.PerspectiveCamera)) {
          setStatus('error')
          setErrorMessage(`No embedded perspective camera named "${CAMERA_NAME}" was found in ${MODEL_URL}.`)
          return
        }

        sceneCamera = embeddedCamera
        baseCameraPosition = embeddedCamera.position.clone()
        baseCameraQuaternion = embeddedCamera.quaternion.clone()
        baseCameraFov = embeddedCamera.fov

        resize()
        updateScrollTargets()
        setStatus('ready')
        renderFrame()
      },
      undefined,
      error => {
        if (!mounted) {
          return
        }

        setStatus('error')
        setErrorMessage(getErrorMessage(error))
      }
    )

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('scroll', updateScrollTargets, { passive: true })
    window.addEventListener('resize', resize)

    return () => {
      mounted = false
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', updateScrollTargets)
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(frameId)

      if (loadedScene) {
        loadedScene.traverse(object => {
          if (!(object instanceof THREE.Mesh)) {
            return
          }

          object.geometry.dispose()

          if (Array.isArray(object.material)) {
            object.material.forEach(disposeMaterial)
            return
          }

          disposeMaterial(object.material)
        })
      }

      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div className='relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(226,201,233,0.48)_36%,rgba(58,27,66,0.16)_100%)]'>
      <div ref={containerRef} className='h-full w-full' aria-label='3D hero scene preview' />

      {status !== 'ready' ? (
        <div className='pointer-events-none absolute inset-0 flex flex-col items-start justify-end gap-2 bg-gray-900 p-5 text-white'>
          <p className='text-sm font-medium tracking-wide uppercase'>
            {status === 'loading' ? 'Loading scene' : 'Scene unavailable'}
          </p>
          <p className='max-w-md text-sm text-white/80'>
            {status === 'loading'
              ? 'Preparing the embedded Three.js scene and camera view.'
              : errorMessage || 'The GLTF scene could not be loaded.'}
          </p>
        </div>
      ) : null}

      <div className='pointer-events-none absolute inset-0 bg-linear-to-br from-gray-900/90 via-gray-900/30 to-transparent' />
    </div>
  )
}

export default HeroScene
