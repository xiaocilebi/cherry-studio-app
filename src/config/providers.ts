import { Provider } from '@/types/assistant'

import { SYSTEM_MODELS } from './models/systemModels'

export const PROVIDER_CONFIG = {
  openai: {
    api: {
      url: 'https://api.openai.com'
    },
    websites: {
      official: 'https://openai.com/',
      apiKey: 'https://platform.openai.com/api-keys',
      docs: 'https://platform.openai.com/docs',
      models: 'https://platform.openai.com/docs/models'
    }
  },
  o3: {
    api: {
      url: 'https://api.o3.fan'
    },
    websites: {
      official: 'https://o3.fan',
      apiKey: 'https://o3.fan/token',
      docs: '',
      models: 'https://o3.fan/info/models/'
    }
  },
  burncloud: {
    api: {
      url: 'https://ai.burncloud.com'
    },
    websites: {
      official: 'https://ai.burncloud.com/',
      apiKey: 'https://ai.burncloud.com/token',
      docs: 'https://ai.burncloud.com/docs',
      models: 'https://ai.burncloud.com/pricing'
    }
  },
  ppio: {
    api: {
      url: 'https://api.ppinfra.com/v3/openai'
    },
    websites: {
      official: 'https://ppio.cn/user/register?invited_by=JYT9GD&utm_source=github_cherry-studio&redirect=/',
      apiKey:
        'https://ppio.cn/user/register?invited_by=JYT9GD&utm_source=github_cherry-studio&redirect=/settings/key-management',
      docs: 'https://docs.cherry-ai.com/pre-basic/providers/ppio?invited_by=JYT9GD&utm_source=github_cherry-studio',
      models: 'https://ppio.cn/model-api/product/llm-api?invited_by=JYT9GD&utm_source=github_cherry-studio'
    }
  },
  gemini: {
    api: {
      url: 'https://generativelanguage.googleapis.com'
    },
    websites: {
      official: 'https://gemini.google.com/',
      apiKey: 'https://aistudio.google.com/app/apikey',
      docs: 'https://ai.google.dev/gemini-api/docs',
      models: 'https://ai.google.dev/gemini-api/docs/models/gemini'
    }
  },
  silicon: {
    api: {
      url: 'https://api.siliconflow.cn'
    },
    websites: {
      official: 'https://www.siliconflow.cn',
      apiKey: 'https://cloud.siliconflow.cn/i/d1nTBKXU',
      docs: 'https://docs.siliconflow.cn/',
      models: 'https://cloud.siliconflow.cn/models'
    }
  },
  'gitee-ai': {
    api: {
      url: 'https://ai.gitee.com'
    },
    websites: {
      official: 'https://ai.gitee.com/',
      apiKey: 'https://ai.gitee.com/dashboard/settings/tokens',
      docs: 'https://ai.gitee.com/docs/openapi/v1#tag/%E6%96%87%E6%9C%AC%E7%94%9F%E6%88%90/POST/chat/completions',
      models: 'https://ai.gitee.com/serverless-api'
    }
  },
  deepseek: {
    api: {
      url: 'https://api.deepseek.com'
    },
    websites: {
      official: 'https://deepseek.com/',
      apiKey: 'https://platform.deepseek.com/api_keys',
      docs: 'https://platform.deepseek.com/api-docs/',
      models: 'https://platform.deepseek.com/api-docs/'
    }
  },
  ocoolai: {
    api: {
      url: 'https://api.ocoolai.com'
    },
    websites: {
      official: 'https://one.ocoolai.com/',
      apiKey: 'https://one.ocoolai.com/token',
      docs: 'https://docs.ocoolai.com/',
      models: 'https://api.ocoolai.com/info/models/'
    }
  },
  together: {
    api: {
      url: 'https://api.together.xyz'
    },
    websites: {
      official: 'https://www.together.ai/',
      apiKey: 'https://api.together.ai/settings/api-keys',
      docs: 'https://docs.together.ai/docs/introduction',
      models: 'https://docs.together.ai/docs/chat-models'
    }
  },
  dmxapi: {
    api: {
      url: 'https://www.dmxapi.cn'
    },
    websites: {
      official: 'https://www.dmxapi.cn/register?aff=bwwY',
      apiKey: 'https://www.dmxapi.cn/register?aff=bwwY',
      docs: 'https://dmxapi.cn/models.html#code-block',
      models: 'https://www.dmxapi.cn/pricing'
    }
  },
  perplexity: {
    api: {
      url: 'https://api.perplexity.ai/'
    },
    websites: {
      official: 'https://perplexity.ai/',
      apiKey: 'https://www.perplexity.ai/settings/api',
      docs: 'https://docs.perplexity.ai/home',
      models: 'https://docs.perplexity.ai/guides/model-cards'
    }
  },
  infini: {
    api: {
      url: 'https://cloud.infini-ai.com/maas'
    },
    websites: {
      official: 'https://cloud.infini-ai.com/',
      apiKey: 'https://cloud.infini-ai.com/iam/secret/key',
      docs: 'https://docs.infini-ai.com/gen-studio/api/maas.html#/operations/chatCompletions',
      models: 'https://cloud.infini-ai.com/genstudio/model'
    }
  },
  github: {
    api: {
      url: 'https://models.inference.ai.azure.com/'
    },
    websites: {
      official: 'https://github.com/marketplace/models',
      apiKey: 'https://github.com/settings/tokens',
      docs: 'https://docs.github.com/en/github-models',
      models: 'https://github.com/marketplace/models'
    }
  },
  copilot: {
    api: {
      url: 'https://api.githubcopilot.com/'
    }
  },
  yi: {
    api: {
      url: 'https://api.lingyiwanwu.com'
    },
    websites: {
      official: 'https://platform.lingyiwanwu.com/',
      apiKey: 'https://platform.lingyiwanwu.com/apikeys',
      docs: 'https://platform.lingyiwanwu.com/docs',
      models: 'https://platform.lingyiwanwu.com/docs#%E6%A8%A1%E5%9E%8B'
    }
  },
  zhipu: {
    api: {
      url: 'https://open.bigmodel.cn/api/paas/v4/'
    },
    websites: {
      official: 'https://open.bigmodel.cn/',
      apiKey: 'https://open.bigmodel.cn/usercenter/apikeys',
      docs: 'https://open.bigmodel.cn/dev/howuse/introduction',
      models: 'https://open.bigmodel.cn/modelcenter/square'
    }
  },
  moonshot: {
    api: {
      url: 'https://api.moonshot.cn'
    },
    websites: {
      official: 'https://moonshot.ai/',
      apiKey: 'https://platform.moonshot.cn/console/api-keys',
      docs: 'https://platform.moonshot.cn/docs/',
      models: 'https://platform.moonshot.cn/docs/intro#%E6%A8%A1%E5%9E%8B%E5%88%97%E8%A1%A8'
    }
  },
  baichuan: {
    api: {
      url: 'https://api.baichuan-ai.com'
    },
    websites: {
      official: 'https://www.baichuan-ai.com/',
      apiKey: 'https://platform.baichuan-ai.com/console/apikey',
      docs: 'https://platform.baichuan-ai.com/docs',
      models: 'https://platform.baichuan-ai.com/price'
    }
  },
  modelscope: {
    api: {
      url: 'https://api-inference.modelscope.cn/v1/'
    },
    websites: {
      official: 'https://modelscope.cn',
      apiKey: 'https://modelscope.cn/my/myaccesstoken',
      docs: 'https://modelscope.cn/docs/model-service/API-Inference/intro',
      models: 'https://modelscope.cn/models'
    }
  },
  dashscope: {
    api: {
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/'
    },
    websites: {
      official: 'https://www.aliyun.com/product/bailian',
      apiKey: 'https://bailian.console.aliyun.com/?tab=model#/api-key',
      docs: 'https://help.aliyun.com/zh/model-studio/getting-started/',
      models: 'https://bailian.console.aliyun.com/?tab=model#/model-market'
    }
  },
  stepfun: {
    api: {
      url: 'https://api.stepfun.com'
    },
    websites: {
      official: 'https://platform.stepfun.com/',
      apiKey: 'https://platform.stepfun.com/interface-key',
      docs: 'https://platform.stepfun.com/docs/overview/concept',
      models: 'https://platform.stepfun.com/docs/llm/text'
    }
  },
  doubao: {
    api: {
      url: 'https://ark.cn-beijing.volces.com/api/v3/'
    },
    websites: {
      official: 'https://console.volcengine.com/ark/',
      apiKey: 'https://www.volcengine.com/experience/ark?utm_term=202502dsinvite&ac=DSASUQY5&rc=DB4II4FC',
      docs: 'https://www.volcengine.com/docs/82379/1182403',
      models: 'https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint'
    }
  },
  minimax: {
    api: {
      url: 'https://api.minimax.chat/v1/'
    },
    websites: {
      official: 'https://platform.minimaxi.com/',
      apiKey: 'https://platform.minimaxi.com/user-center/basic-information/interface-key',
      docs: 'https://platform.minimaxi.com/document/Announcement',
      models: 'https://platform.minimaxi.com/document/Models'
    }
  },
  alayanew: {
    api: {
      url: 'https://deepseek.alayanew.com'
    },
    websites: {
      official: 'https://www.alayanew.com/backend/register?id=cherrystudio',
      apiKey: ' https://www.alayanew.com/backend/register?id=cherrystudio',
      docs: 'https://docs.alayanew.com/docs/modelService/interview?utm_source=cherrystudio',
      models: 'https://www.alayanew.com/product/deepseek?id=cherrystudio'
    }
  },
  openrouter: {
    api: {
      url: 'https://openrouter.ai/api/v1/'
    },
    websites: {
      official: 'https://openrouter.ai/',
      apiKey: 'https://openrouter.ai/settings/keys',
      docs: 'https://openrouter.ai/docs/quick-start',
      models: 'https://openrouter.ai/models'
    }
  },
  groq: {
    api: {
      url: 'https://api.groq.com/openai'
    },
    websites: {
      official: 'https://groq.com/',
      apiKey: 'https://console.groq.com/keys',
      docs: 'https://console.groq.com/docs/quickstart',
      models: 'https://console.groq.com/docs/models'
    }
  },
  anthropic: {
    api: {
      url: 'https://api.anthropic.com/'
    },
    websites: {
      official: 'https://anthropic.com/',
      apiKey: 'https://console.anthropic.com/settings/keys',
      docs: 'https://docs.anthropic.com/en/docs',
      models: 'https://docs.anthropic.com/en/docs/about-claude/models'
    }
  },
  grok: {
    api: {
      url: 'https://api.x.ai'
    },
    websites: {
      official: 'https://x.ai/',
      docs: 'https://docs.x.ai/',
      models: 'https://docs.x.ai/docs/models'
    }
  },
  hyperbolic: {
    api: {
      url: 'https://api.hyperbolic.xyz'
    },
    websites: {
      official: 'https://app.hyperbolic.xyz',
      apiKey: 'https://app.hyperbolic.xyz/settings',
      docs: 'https://docs.hyperbolic.xyz',
      models: 'https://app.hyperbolic.xyz/models'
    }
  },
  mistral: {
    api: {
      url: 'https://api.mistral.ai'
    },
    websites: {
      official: 'https://mistral.ai',
      apiKey: 'https://console.mistral.ai/api-keys/',
      docs: 'https://docs.mistral.ai',
      models: 'https://docs.mistral.ai/getting-started/models/models_overview'
    }
  },
  jina: {
    api: {
      url: 'https://api.jina.ai'
    },
    websites: {
      official: 'https://jina.ai',
      apiKey: 'https://jina.ai/',
      docs: 'https://jina.ai',
      models: 'https://jina.ai'
    }
  },
  aihubmix: {
    api: {
      url: 'https://aihubmix.com'
    },
    websites: {
      official: 'https://aihubmix.com?aff=SJyh',
      apiKey: 'https://aihubmix.com?aff=SJyh',
      docs: 'https://doc.aihubmix.com/',
      models: 'https://aihubmix.com/models'
    }
  },
  fireworks: {
    api: {
      url: 'https://api.fireworks.ai/inference'
    },
    websites: {
      official: 'https://fireworks.ai/',
      apiKey: 'https://fireworks.ai/account/api-keys',
      docs: 'https://docs.fireworks.ai/getting-started/introduction',
      models: 'https://fireworks.ai/dashboard/models'
    }
  },
  zhinao: {
    api: {
      url: 'https://api.360.cn'
    },
    websites: {
      official: 'https://ai.360.com/',
      apiKey: 'https://ai.360.com/platform/keys',
      docs: 'https://ai.360.com/platform/docs/overview',
      models: 'https://ai.360.com/platform/limit'
    }
  },
  hunyuan: {
    api: {
      url: 'https://api.hunyuan.cloud.tencent.com'
    },
    websites: {
      official: 'https://cloud.tencent.com/product/hunyuan',
      apiKey: 'https://console.cloud.tencent.com/hunyuan/api-key',
      docs: 'https://cloud.tencent.com/document/product/1729/111007',
      models: 'https://cloud.tencent.com/document/product/1729/104753'
    }
  },
  nvidia: {
    api: {
      url: 'https://integrate.api.nvidia.com'
    },
    websites: {
      official: 'https://build.nvidia.com/explore/discover',
      apiKey: 'https://build.nvidia.com/meta/llama-3_1-405b-instruct',
      docs: 'https://docs.api.nvidia.com/nim/reference/llm-apis',
      models: 'https://build.nvidia.com/nim'
    }
  },
  'azure-openai': {
    api: {
      url: ''
    },
    websites: {
      official: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
      apiKey: 'https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/OpenAI',
      docs: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
      models: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models'
    }
  },
  'baidu-cloud': {
    api: {
      url: 'https://qianfan.baidubce.com/v2/'
    },
    websites: {
      official: 'https://cloud.baidu.com/',
      apiKey: 'https://console.bce.baidu.com/iam/#/iam/apikey/list',
      docs: 'https://cloud.baidu.com/doc/index.html',
      models: 'https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Fm2vrveyu'
    }
  },
  'tencent-cloud-ti': {
    api: {
      url: 'https://api.lkeap.cloud.tencent.com'
    },
    websites: {
      official: 'https://cloud.tencent.com/product/ti',
      apiKey: 'https://console.cloud.tencent.com/lkeap/api',
      docs: 'https://cloud.tencent.com/document/product/1772',
      models: 'https://console.cloud.tencent.com/tione/v2/aimarket'
    }
  },
  gpustack: {
    api: {
      url: ''
    },
    websites: {
      official: 'https://gpustack.ai/',
      docs: 'https://docs.gpustack.ai/latest/',
      models: 'https://docs.gpustack.ai/latest/overview/#supported-models'
    }
  },
  voyageai: {
    api: {
      url: 'https://api.voyageai.com'
    },
    websites: {
      official: 'https://www.voyageai.com/',
      apiKey: 'https://dashboard.voyageai.com/organization/api-keys',
      docs: 'https://docs.voyageai.com/docs',
      models: 'https://docs.voyageai.com/docs'
    }
  },
  qiniu: {
    api: {
      url: 'https://api.qnaigc.com'
    },
    websites: {
      official: 'https://qiniu.com',
      apiKey: 'https://portal.qiniu.com/ai-inference/api-key?cps_key=1h4vzfbkxobiq',
      docs: 'https://developer.qiniu.com/aitokenapi',
      models: 'https://developer.qiniu.com/aitokenapi/12883/model-list'
    }
  }
}

