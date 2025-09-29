// API Configuration
export const API_CONFIG = {
  // ChatGLM API Configuration (Primary)
  CHATGLM: {
    API_KEY: process.env.EXPO_PUBLIC_CHATGLM_API_KEY || '95e1ff7b9b85423b9fe43b6bc57e377d.rD9cRq0hoaZS4JpD',
    BASE_URL: 'https://open.bigmodel.cn/api/paas/v4',
    MODEL: 'glm-4',
  },
  
  // OpenAI API Configuration
  OPENAI: {
    API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo',
  },
  
  // Alternative AI Services
  ANTHROPIC: {
    API_KEY: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
    BASE_URL: 'https://api.anthropic.com/v1',
    MODEL: 'claude-3-haiku-20240307',
  },
  
  // Local/Development AI Service
  LOCAL: {
    API_KEY: process.env.EXPO_PUBLIC_LOCAL_AI_KEY || '',
    BASE_URL: 'http://localhost:3000/api',
    MODEL: 'local-model',
  },
};

// AI Service Types
export type AIService = 'chatglm' | 'openai' | 'anthropic' | 'local';

// AI Configuration Interface
export interface AIConfig {
  service: AIService;
  apiKey: string;
  baseUrl: string;
  model: string;
}

// Get AI Configuration
export const getAIConfig = (service: AIService = 'chatglm'): AIConfig => {
  switch (service) {
    case 'chatglm':
      return {
        service: 'chatglm',
        apiKey: API_CONFIG.CHATGLM.API_KEY,
        baseUrl: API_CONFIG.CHATGLM.BASE_URL,
        model: API_CONFIG.CHATGLM.MODEL,
      };
    case 'openai':
      return {
        service: 'openai',
        apiKey: API_CONFIG.OPENAI.API_KEY,
        baseUrl: API_CONFIG.OPENAI.BASE_URL,
        model: API_CONFIG.OPENAI.MODEL,
      };
    case 'anthropic':
      return {
        service: 'anthropic',
        apiKey: API_CONFIG.ANTHROPIC.API_KEY,
        baseUrl: API_CONFIG.ANTHROPIC.BASE_URL,
        model: API_CONFIG.ANTHROPIC.MODEL,
      };
    case 'local':
      return {
        service: 'local',
        apiKey: API_CONFIG.LOCAL.API_KEY,
        baseUrl: API_CONFIG.LOCAL.BASE_URL,
        model: API_CONFIG.LOCAL.MODEL,
      };
    default:
      return getAIConfig('chatglm');
  }
};

// Check if API key is configured
export const isAPIKeyConfigured = (service: AIService = 'chatglm'): boolean => {
  const config = getAIConfig(service);
  const hasKey = config.apiKey.length > 0;
  
  // Debug logging (remove in production)
  if (__DEV__) {
    console.log(`API Key Status for ${service}:`, {
      hasKey,
      keyLength: config.apiKey.length,
      keyPreview: config.apiKey.substring(0, 10) + '...'
    });
  }
  
  return hasKey;
};

// AI Message Interface
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// AI Response Interface
export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}
