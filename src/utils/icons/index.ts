const iconCache = new Map<string, any>()

const MODEL_ICONS_DARK = {
  chatgpt: require('@/assets/images/llmIcons/dark/openai.png'),
  o1: require('@/assets/images/llmIcons/dark/openai.png'),
  o3: require('@/assets/images/llmIcons/dark/openai.png'),
  gpt: require('@/assets/images/llmIcons/dark/openai.png'),
  claude: require('@/assets/images/llmIcons/dark/claude.png'),
  gemini: require('@/assets/images/llmIcons/dark/gemini.png'),
  grok: require('@/assets/images/llmIcons/dark/grok.png'),
  deepseek: require('@/assets/images/llmIcons/dark/deepseek.png'),
  doubao: require('@/assets/images/llmIcons/dark/doubao.png'),
  qwen: require('@/assets/images/llmIcons/dark/qwen.png'),
  moonshot: require('@/assets/images/llmIcons/dark/moonshot.png'),
  jina: require('@/assets/images/llmIcons/dark/jina.png'),

  voyage: require('@/assets/images/llmIcons/dark/voyage.png'),
  hunyuan: require('@/assets/images/llmIcons/dark/hunyuan.png'),
  llama: require('@/assets/images/llmIcons/dark/meta.png'),
  command: require('@/assets/images/llmIcons/dark/commanda.png'),
  mistral: require('@/assets/images/llmIcons/dark/mistral.png'),
  minimax: require('@/assets/images/llmIcons/dark/minimax.png'),
  yi: require('@/assets/images/llmIcons/dark/yi.png'),
  ai21: require('@/assets/images/llmIcons/dark/ai21.png'),
  baichuan: require('@/assets/images/llmIcons/dark/baichuan.png'),
  dbrx: require('@/assets/images/llmIcons/dark/dbrx.png'),
  gemma: require('@/assets/images/llmIcons/dark/gemma.png'),
  microsoft: require('@/assets/images/llmIcons/dark/microsoft.png'),
  nvidia: require('@/assets/images/llmIcons/dark/nvidia.png'),
  chatglm: require('@/assets/images/llmIcons/dark/chatglm.png'),
  upstage: require('@/assets/images/llmIcons/dark/upstage.png'),
  palmyra: require('@/assets/images/llmIcons/dark/palm.png'),
  step: require('@/assets/images/llmIcons/dark/stepfun.png'),
  glm: require('@/assets/images/llmIcons/dark/chatglm.png'),
  cohere: require('@/assets/images/llmIcons/dark/commanda.png'),
  phi: require('@/assets/images/llmIcons/dark/microsoft.png'),
  neversleeo: require('@/assets/images/llmIcons/dark/meta.png'),
  perplexity: require('@/assets/images/llmIcons/dark/perplexity.png'),
  sonar: require('@/assets/images/llmIcons/dark/perplexity.png'),
  stable: require('@/assets/images/llmIcons/dark/stability.png')
}

const MODEL_ICONS_LIGHT = {
  chatgpt: require('@/assets/images/llmIcons/light/openai.png'),
  o1: require('@/assets/images/llmIcons/light/openai.png'),
  o3: require('@/assets/images/llmIcons/light/openai.png'),
  gpt: require('@/assets/images/llmIcons/light/openai.png'),
  claude: require('@/assets/images/llmIcons/light/claude.png'),
  gemini: require('@/assets/images/llmIcons/light/gemini.png'),
  grok: require('@/assets/images/llmIcons/light/grok.png'),
  deepseek: require('@/assets/images/llmIcons/light/deepseek.png'),
  doubao: require('@/assets/images/llmIcons/light/doubao.png'),
  qwen: require('@/assets/images/llmIcons/light/qwen.png'),
  moonshot: require('@/assets/images/llmIcons/light/moonshot.png'),
  jina: require('@/assets/images/llmIcons/light/jina.png'),

  voyage: require('@/assets/images/llmIcons/light/voyage.png'),
  hunyuan: require('@/assets/images/llmIcons/light/hunyuan.png'),
  llama: require('@/assets/images/llmIcons/light/meta.png'),
  command: require('@/assets/images/llmIcons/light/commanda.png'),
  mistral: require('@/assets/images/llmIcons/light/mistral.png'),
  minimax: require('@/assets/images/llmIcons/light/minimax.png'),
  yi: require('@/assets/images/llmIcons/light/yi.png'),
  ai21: require('@/assets/images/llmIcons/light/ai21.png'),
  baichuan: require('@/assets/images/llmIcons/light/baichuan.png'),
  dbrx: require('@/assets/images/llmIcons/light/dbrx.png'),
  gemma: require('@/assets/images/llmIcons/light/gemma.png'),
  microsoft: require('@/assets/images/llmIcons/light/microsoft.png'),
  nvidia: require('@/assets/images/llmIcons/light/nvidia.png'),
  chatglm: require('@/assets/images/llmIcons/light/chatglm.png'),
  upstage: require('@/assets/images/llmIcons/light/upstage.png'),
  palmyra: require('@/assets/images/llmIcons/light/palm.png'),
  step: require('@/assets/images/llmIcons/light/stepfun.png'),
  glm: require('@/assets/images/llmIcons/light/chatglm.png'),
  cohere: require('@/assets/images/llmIcons/light/commanda.png'),
  phi: require('@/assets/images/llmIcons/light/microsoft.png'),
  neversleeo: require('@/assets/images/llmIcons/light/meta.png'),
  perplexity: require('@/assets/images/llmIcons/light/perplexity.png'),
  sonar: require('@/assets/images/llmIcons/light/perplexity.png'),
  stable: require('@/assets/images/llmIcons/light/stability.png')
}

