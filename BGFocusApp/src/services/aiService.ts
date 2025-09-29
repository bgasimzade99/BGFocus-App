import { getAIConfig, isAPIKeyConfigured, AIMessage, AIResponse, AIService } from '../config/api';

// AI Service Class
export class AIServiceManager {
  private service: AIService;
  private config: ReturnType<typeof getAIConfig>;

  constructor(service: AIService = 'openai') {
    this.service = service;
    this.config = getAIConfig(service);
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return isAPIKeyConfigured(this.service);
  }

  // Get configuration error message
  getConfigurationError(): string {
    if (!this.isConfigured()) {
      return `API key not configured for ${this.service}. Please add your API key to environment variables.`;
    }
    return '';
  }

  // Send message to AI service
  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.isConfigured()) {
      return {
        content: this.getConfigurationError(),
        error: 'API_KEY_NOT_CONFIGURED'
      };
    }

    try {
      switch (this.service) {
        case 'chatglm':
          return await this.callChatGLM(messages);
        case 'openai':
          return await this.callOpenAI(messages);
        case 'anthropic':
          return await this.callAnthropic(messages);
        case 'local':
          return await this.callLocalAI(messages);
        default:
          throw new Error(`Unsupported AI service: ${this.service}`);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ChatGLM API call
  private async callChatGLM(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ChatGLM API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage
    };
  }

  // OpenAI API call
  private async callOpenAI(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage
    };
  }

  // Anthropic API call
  private async callAnthropic(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch(`${this.config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: 1000,
        messages: messages.filter(msg => msg.role !== 'system'),
        system: messages.find(msg => msg.role === 'system')?.content || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || 'No response generated',
      usage: data.usage
    };
  }

  // Local AI service call
  private async callLocalAI(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Local AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content || 'No response generated',
      usage: data.usage
    };
  }
}

// Default AI service instance
export const aiService = new AIServiceManager('chatglm');

// Helper function to create system message for productivity focus
export const createProductivitySystemMessage = (): AIMessage => ({
  role: 'system',
  content: `You are BGFocus AI, a professional productivity assistant. You help users with:

1. Focus and productivity techniques
2. Task management and organization
3. Time management strategies
4. Goal setting and achievement
5. Work-life balance
6. Stress management
7. Habit formation
8. Project planning

Always provide practical, actionable advice. Be encouraging and professional. Keep responses concise but helpful. If asked about non-productivity topics, politely redirect to productivity-related advice.`
});

// Helper function to format user messages
export const createUserMessage = (content: string): AIMessage => ({
  role: 'user',
  content: content.trim()
});

// Helper function to format assistant messages
export const createAssistantMessage = (content: string): AIMessage => ({
  role: 'assistant',
  content: content.trim()
});
