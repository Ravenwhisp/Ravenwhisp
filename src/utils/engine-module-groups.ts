export const ENGINE_MODULE_GROUPS = [
  { id: 'core', title: 'Core timing & input' },
  { id: 'graphics', title: 'Graphics foundation' },
  { id: 'content', title: 'Content & logic' },
  { id: 'simulation', title: 'Simulation & feedback' },
  { id: 'presentation', title: 'Presentation' },
  { id: 'editor', title: 'Editor & play mode' }
] as const

export type EngineModuleGroupId = (typeof ENGINE_MODULE_GROUPS)[number]['id']
