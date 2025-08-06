import { getProviderByModel } from '@/services/AssistantService'
import { Model } from '@/types/assistant'
import { getLowerBaseModelName } from '@/utils/naming'

import { isEmbeddingModel } from './embedding'

export const SUPPORTED_DISABLE_GENERATION_MODELS = [
  'gemini-2.0-flash-exp',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'o3'
]

export const TEXT_TO_IMAGE_REGEX = /flux|diffusion|stabilityai|sd-|dall|cogview|janus|midjourney|mj-|image|gpt-image/i

export function isTextToImageModel(model: Model): boolean {
  return TEXT_TO_IMAGE_REGEX.test(model.id)
}

export const GENERATE_IMAGE_MODELS = [
  'gemini-2.0-flash-exp-image-generation',
  'gemini-2.0-flash-preview-image-generation',
  'grok-2-image-1212',
  'grok-2-image',
  'grok-2-image-latest',
  'gpt-image-1',
  ...SUPPORTED_DISABLE_GENERATION_MODELS
]

// For middleware to identify models that must use the dedicated Image API
export const DEDICATED_IMAGE_MODELS = ['grok-2-image', 'dall-e-3', 'dall-e-2', 'gpt-image-1']

export const isDedicatedImageGenerationModel = (model: Model): boolean =>
  DEDICATED_IMAGE_MODELS.filter(m => model.id.includes(m)).length > 0

export function isGenerateImageModel(model: Model): boolean {
  if (!model) {
    return false
  }

  const provider = getProviderByModel(model)

  if (!provider) {
    return false
  }

  const isEmbedding = isEmbeddingModel(model)

  if (isEmbedding) {
    return false
  }

  const baseName = getLowerBaseModelName(model.id, '/')

  if (GENERATE_IMAGE_MODELS.includes(baseName)) {
    return true
  }

  return false
}

export function isSupportedDisableGenerationModel(model: Model): boolean {
  if (!model) {
    return false
  }

  return SUPPORTED_DISABLE_GENERATION_MODELS.includes(getLowerBaseModelName(model.id))
}

// Missing constant from original file
export const TEXT_TO_IMAGES_MODELS_SUPPORT_IMAGE_ENHANCEMENT = [
  'stabilityai/stable-diffusion-2-1',
  'stabilityai/stable-diffusion-xl-base-1.0'
]

// Missing helper function from original file
export const isGenerateImageModels = (models: Model[]) => {
  return models.every(model => isGenerateImageModel(model))
}

export function isNotSupportedImageSizeModel(model?: Model): boolean {
  if (!model) {
    return false
  }

  const baseName = getLowerBaseModelName(model.id, '/')

  return baseName.includes('grok-2-image')
}
