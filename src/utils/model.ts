import { pick } from 'lodash'

import { Model, ModelType } from '@/types/assistant'

export const getModelUniqId = (m?: Model) => {
  return m?.id ? JSON.stringify(pick(m, ['id', 'provider'])) : ''
}

/**
 * 判断模型是否为用户手动选择
 * @param {Model} model 模型对象
 * @param {ModelType} type 模型类型
 * @returns {boolean} 是否为用户手动选择
 */
export function isUserSelectedModelType(model: Model, type: ModelType): boolean | undefined {
  const t = model.capabilities?.find(t => t.type === type)
  return t ? t.isUserSelected : undefined
}
