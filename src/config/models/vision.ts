import { Model } from '@/types/assistant'

const visionAllowedModels = [
  'llava',
  'moondream',
  'minicpm',
  'gemini-1\\.5',
  'gemini-2\\.0',
  'gemini-2\\.5',
  'gemini-exp',
  'claude-3',
  'claude-sonnet-4',
  'claude-opus-4',
  'vision',
  'glm-4(?:\\.\\d+)?v(?:-[\\w-]+)?',
  'qwen-vl',
  'qwen2-vl',
  'qwen2.5-vl',
  'qwen2.5-omni',
  'qvq',
  'internvl2',
  'grok-vision-beta',
  'pixtral',
  'gpt-4(?:-[\\w-]+)',
  'gpt-4.1(?:-[\\w-]+)?',
  'gpt-4o(?:-[\\w-]+)?',
  'gpt-4.5(?:-[\\w-]+)',
  'chatgpt-4o(?:-[\\w-]+)?',
  'o1(?:-[\\w-]+)?',
  'o3(?:-[\\w-]+)?',
  'o4(?:-[\\w-]+)?',
  'deepseek-vl(?:[\\w-]+)?',
  'kimi-latest',
  'gemma-3(?:-[\\w-]+)',
  'doubao-seed-1[.-]6(?:-[\\w-]+)?',
  'kimi-thinking-preview',
  `gemma3(?:-[\\w-]+)`
]

const visionExcludedModels = [
  'gpt-4-\\d+-preview',
  'gpt-4-turbo-preview',
  'gpt-4-32k',
  'gpt-4-\\d+',
  'o1-mini',
  'o3-mini',
  'o1-preview',
  'AIDC-AI/Marco-o1'
]

export const VISION_REGEX = new RegExp(
  `\\b(?!(?:${visionExcludedModels.join('|')})\\b)(${visionAllowedModels.join('|')})\\b`,
  'i'
)

// Updated with more comprehensive logic
export function isVisionModel(model: Model): boolean {
  if (!model) {
    return false
  }
  // 新添字段 copilot-vision-request 后可使用 vision
  // if (model.provider === 'copilot') {
  //   return false
  // }

  if (model.provider === 'doubao' || model.id.includes('doubao')) {
    return VISION_REGEX.test(model.name) || VISION_REGEX.test(model.id) || model.type?.includes('vision') || false
  }

  return VISION_REGEX.test(model.id) || model.type?.includes('vision') || false
}

export const isVisionModels = (models: Model[]) => {
  return models.every(model => isVisionModel(model))
}
