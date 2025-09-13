// ENHANCED FRONTEND: Аналитика портфеля
// =====================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  LineChart,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface PortfolioAsset {
  id: string;
  name: string;
  category: string;
  totalValue: number;
  currentValue: number;
  percentage: number;
  change24h: number;
  change7d: number;
  change30d: number;
  tokens: number;
  revenue: number;
  lastUpdated: string;
}

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalRevenue: number;
  totalReturn: number;
  returnPercentage: number;
  bestPerformer: string;
  worstPerformer: string;
  diversificationScore: number;
}

const timeRanges = [
  { value: '1d', label: '1 день' },
  { value: '7d', label: '7 дней' },
  { value: '30d', label: '30 дней' },
  { value: '90d', label: '90 дней' },
  { value: '1y', label: '1 год' },
  { value: 'all', label: 'Все время' }
];

const categories = [
  { value: 'all', label: 'Все категории' },
  { value: 'real-estate', label: 'Недвижимость' },
  { value: 'art', label: 'Искусство' },
  { value: 'business', label: 'Бизнес' },
  { value: 'commodities', label: 'Сырье' },
  { value: 'intellectual', label: 'ИС' }
];

export function PortfolioAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);

  // Загрузка данных портфеля
  useEffect(() => {
    loadPortfolioData();
  }, [timeRange, selectedCategory]);

  const loadPortfolioData = async () => {
    setLoading(true);
    try {
      // Здесь будет реальный API вызов
      const mockAssets: PortfolioAsset[] = [
        {
          id: '1',
          name: 'Люксовая квартира в Манхэттене',
          category: 'real-estate',
          totalValue: 1000000,
          currentValue: 1050000,
          percentage: 40,
          change24h: 2.5,
          change7d: 8.3,
          change30d: 15.2,
          tokens: 100000,
          revenue: 25000,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Коллекция современного искусства',
          category: 'art',
          totalValue: 500000,
          currentValue: 520000,
          percentage: 20,
          change24h: 1.2,
          change7d: 4.1,
          change30d: 8.7,
          tokens: 50000,
          revenue: 12000,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: '3',
          name: 'Технологический стартап',
          category: 'business',
          totalValue: 750000,
          currentValue: 780000,
          percentage: 30,
          change24h: 3.1,
          change7d: 12.5,
          change30d: 22.8,
          tokens: 75000,
          revenue: 18000,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: '4',
          name: 'Золотые активы',
          category: 'commodities',
          totalValue: 250000,
          currentValue: 255000,
          percentage: 10,
          change24h: 0.8,
          change7d: 2.1,
          change30d: 4.3,
          tokens: 25000,
          revenue: 5000,
          lastUpdated: '2024-01-15T10:30:00Z'
        }
      ];

      const filteredAssets = selectedCategory === 'all' 
        ? mockAssets 
        : mockAssets.filter(asset => asset.category === selectedCategory);

      setAssets(filteredAssets);

      // Расчет статистики
      const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const totalInvested = filteredAssets.reduce((sum, asset) => sum + asset.totalValue, 0);
      const totalRevenue = filteredAssets.reduce((sum, asset) => sum + asset.revenue, 0);
      const totalReturn = totalValue - totalInvested;
      const returnPercentage = (totalReturn / totalInvested) * 100;

      const bestPerformer = filteredAssets.reduce((best, asset) => 
        asset.change30d > best.change30d ? asset : best
      );
      const worstPerformer = filteredAssets.reduce((worst, asset) => 
        asset.change30d < worst.change30d ? asset : worst
      );

      // Простой расчет диверсификации (количество категорий / общее количество активов)
      const uniqueCategories = new Set(filteredAssets.map(asset => asset.category)).size;
      const diversificationScore = (uniqueCategories / filteredAssets.length) * 100;

      setStats({
        totalValue,
        totalInvested,
        totalRevenue,
        totalReturn,
        returnPercentage,
        bestPerformer: bestPerformer.name,
        worstPerformer: worstPerformer.name,
        diversificationScore
      });

    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return showValues ? `$${value.toLocaleString()}` : '••••••';
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4" />;
    if (value < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Аналитика портфеля</h2>
          <p className="text-muted-foreground">Обзор ваших инвестиций и доходности</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPortfolioData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Общая стоимость</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Общая доходность</p>
                  <p className={`text-2xl font-bold ${getChangeColor(stats.returnPercentage)}`}>
                    {formatPercentage(stats.returnPercentage)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <PieChart className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Диверсификация</p>
                  <p className="text-2xl font-bold">{stats.diversificationScore.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Общий доход</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="performance">Доходность</TabsTrigger>
          <TabsTrigger value="allocation">Распределение</TabsTrigger>
          <TabsTrigger value="revenue">Доходы</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Активы портфеля</CardTitle>
              <CardDescription>Детальная информация по каждому активу</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {asset.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.tokens.toLocaleString()} токенов • {asset.percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(asset.currentValue)}</div>
                      <div className={`text-sm flex items-center gap-1 ${getChangeColor(asset.change30d)}`}>
                        {getChangeIcon(asset.change30d)}
                        {formatPercentage(asset.change30d)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Лучший исполнитель</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats?.bestPerformer}</div>
                <p className="text-sm text-muted-foreground">За последние 30 дней</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Худший исполнитель</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats?.worstPerformer}</div>
                <p className="text-sm text-muted-foreground">За последние 30 дней</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Средняя доходность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(assets.reduce((sum, asset) => sum + asset.change30d, 0) / assets.length)}
                </div>
                <p className="text-sm text-muted-foreground">За последние 30 дней</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по категориям</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{asset.name}</span>
                      <span>{asset.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${asset.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Доходы по активам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset.tokens.toLocaleString()} токенов
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        {formatCurrency(asset.revenue)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Доход
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