export function getModelIcon(modelId: string, isDark: boolean): any {
  const cacheKey = `${modelId}-${isDark}`

  // 检查缓存
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)
  }

  const modelIcons = isDark ? MODEL_ICONS_DARK : MODEL_ICONS_LIGHT
  let result = null

  for (const key in modelIcons) {
    const regex = new RegExp(key, 'i')

    if (regex.test(modelId)) {
      result = modelIcons[key as keyof typeof modelIcons]
      break
    }
  }

  // 缓存结果
  iconCache.set(cacheKey, result)
  return result
}

const PROVIDER_ICONS_DARK = {
  aihubmix: require('@/assets/images/llmIcons/dark/aihubmix.png'),
  alayanew: require('@/assets/images/llmIcons/dark/alayanew.png'),
  anthropic: require('@/assets/images/llmIcons/dark/anthropic.png'),
  'azure-openai': require('@/assets/images/llmIcons/dark/azure.png'),
  'baidu-cloud': require('@/assets/images/llmIcons/dark/baidu.png'),
  baichuan: require('@/assets/images/llmIcons/dark/baichuan.png'),
  burncloud: require('@/assets/images/llmIcons/dark/burncloud.png'),
  copilot: require('@/assets/images/llmIcons/dark/githubcopilot.png'),
  dashscope: require('@/assets/images/llmIcons/dark/dashscope.png'),
  deepseek: require('@/assets/images/llmIcons/dark/deepseek.png'),
  dmxapi: require('@/assets/images/llmIcons/dark/dmxapi.png'),
  doubao: require('@/assets/images/llmIcons/dark/doubao.png'),
  fireworks: require('@/assets/images/llmIcons/dark/fireworks.png'),
  gemini: require('@/assets/images/llmIcons/dark/gemini.png'),
  github: require('@/assets/images/llmIcons/dark/github.png'),
  'gitee-ai': require('@/assets/images/llmIcons/dark/giteeai.png'),
  grok: require('@/assets/images/llmIcons/dark/grok.png'),
  groq: require('@/assets/images/llmIcons/dark/groq.png'),
  gpustack: require('@/assets/images/llmIcons/dark/gpustack.png'),
  hunyuan: require('@/assets/images/llmIcons/dark/hunyuan.png'),
  hyperbolic: require('@/assets/images/llmIcons/dark/hyperbolic.png'),
  infini: require('@/assets/images/llmIcons/dark/infini.png'),
  jina: require('@/assets/images/llmIcons/dark/jina.png'),
  minimax: require('@/assets/images/llmIcons/dark/minimax.png'),
  mistral: require('@/assets/images/llmIcons/dark/mistral.png'),
  modelscope: require('@/assets/images/llmIcons/dark/modelscope.png'),
  moonshot: require('@/assets/images/llmIcons/dark/moonshot.png'),
  nvidia: require('@/assets/images/llmIcons/dark/nvidia.png'),
  o3: require('@/assets/images/llmIcons/dark/o3.png'),
  ocoolai: require('@/assets/images/llmIcons/dark/ocoolai.png'),
  ollama: require('@/assets/images/llmIcons/dark/ollama.png'),
  openai: require('@/assets/images/llmIcons/dark/openai.png'),
  openrouter: require('@/assets/images/llmIcons/dark/openrouter.png'),
  perplexity: require('@/assets/images/llmIcons/dark/perplexity.png'),
  ppio: require('@/assets/images/llmIcons/dark/ppio.png'),
  qiniu: require('@/assets/images/llmIcons/dark/qiniu.png'),
  silicon: require('@/assets/images/llmIcons/dark/silicon.png'),
  stepfun: require('@/assets/images/llmIcons/dark/stepfun.png'),
  'tencent-cloud-ti': require('@/assets/images/llmIcons/dark/hunyuan.png'),
  together: require('@/assets/images/llmIcons/dark/together.png'),
  voyageai: require('@/assets/images/llmIcons/dark/voyage.png'),
  yi: require('@/assets/images/llmIcons/dark/yi.png'),
  zhinao: require('@/assets/images/llmIcons/dark/zhinao.png'),
  zhipu: require('@/assets/images/llmIcons/dark/zhipu.png'),
  vertexai: require('@/assets/images/llmIcons/dark/vertexai.png'),
  lmstudio: require('@/assets/images/llmIcons/dark/lmstudio.png'),
  'aws-bedrock': require('@/assets/images/llmIcons/dark/bedrock.png'),
  poe: require('@/assets/images/llmIcons/dark/poe.png'),
  default: require('@/assets/images/llmIcons/dark/openai.png')
}

