// ENHANCED FRONTEND: Распределение дохода
// =======================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calculator, 
  Send, 
  History,
  PieChart,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface RevenueDistribution {
  id: string;
  assetId: string;
  totalRevenue: number;
  distributedRevenue: number;
  remainingRevenue: number;
  distributionMethod: 'proportional' | 'equal' | 'custom';
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

interface TokenHolder {
  address: string;
  tokenAmount: number;
  percentage: number;
  revenueShare: number;
}

const distributionMethods = [
  { value: 'proportional', label: 'Пропорционально доле', description: 'По количеству токенов' },
  { value: 'equal', label: 'Равномерно', description: 'Одинаковая сумма для всех' },
  { value: 'custom', label: 'Пользовательский', description: 'Ручная настройка' }
];

export function RevenueDistribution() {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [revenueAmount, setRevenueAmount] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('proportional');
  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>([]);
  const [distributions, setDistributions] = useState<RevenueDistribution[]>([]);
  const [customDistribution, setCustomDistribution] = useState<Record<string, number>>({});

  // Загрузка данных при монтировании
  useEffect(() => {
    loadTokenHolders();
    loadDistributions();
  }, [selectedAsset]);

  const loadTokenHolders = async () => {
    if (!selectedAsset) return;
    
    try {
      // Здесь будет реальный API вызов
      const mockHolders: TokenHolder[] = [
        { address: 'ABC123...', tokenAmount: 100000, percentage: 40, revenueShare: 0 },
        { address: 'DEF456...', tokenAmount: 75000, percentage: 30, revenueShare: 0 },
        { address: 'GHI789...', tokenAmount: 50000, percentage: 20, revenueShare: 0 },
        { address: 'JKL012...', tokenAmount: 25000, percentage: 10, revenueShare: 0 }
      ];
      setTokenHolders(mockHolders);
    } catch (error) {
      console.error('Error loading token holders:', error);
    }
  };

  const loadDistributions = async () => {
    try {
      // Здесь будет реальный API вызов
      const mockDistributions: RevenueDistribution[] = [
        {
          id: '1',
          assetId: 'asset1',
          totalRevenue: 1000,
          distributedRevenue: 1000,
          remainingRevenue: 0,
          distributionMethod: 'proportional',
          createdAt: '2024-01-15T10:30:00Z',
          status: 'completed'
        }
      ];
      setDistributions(mockDistributions);
    } catch (error) {
      console.error('Error loading distributions:', error);
    }
  };

  const calculateDistribution = () => {
    if (!revenueAmount || !tokenHolders.length) return;

    const totalRevenue = parseFloat(revenueAmount);
    const updatedHolders = tokenHolders.map(holder => {
      let revenueShare = 0;
      
      switch (distributionMethod) {
        case 'proportional':
          revenueShare = (holder.percentage / 100) * totalRevenue;
          break;
        case 'equal':
          revenueShare = totalRevenue / tokenHolders.length;
          break;
        case 'custom':
          revenueShare = customDistribution[holder.address] || 0;
          break;
      }

      return { ...holder, revenueShare };
    });

    setTokenHolders(updatedHolders);
  };

  const handleCustomDistributionChange = (address: string, value: string) => {
    setCustomDistribution(prev => ({
      ...prev,
      [address]: parseFloat(value) || 0
    }));
  };

  const handleDistributeRevenue = async () => {
    if (!connected) {
      toast({
        title: "Ошибка",
        description: "Подключите кошелек для распределения дохода",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/transactions/distribute_revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: selectedAsset,
          totalRevenue: parseFloat(revenueAmount),
          distributionMethod,
          customDistribution: distributionMethod === 'custom' ? customDistribution : undefined,
          creator: publicKey?.toString()
        })
      });

      if (response.ok) {
        toast({
          title: "Успех!",
          description: "Доход успешно распределен",
        });
        setRevenueAmount('');
        loadDistributions();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось распределить доход",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalDistributed = distributions.reduce((sum, dist) => sum + dist.distributedRevenue, 0);
  const totalRevenue = distributions.reduce((sum, dist) => sum + dist.totalRevenue, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Распределение дохода
          </CardTitle>
          <CardDescription>
            Распределите доход от актива между держателями токенов
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="asset">Выберите актив</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите актив" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset1">Люксовая квартира в Манхэттене</SelectItem>
                    <SelectItem value="asset2">Коллекция современного искусства</SelectItem>
                    <SelectItem value="asset3">Технологический стартап</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="revenueAmount">Сумма дохода (SOL)</Label>
                <Input
                  id="revenueAmount"
                  type="number"
                  step="0.01"
                  value={revenueAmount}
                  onChange={(e) => setRevenueAmount(e.target.value)}
                  placeholder="1000.00"
                />
              </div>

              <div>
                <Label htmlFor="distributionMethod">Метод распределения</Label>
                <Select value={distributionMethod} onValueChange={setDistributionMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {distributionMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div>
                          <div className="font-medium">{method.label}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateDistribution}
                disabled={!revenueAmount || !selectedAsset}
                className="w-full"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Рассчитать распределение
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Держатели токенов</h3>
                <Badge variant="outline">{tokenHolders.length} держателей</Badge>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tokenHolders.map((holder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{holder.address}</div>
                      <div className="text-xs text-muted-foreground">
                        {holder.tokenAmount.toLocaleString()} токенов ({holder.percentage}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {holder.revenueShare.toFixed(2)} SOL
                      </div>
                      {distributionMethod === 'custom' && (
                        <Input
                          type="number"
                          step="0.01"
                          value={customDistribution[holder.address] || ''}
                          onChange={(e) => handleCustomDistributionChange(holder.address, e.target.value)}
                          className="w-20 h-8 text-xs"
                          placeholder="0.00"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Итого к распределению</h3>
                <p className="text-2xl font-bold">{revenueAmount || '0.00'} SOL</p>
              </div>
              <Button 
                onClick={handleDistributeRevenue}
                disabled={loading || !connected || !revenueAmount}
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Распределение...' : 'Распределить доход'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="holders">Держатели</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                История распределений
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributions.map((distribution) => (
                  <div key={distribution.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        distribution.status === 'completed' ? 'bg-green-500' : 
                        distribution.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium">
                          {distribution.totalRevenue} SOL распределено
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(distribution.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        distribution.status === 'completed' ? 'default' :
                        distribution.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {distribution.status === 'completed' ? 'Завершено' :
                         distribution.status === 'pending' ? 'В процессе' : 'Ошибка'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Общий доход</p>
                    <p className="text-2xl font-bold">{totalRevenue.toFixed(2)} SOL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Распределено</p>
                    <p className="text-2xl font-bold">{totalDistributed.toFixed(2)} SOL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Держателей</p>
                    <p className="text-2xl font-bold">{tokenHolders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="holders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Держатели токенов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokenHolders.map((holder, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {holder.address.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{holder.address}</div>
                        <div className="text-sm text-muted-foreground">
                          {holder.tokenAmount.toLocaleString()} токенов
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{holder.percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {holder.revenueShare.toFixed(2)} SOL
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
