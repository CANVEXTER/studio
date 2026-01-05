'use client';

import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAiConfig } from '@/hooks/use-ai-config';
import { useState, useEffect } from 'react';

export function SettingsDialog() {
  const { config, setConfig, isConfigured } = useAiConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model);
  const [baseURL, setBaseURL] = useState(config.baseURL);

  useEffect(() => {
    if (isOpen) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setModel(config.model);
      setBaseURL(config.baseURL);
    }
  }, [isOpen, config]);

  const handleSave = () => {
    setConfig({ provider, apiKey, model, baseURL });
    setIsOpen(false);
  };

  const openRouterModels = [
    'openai/gpt-3.5-turbo',
    'openai/gpt-4o',
    'google/gemini-pro',
    'anthropic/claude-3-haiku',
    'mistralai/mistral-7b-instruct',
  ];

  const googleModels = [
    'googleai/gemini-2.5-flash',
    'googleai/gemini-1.5-pro-latest',
    'googleai/gemini-1.5-flash-latest',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Provider Settings</DialogTitle>
          <DialogDescription>
            Configure the AI provider and model. Your API key is stored securely in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">
              Provider
            </Label>
            <Select
              value={provider}
              onValueChange={(value) => setProvider(value as 'google' | 'openai')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="openai">OpenAI / OpenRouter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              className="col-span-3"
              placeholder={provider === 'google' ? 'Optional for Gemini' : 'Required'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
           {provider === 'openai' && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="base-url" className="text-right">
                    Base URL
                </Label>
                <Input
                    id="base-url"
                    className="col-span-3"
                    placeholder="https://openrouter.ai/api/v1"
                    value={baseURL}
                    onChange={(e) => setBaseURL(e.target.value)}
                />
            </div>
           )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Input
              id="model"
              className="col-span-3"
              placeholder={provider === 'google' ? 'googleai/gemini-2.5-flash' : 'openai/gpt-4o'}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
