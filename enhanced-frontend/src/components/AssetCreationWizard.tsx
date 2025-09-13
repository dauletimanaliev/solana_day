// ENHANCED FRONTEND: Мастер создания актива
// ==========================================

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { Upload, Image, FileText, DollarSign, Users, Shield, CheckCircle } from 'lucide-react';

interface AssetData {
  name: string;
  description: string;
  category: string;
  totalSupply: string;
  pricePerToken: string;
  metadataUri: string;
  imageUri: string;
  legalDocuments: string[];
  kycRequired: boolean;
  minInvestment: string;
  maxInvestment: string;
}

const categories = [
  { value: 'real-estate', label: 'Недвижимость', icon: '🏠' },
  { value: 'art', label: 'Искусство', icon: '🎨' },
  { value: 'business', label: 'Бизнес', icon: '💼' },
  { value: 'commodities', label: 'Сырье', icon: '⛽' },
  { value: 'intellectual', label: 'Интеллектуальная собственность', icon: '🧠' },
  { value: 'other', label: 'Другое', icon: '📦' }
];

const steps = [
  { id: 1, title: 'Основная информация', description: 'Название и описание актива' },
  { id: 2, title: 'Финансовые параметры', description: 'Стоимость и количество токенов' },
  { id: 3, title: 'Метаданные', description: 'Изображения и документы' },
  { id: 4, title: 'Правовые аспекты', description: 'KYC и юридические документы' },
  { id: 5, title: 'Проверка и создание', description: 'Финальная проверка данных' }
];

export function AssetCreationWizard() {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [assetData, setAssetData] = useState<AssetData>({
    name: '',
    description: '',
    category: '',
    totalSupply: '',
    pricePerToken: '',
    metadataUri: '',
    imageUri: '',
    legalDocuments: [],
    kycRequired: false,
    minInvestment: '',
    maxInvestment: ''
  });

  const handleInputChange = (field: keyof AssetData, value: string | boolean | string[]) => {
    setAssetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return assetData.name.length > 0 && assetData.description.length > 0 && assetData.category.length > 0;
      case 2:
        return assetData.totalSupply.length > 0 && assetData.pricePerToken.length > 0;
      case 3:
        return assetData.metadataUri.length > 0;
      case 4:
        return true; // KYC и документы опциональны
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleCreateAsset = async () => {
    if (!connected) {
      toast({
        title: "Ошибка",
        description: "Подключите кошелек для создания актива",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Здесь будет вызов API для создания актива
      const response = await fetch('/api/assets/create_asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assetData,
          creator: publicKey?.toString()
        })
      });

      if (response.ok) {
        toast({
          title: "Успех!",
          description: "Актив успешно создан",
        });
        // Сброс формы
        setAssetData({
          name: '',
          description: '',
          category: '',
          totalSupply: '',
          pricePerToken: '',
          metadataUri: '',
          imageUri: '',
          legalDocuments: [],
          kycRequired: false,
          minInvestment: '',
          maxInvestment: ''
        });
        setCurrentStep(1);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать актив",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Название актива *</Label>
              <Input
                id="name"
                value={assetData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Например: Люксовая квартира в Манхэттене"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={assetData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Подробное описание актива..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="category">Категория *</Label>
              <Select value={assetData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="totalSupply">Общее количество токенов *</Label>
              <Input
                id="totalSupply"
                type="number"
                value={assetData.totalSupply}
                onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                placeholder="1000000"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Общее количество фракций, на которые будет разделен актив
              </p>
            </div>

            <div>
              <Label htmlFor="pricePerToken">Цена за токен (SOL) *</Label>
              <Input
                id="pricePerToken"
                type="number"
                step="0.01"
                value={assetData.pricePerToken}
                onChange={(e) => handleInputChange('pricePerToken', e.target.value)}
                placeholder="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minInvestment">Минимальная инвестиция (SOL)</Label>
                <Input
                  id="minInvestment"
                  type="number"
                  step="0.01"
                  value={assetData.minInvestment}
                  onChange={(e) => handleInputChange('minInvestment', e.target.value)}
                  placeholder="1.0"
                />
              </div>
              <div>
                <Label htmlFor="maxInvestment">Максимальная инвестиция (SOL)</Label>
                <Input
                  id="maxInvestment"
                  type="number"
                  step="0.01"
                  value={assetData.maxInvestment}
                  onChange={(e) => handleInputChange('maxInvestment', e.target.value)}
                  placeholder="100.0"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="imageUri">URI изображения *</Label>
              <Input
                id="imageUri"
                value={assetData.imageUri}
                onChange={(e) => handleInputChange('imageUri', e.target.value)}
                placeholder="https://example.com/asset-image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="metadataUri">URI метаданных *</Label>
              <Input
                id="metadataUri"
                value={assetData.metadataUri}
                onChange={(e) => handleInputChange('metadataUri', e.target.value)}
                placeholder="https://example.com/metadata.json"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Загрузите изображения и документы
              </p>
              <Button variant="outline" className="mt-2">
                Выбрать файлы
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="kycRequired"
                checked={assetData.kycRequired}
                onChange={(e) => handleInputChange('kycRequired', e.target.checked)}
              />
              <Label htmlFor="kycRequired">Требуется KYC для инвесторов</Label>
            </div>

            <div>
              <Label>Юридические документы</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Договор о токенизации</span>
                  <Badge variant="outline">Обязательно</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Соглашение о рисках</span>
                  <Badge variant="outline">Обязательно</Badge>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-green-800">Готово к созданию!</h3>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Проверьте данные перед созданием актива
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Название</Label>
                <p className="text-sm font-medium">{assetData.name}</p>
              </div>
              <div>
                <Label>Категория</Label>
                <p className="text-sm font-medium">
                  {categories.find(c => c.value === assetData.category)?.label}
                </p>
              </div>
              <div>
                <Label>Общее количество токенов</Label>
                <p className="text-sm font-medium">{assetData.totalSupply}</p>
              </div>
              <div>
                <Label>Цена за токен</Label>
                <p className="text-sm font-medium">{assetData.pricePerToken} SOL</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Создание токенизированного актива
        </CardTitle>
        <CardDescription>
          Пошаговый мастер для создания нового актива
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Шаг {currentStep} из {steps.length}</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Title */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{steps[currentStep - 1].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Назад
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Далее
            </Button>
          ) : (
            <Button
              onClick={handleCreateAsset}
              disabled={loading || !connected}
            >
              {loading ? 'Создание...' : 'Создать актив'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
