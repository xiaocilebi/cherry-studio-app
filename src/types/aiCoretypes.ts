import type { AISDKError, APICallError, ImageModel, LanguageModel } from 'ai'
import { generateObject, generateText, ModelMessage, streamObject, streamText } from 'ai'

export type StreamTextParams = Omit<Parameters<typeof streamText>[0], 'model' | 'messages'> &
  (
    | {
        prompt: string | ModelMessage[]
        messages?: never
      }
    | {
        messages: ModelMessage[]
        prompt?: never
      }
  )
export type GenerateTextParams = Omit<Parameters<typeof generateText>[0], 'model' | 'messages'> &
  (
    | {
        prompt: string | ModelMessage[]
        messages?: never
      }
    | {
        messages: ModelMessage[]
        prompt?: never
      }
  )
export type StreamObjectParams = Omit<Parameters<typeof streamObject>[0], 'model'>
export type GenerateObjectParams = Omit<Parameters<typeof generateObject>[0], 'model'>

export type AiSdkModel = LanguageModel | ImageModel

// 该类型用于格式化错误信息，目前只处理 APICallError，待扩展
export type AiSdkErrorUnion = AISDKError | APICallError