const PROVIDER_ICONS_LIGHT = {
  aihubmix: require('@/assets/images/llmIcons/light/aihubmix.png'),
  alayanew: require('@/assets/images/llmIcons/light/alayanew.png'),
  anthropic: require('@/assets/images/llmIcons/light/anthropic.png'),
  'azure-openai': require('@/assets/images/llmIcons/light/azure.png'),
  'baidu-cloud': require('@/assets/images/llmIcons/light/baidu.png'),
  baichuan: require('@/assets/images/llmIcons/light/baichuan.png'),
  burncloud: require('@/assets/images/llmIcons/light/burncloud.png'),
  copilot: require('@/assets/images/llmIcons/light/githubcopilot.png'),
  dashscope: require('@/assets/images/llmIcons/light/dashscope.png'),
  deepseek: require('@/assets/images/llmIcons/light/deepseek.png'),
  dmxapi: require('@/assets/images/llmIcons/light/dmxapi.png'),
  doubao: require('@/assets/images/llmIcons/light/doubao.png'),
  fireworks: require('@/assets/images/llmIcons/light/fireworks.png'),
  gemini: require('@/assets/images/llmIcons/light/google.png'),
  github: require('@/assets/images/llmIcons/light/github.png'),
  'gitee-ai': require('@/assets/images/llmIcons/light/giteeai.png'),
  grok: require('@/assets/images/llmIcons/light/grok.png'),
  groq: require('@/assets/images/llmIcons/light/groq.png'),
  gpustack: require('@/assets/images/llmIcons/light/gpustack.png'),
  hunyuan: require('@/assets/images/llmIcons/light/hunyuan.png'),
  hyperbolic: require('@/assets/images/llmIcons/light/hyperbolic.png'),
  infini: require('@/assets/images/llmIcons/light/infini.png'),
  jina: require('@/assets/images/llmIcons/light/jina.png'),
  minimax: require('@/assets/images/llmIcons/light/minimax.png'),
  mistral: require('@/assets/images/llmIcons/light/mistral.png'),
  modelscope: require('@/assets/images/llmIcons/light/modelscope.png'),
  moonshot: require('@/assets/images/llmIcons/light/moonshot.png'),
  nvidia: require('@/assets/images/llmIcons/light/nvidia.png'),
  o3: require('@/assets/images/llmIcons/light/o3.png'),
  ocoolai: require('@/assets/images/llmIcons/light/ocoolai.png'),
  ollama: require('@/assets/images/llmIcons/light/ollama.png'),
  openai: require('@/assets/images/llmIcons/light/openai.png'),
  openrouter: require('@/assets/images/llmIcons/light/openrouter.png'),
  perplexity: require('@/assets/images/llmIcons/light/perplexity.png'),
  ppio: require('@/assets/images/llmIcons/light/ppio.png'),
  qiniu: require('@/assets/images/llmIcons/light/qiniu.png'),
  silicon: require('@/assets/images/llmIcons/light/silicon.png'),
  stepfun: require('@/assets/images/llmIcons/light/stepfun.png'),
  'tencent-cloud-ti': require('@/assets/images/llmIcons/light/hunyuan.png'),
  together: require('@/assets/images/llmIcons/light/together.png'),
  voyageai: require('@/assets/images/llmIcons/light/voyage.png'),
  yi: require('@/assets/images/llmIcons/light/yi.png'),
  zhinao: require('@/assets/images/llmIcons/light/zhinao.png'),
  zhipu: require('@/assets/images/llmIcons/light/zhipu.png'),
  vertexai: require('@/assets/images/llmIcons/light/vertexai.png'),
  lmstudio: require('@/assets/images/llmIcons/light/lmstudio.png'),
  'aws-bedrock': require('@/assets/images/llmIcons/light/bedrock.png'),
  poe: require('@/assets/images/llmIcons/light/poe.png'),
  default: require('@/assets/images/llmIcons/light/openai.png')
}

export function getProviderIcon(providerId: string, isDark: boolean): any {
  const cacheKey = `${providerId}-${isDark}`

  // 检查缓存
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)
  }

  const providerIcons = isDark ? PROVIDER_ICONS_DARK : PROVIDER_ICONS_LIGHT
  const result = providerIcons[providerId as keyof typeof providerIcons] || providerIcons.default

  // 缓存结果
  iconCache.set(cacheKey, result)
  return result
}

export function getModelOrProviderIcon(modelId: string, providerId: string, isDark: boolean): any {
  // 先尝试获取模型图标
  const modelIcon = getModelIcon(modelId, isDark)

  if (modelIcon) {
    return modelIcon
  }

  // 如果没有模型图标，则使用提供商图标
  return getProviderIcon(providerId, isDark)
}
