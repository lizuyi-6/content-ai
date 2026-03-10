// AI 供应商管理 - 支持多供应商切换

class AIProviderManager {
  constructor() {
    this.providers = {
      openai: new OpenAIProvider(),
      deepseek: new DeepSeekProvider(),
      ollama: new OllamaProvider(),
      custom: new CustomProvider()
    };
    this.defaultProvider = process.env.AI_PROVIDER || 'openai';
  }

  getProvider(name = this.defaultProvider) {
    const provider = this.providers[name];
    if (!provider) {
      throw new Error(`不支持的 AI 供应商：${name}`);
    }
    return provider;
  }

  async generate(idea, platform, template, providerName = this.defaultProvider) {
    const provider = this.getProvider(providerName);
    const prompt = this.buildPrompt(idea, platform, template);
    
    return await provider.generate(prompt, {
      platform,
      maxLength: platform === 'twitter' ? 500 : 1000,
      temperature: 0.7
    });
  }

  buildPrompt(idea, platform, template) {
    const prompts = {
      twitter: `将以下想法转化为 3-5 条 Twitter 线程：

想法：${idea}

要求：
- 每条不超过 280 字符
- 第一条要吸引眼球（用数字、问题或惊人事实）
- 中间条提供价值（数据、案例、洞察）
- 最后一条要有行动号召（CTA）
- 使用相关 hashtag（2-3 个）
- 用英语写`,

      linkedin: `将以下想法转化为专业的 LinkedIn 长文：

想法：${idea}

要求：
- 开头用个人故事或观察引入
- 主体部分分 3-4 个要点，每点有深度
- 结尾总结 + 引发讨论的问题
- 专业但亲切的语气
- 3-5 个相关 hashtag
- 用英语写`,

      weibo: `将以下想法转化为微博文案：

想法：${idea}

要求：
- 不超过 140 字
- 开头吸引注意（可以用 emoji）
- 内容有趣或有价值
- 结尾可加互动问题
- 2-3 个话题标签 #标签#
- 用中文写`,

      xiaohongshu: `将以下想法转化为小红书种草笔记：

想法：${idea}

要求：
- 标题要吸引点击（用 emoji + 关键词）
- 正文分点说明，每点用 emoji 开头
- 真诚分享的语气
- 结尾加相关标签
- 用中文写，多用 emoji`
    };

    return prompts[platform] || prompts.twitter;
  }

  // 列出所有可用供应商
  listProviders() {
    return Object.keys(this.providers).map(key => ({
      id: key,
      name: this.providers[key].name,
      description: this.providers[key].description,
      available: this.providers[key].isAvailable()
    }));
  }
}

// ========== OpenAI 供应商 ==========
class OpenAIProvider {
  constructor() {
    this.name = 'OpenAI';
    this.description = 'GPT-4/GPT-3.5，质量最佳';
    this.baseUrl = 'https://api.openai.com/v1';
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  isAvailable() {
    return !!this.apiKey && this.apiKey !== 'sk-demo-key';
  }

  async generate(prompt, options) {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: this.apiKey,
      baseURL: process.env.OPENAI_BASE_URL || this.baseUrl
    });

    const completion = await openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `你是专业的${options.platform}内容创作者。`
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: options.maxLength,
      temperature: options.temperature
    });

    return {
      content: completion.choices[0].message.content,
      provider: 'openai',
      model: this.model,
      usage: completion.usage
    };
  }
}

// ========== DeepSeek 供应商 ==========
class DeepSeekProvider {
  constructor() {
    this.name = 'DeepSeek';
    this.description = '深度求索，性价比高，中文优化';
    this.baseUrl = 'https://api.deepseek.com/v1';
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  }

  isAvailable() {
    return !!this.apiKey;
  }

  async generate(prompt, options) {
    const OpenAI = require('openai'); // DeepSeek 兼容 OpenAI API
    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl
    });

    const completion = await client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `你是专业的${options.platform}内容创作者。`
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: options.maxLength,
      temperature: options.temperature
    });

    return {
      content: completion.choices[0].message.content,
      provider: 'deepseek',
      model: this.model,
      usage: completion.usage
    };
  }
}

// ========== Ollama 供应商（本地部署） ==========
class OllamaProvider {
  constructor() {
    this.name = 'Ollama';
    this.description = '本地部署，免费，隐私安全';
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3';
  }

  isAvailable() {
    // 检查 Ollama 服务是否可用
    try {
      const http = require('http');
      // 简单检查，实际使用时需要异步检查
      return true;
    } catch (e) {
      return false;
    }
  }

  async generate(prompt, options) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxLength / 4 // 估算 token 数
        }
      })
    });

    const data = await response.json();

    return {
      content: data.response,
      provider: 'ollama',
      model: this.model,
      usage: {
        prompt_tokens: data.prompt_eval_count || 0,
        completion_tokens: data.eval_count || 0
      }
    };
  }
}

// ========== 自定义供应商 ==========
class CustomProvider {
  constructor() {
    this.name = 'Custom';
    this.description = '自定义 API 端点';
    this.baseUrl = process.env.CUSTOM_API_URL;
    this.apiKey = process.env.CUSTOM_API_KEY;
    this.model = process.env.CUSTOM_MODEL || 'custom';
  }

  isAvailable() {
    return !!this.baseUrl;
  }

  async generate(prompt, options) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `你是专业的${options.platform}内容创作者。`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: options.maxLength,
        temperature: options.temperature
      })
    });

    const data = await response.json();
    
    // 支持多种响应格式
    const content = data.choices?.[0]?.message?.content 
                 || data.response 
                 || data.content 
                 || data.text;

    return {
      content,
      provider: 'custom',
      model: this.model,
      usage: data.usage || {}
    };
  }
}

module.exports = AIProviderManager;
