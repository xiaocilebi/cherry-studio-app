/**
 * 从模型 ID 中提取默认组名。
 * 规则如下：
 * 1. 第一类分隔规则：以第一个出现的分隔符分割，取第 0 个部分作为组名。
 * 2. 第二类分隔规则：取前两个部分拼接（如 'a-b-c' 得到 'a-b'）。
 * 3. 其他情况返回 id。
 *
 * 例如：
 * - 'gpt-3.5-turbo-16k-0613' => 'gpt-3.5'
 * - 'qwen3:32b' => 'qwen3'
 * - 'Qwen/Qwen3-32b' => 'qwen'
 * - 'deepseek-r1' => 'deepseek-r1'
 * - 'o3' => 'o3'
 *
 * @param {string} id 模型 ID 字符串
 * @param {string} [provider] 提供商 ID 字符串
 * @returns {string} 提取的组名
 */
export const getDefaultGroupName = (id: string, provider?: string): string => {
  const str = id.toLowerCase()

  // 定义分隔符
  let firstDelimiters = ['/', ' ', ':']
  let secondDelimiters = ['-', '_']

  if (provider && ['aihubmix', 'silicon', 'ocoolai', 'o3', 'dmxapi'].includes(provider.toLowerCase())) {
    firstDelimiters = ['/', ' ', '-', '_', ':']
    secondDelimiters = []
  }

  // 第一类分隔规则
  for (const delimiter of firstDelimiters) {
    if (str.includes(delimiter)) {
      return str.split(delimiter)[0]
    }
  }

  // 第二类分隔规则
  for (const delimiter of secondDelimiters) {
    if (str.includes(delimiter)) {
      const parts = str.split(delimiter)
      return parts.length > 1 ? parts[0] + '-' + parts[1] : parts[0]
    }
  }

  return str
}

/**
 * 从模型 ID 中提取基础名称。
 * 例如：
 * - 'deepseek/deepseek-r1' => 'deepseek-r1'
 * - 'deepseek-ai/deepseek/deepseek-r1' => 'deepseek-r1'
 * @param {string} id 模型 ID
 * @param {string} [delimiter='/'] 分隔符，默认为 '/'
 * @returns {string} 基础名称
 */
export const getBaseModelName = (id: string, delimiter: string = '/'): string => {
  const parts = id.split(delimiter)
  return parts[parts.length - 1]
}

/**
 * 从模型 ID 中提取基础名称并转换为小写。
 * 例如：
 * - 'deepseek/DeepSeek-R1' => 'deepseek-r1'
 * - 'deepseek-ai/deepseek/DeepSeek-R1' => 'deepseek-r1'
 * @param {string} id 模型 ID
 * @param {string} [delimiter='/'] 分隔符，默认为 '/'
 * @returns {string} 小写的基础名称
 */
export const getLowerBaseModelName = (id: string, delimiter: string = '/'): string => {
  return getBaseModelName(id, delimiter).toLowerCase()
}