export function getSystemProviders(): Provider[] {
  return [
    {
      id: 'silicon',
      name: 'Silicon',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.siliconflow.cn',
      models: SYSTEM_MODELS.silicon,
      isSystem: true,
      enabled: true,

      isAuthed: false
    },
    {
      id: 'aihubmix',
      name: 'AiHubMix',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://aihubmix.com',
      models: SYSTEM_MODELS.aihubmix,
      isSystem: true,
      enabled: false,

      isAuthed: true
    },
    {
      id: 'ocoolai',
      name: 'ocoolAI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.ocoolai.com',
      models: SYSTEM_MODELS.ocoolai,
      isSystem: true,
      enabled: false
    },
    {
      id: 'deepseek',
      name: 'deepseek',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.deepseek.com',
      models: SYSTEM_MODELS.deepseek,
      isSystem: true,
      enabled: false
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://openrouter.ai/api/v1/',
      models: SYSTEM_MODELS.openrouter,
      isSystem: true,
      enabled: false
    },
    {
      id: 'ppio',
      name: 'PPIO',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.ppinfra.com/v3/openai',
      models: SYSTEM_MODELS.ppio,
      isSystem: true,
      enabled: false
    },
    {
      id: 'alayanew',
      name: 'AlayaNew',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://deepseek.alayanew.com',
      models: SYSTEM_MODELS.alayanew,
      isSystem: true,
      enabled: false
    },
    {
      id: 'infini',
      name: 'Infini',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://cloud.infini-ai.com/maas',
      models: SYSTEM_MODELS.infini,
      isSystem: true,
      enabled: false
    },
    {
      id: 'qiniu',
      name: 'Qiniu',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.qnaigc.com',
      models: SYSTEM_MODELS.qiniu,
      isSystem: true,
      enabled: false
    },
    {
      id: 'dmxapi',
      name: 'DMXAPI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://www.dmxapi.cn',
      models: SYSTEM_MODELS.dmxapi,
      isSystem: true,
      enabled: false
    },
    {
      id: 'burncloud',
      name: 'BurnCloud',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://ai.burncloud.com',
      models: SYSTEM_MODELS.burncloud,
      isSystem: true,
      enabled: false
    },
    {
      id: 'o3',
      name: 'O3',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.o3.fan',
      models: SYSTEM_MODELS.o3,
      isSystem: true,
      enabled: false
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      type: 'anthropic',
      apiKey: '',
      apiHost: 'https://api.anthropic.com/',
      models: SYSTEM_MODELS.anthropic,
      isSystem: true,
      enabled: true
    },
    {
      id: 'openai',
      name: 'OpenAI',
      type: 'openai-response',
      apiKey: '',
      apiHost: 'https://api.openai.com',
      models: SYSTEM_MODELS.openai,
      isSystem: true,
      enabled: false
    },
    {
      id: 'azure-openai',
      name: 'Azure OpenAI',
      type: 'openai',
      apiKey: '',
      apiHost: '',
      apiVersion: '',
      models: SYSTEM_MODELS['azure-openai'],
      isSystem: true,
      enabled: false
    },
    {
      id: 'gemini',
      name: 'Gemini',
      type: 'gemini',
      apiKey: '',
      apiHost: 'https://generativelanguage.googleapis.com',
      models: SYSTEM_MODELS.gemini,
      isSystem: true,
      enabled: true
    },
    {
      id: 'zhipu',
      name: 'ZhiPu',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://open.bigmodel.cn/api/paas/v4/',
      models: SYSTEM_MODELS.zhipu,
      isSystem: true,
      enabled: false
    },
    {
      id: 'github',
      name: 'Github Models',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://models.inference.ai.azure.com/',
      models: SYSTEM_MODELS.github,
      isSystem: true,
      enabled: false
    },
    {
      id: 'copilot',
      name: 'Github Copilot',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.githubcopilot.com/',
      models: SYSTEM_MODELS.copilot,
      isSystem: true,
      enabled: false,
      isAuthed: false
    },
    {
      id: 'yi',
      name: 'Yi',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.lingyiwanwu.com',
      models: SYSTEM_MODELS.yi,
      isSystem: true,
      enabled: false
    },
    {
      id: 'moonshot',
      name: 'Moonshot AI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.moonshot.cn',
      models: SYSTEM_MODELS.moonshot,
      isSystem: true,
      enabled: false
    },
    {
      id: 'baichuan',
      name: 'BAICHUAN AI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.baichuan-ai.com',
      models: SYSTEM_MODELS.baichuan,
      isSystem: true,
      enabled: false
    },
    {
      id: 'dashscope',
      name: 'Bailian',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://dashscope.aliyuncs.com/compatible-mode/v1/',
      models: SYSTEM_MODELS.bailian,
      isSystem: true,
      enabled: false
    },
    {
      id: 'stepfun',
      name: 'StepFun',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.stepfun.com',
      models: SYSTEM_MODELS.stepfun,
      isSystem: true,
      enabled: false
    },
    {
      id: 'doubao',
      name: 'doubao',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://ark.cn-beijing.volces.com/api/v3/',
      models: SYSTEM_MODELS.doubao,
      isSystem: true,
      enabled: false
    },
    {
      id: 'minimax',
      name: 'MiniMax',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.minimax.chat/v1/',
      models: SYSTEM_MODELS.minimax,
      isSystem: true,
      enabled: false
    },
    {
      id: 'groq',
      name: 'Groq',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.groq.com/openai',
      models: SYSTEM_MODELS.groq,
      isSystem: true,
      enabled: false
    },
    {
      id: 'together',
      name: 'Together',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.together.xyz',
      models: SYSTEM_MODELS.together,
      isSystem: true,
      enabled: false
    },
    {
      id: 'fireworks',
      name: 'Fireworks',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.fireworks.ai/inference',
      models: SYSTEM_MODELS.fireworks,
      isSystem: true,
      enabled: false
    },
    {
      id: 'zhinao',
      name: 'zhinao',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.360.cn',
      models: SYSTEM_MODELS.zhinao,
      isSystem: true,
      enabled: false
    },
    {
      id: 'hunyuan',
      name: 'hunyuan',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.hunyuan.cloud.tencent.com',
      models: SYSTEM_MODELS.hunyuan,
      isSystem: true,
      enabled: false
    },
    {
      id: 'nvidia',
      name: 'nvidia',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://integrate.api.nvidia.com',
      models: SYSTEM_MODELS.nvidia,
      isSystem: true,
      enabled: false
    },
    {
      id: 'grok',
      name: 'Grok',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.x.ai',
      models: SYSTEM_MODELS.grok,
      isSystem: true,
      enabled: false
    },
    {
      id: 'hyperbolic',
      name: 'Hyperbolic',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.hyperbolic.xyz',
      models: SYSTEM_MODELS.hyperbolic,
      isSystem: true,
      enabled: false
    },
    {
      id: 'mistral',
      name: 'Mistral',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.mistral.ai',
      models: SYSTEM_MODELS.mistral,
      isSystem: true,
      enabled: false
    },
    {
      id: 'jina',
      name: 'Jina',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.jina.ai',
      models: SYSTEM_MODELS.jina,
      isSystem: true,
      enabled: false
    },
    {
      id: 'gitee-ai',
      name: 'gitee ai',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://ai.gitee.com',
      models: SYSTEM_MODELS['gitee-ai'],
      isSystem: true,
      enabled: false
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.perplexity.ai/',
      models: SYSTEM_MODELS.perplexity,
      isSystem: true,
      enabled: false
    },
    {
      id: 'modelscope',
      name: 'ModelScope',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api-inference.modelscope.cn/v1/',
      models: SYSTEM_MODELS.modelscope,
      isSystem: true,
      enabled: false
    },
    {
      id: 'tencent-cloud-ti',
      name: 'Tencent Cloud TI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.lkeap.cloud.tencent.com',
      models: SYSTEM_MODELS['tencent-cloud-ti'],
      isSystem: true,
      enabled: false
    },
    {
      id: 'baidu-cloud',
      name: 'Baidu Cloud',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://qianfan.baidubce.com/v2/',
      models: SYSTEM_MODELS['baidu-cloud'],
      isSystem: true,
      enabled: false
    },
    {
      id: 'gpustack',
      name: 'GPUStack',
      type: 'openai',
      apiKey: '',
      apiHost: '',
      models: SYSTEM_MODELS.gpustack,
      isSystem: true,
      enabled: false
    },
    {
      id: 'voyageai',
      name: 'VoyageAI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.voyageai.com',
      models: SYSTEM_MODELS.voyageai,
      isSystem: true,
      enabled: false
    }
  ]
}
