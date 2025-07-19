import { Model } from '@/types/assistant'

import { isRerankModel } from './rerank'

export const EMBEDDING_REGEX =
  /(?:^text-|embed|bge-|e5-|LLM2Vec|retrieval|uae-|gte-|jina-clip|jina-embeddings|voyage-)/i

export function isEmbeddingModel(model: Model): boolean {
  if (!model) {
    return false
  }

  if (['anthropic'].includes(model?.provider)) {
    return false
  }

  if (model.provider === 'doubao' || model.id.includes('doubao')) {
    return EMBEDDING_REGEX.test(model.name)
  }

  if (isRerankModel(model)) {
    return false
  }

  return EMBEDDING_REGEX.test(model.id) || model.type?.includes('embedding') || false
}
