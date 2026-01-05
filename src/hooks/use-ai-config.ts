'use client';

import { useState, useEffect } from 'react';

const AI_CONFIG_KEY = 'ai_config';

export type AiConfig = {
  provider: 'google' | 'openai';
  apiKey?: string;
  model?: string;
  baseURL?: string;
};

const defaultConfig: AiConfig = {
  provider: 'google',
  apiKey: '',
  model: 'googleai/gemini-2.5-flash',
  baseURL: '',
};

export function useAiConfig() {
  const [config, setConfigState] = useState<AiConfig>(() => {
    if (typeof window === 'undefined') {
      return defaultConfig;
    }
    try {
      const item = window.localStorage.getItem(AI_CONFIG_KEY);
      return item ? JSON.parse(item) : defaultConfig;
    } catch (error) {
      console.error(error);
      return defaultConfig;
    }
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
        try {
            const item = window.localStorage.getItem(AI_CONFIG_KEY);
            if (item) {
                const parsedConfig = JSON.parse(item);
                setConfigState(parsedConfig);
                setIsConfigured(!!(parsedConfig.apiKey || parsedConfig.provider === 'google'));
            } else {
                setIsConfigured(defaultConfig.provider === 'google');
            }
        } catch (error) {
            console.error(error);
            setIsConfigured(defaultConfig.provider === 'google');
        }
    }
  }, [isMounted]);

  const setConfig = (newConfig: Partial<AiConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfigState(updatedConfig);
      if (isMounted) {
          window.localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(updatedConfig));
      }
      setIsConfigured(!!(updatedConfig.apiKey || updatedConfig.provider === 'google'));
    } catch (error) {
      console.error(error);
    }
  };

  return { config, setConfig, isConfigured };
}
