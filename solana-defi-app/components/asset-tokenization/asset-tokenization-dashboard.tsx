"use client"

import { useState, useEffect } from "react"
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useSolana } from "@/lib/solana-provider"
import { useToast } from "@/hooks/use-toast"
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import BN from 'bn.js'

interface Asset {
  id: string
  name: string
  totalSupply: number
  remainingSupply: number
  pricePerToken: number
  creator: string
  publicKey?: PublicKey
}

export function AssetTokenizationDashboard() {
  const { program, connection } = useSolana()
  const { publicKey, connected, connect, disconnect } = useWallet()
  const { toast } = useToast()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [newAsset, setNewAsset] = useState({
    name: "",
    totalSupply: "",
    pricePerToken: ""
  })
  const [mintAmount, setMintAmount] = useState("")
  const [revenueAmount, setRevenueAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("")

  // Загружаем демо-активы при монтировании компонента
  useEffect(() => {
    const demoAssets: Asset[] = [
      {
        id: "demo_1",
        name: "Люксовая квартира в Манхэттене",
        totalSupply: 1000000,
        remainingSupply: 750000,
        pricePerToken: 100,
        creator: "Demo Creator 1"
      },
      {
        id: "demo_2",
        name: "Коллекция редкого искусства",
        totalSupply: 500000,
        remainingSupply: 200000,
        pricePerToken: 50,
        creator: "Demo Creator 2"
      }
    ]
    setAssets(demoAssets)
  }, [])

  const handleCreateAsset = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Ошибка",
        description: "Сначала подключите кошелек",
        variant: "destructive",
      })
      return
    }

    if (!newAsset.name || !newAsset.totalSupply || !newAsset.pricePerToken) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      // Для демо создаем локальный актив без блокчейна
      const newAssetData: Asset = {
        id: `asset_${Date.now()}`,
        name: newAsset.name,
        totalSupply: parseInt(newAsset.totalSupply),
        remainingSupply: parseInt(newAsset.totalSupply),
        pricePerToken: parseInt(newAsset.pricePerToken),
        creator: publicKey.toString(),
      }
      
      setAssets([...assets, newAssetData])
      setNewAsset({ name: "", totalSupply: "", pricePerToken: "" })
      
      toast({
        title: "Успешно!",
        description: "Актив успешно создан! (Демо режим)",
        variant: "success",
      })
      
    } catch (error) {
      console.error("Error creating asset:", error)
      toast({
        title: "Ошибка",
        description: "Ошибка при создании актива: " + error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMintTokens = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Ошибка",
        description: "Сначала подключите кошелек",
        variant: "destructive",
      })
      return
    }

    if (!selectedAsset || !mintAmount) {
      toast({
        title: "Ошибка",
        description: "Выберите актив и введите количество",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      // Обновляем актив в локальном состоянии
      setAssets(assets.map(asset => 
        asset.id === selectedAsset 
          ? { 
              ...asset, 
              totalSupply: asset.totalSupply + parseInt(mintAmount),
              remainingSupply: asset.remainingSupply + parseInt(mintAmount)
            }
          : asset
      ))
      
      toast({
        title: "Успешно!",
        description: `Успешно выпущено ${mintAmount} токенов! (Демо режим)`,
        variant: "success",
      })
      setMintAmount("")
      
    } catch (error) {
      console.error("Error minting tokens:", error)
      toast({
        title: "Ошибка",
        description: "Ошибка при выпуске токенов: " + error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDistributeRevenue = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Ошибка",
        description: "Сначала подключите кошелек",
        variant: "destructive",
      })
      return
    }

    if (!selectedAsset || !revenueAmount) {
      toast({
        title: "Ошибка",
        description: "Выберите актив и введите сумму",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      // Для демо просто показываем сообщение
      const selectedAssetData = assets.find(asset => asset.id === selectedAsset)
      toast({
        title: "Успешно!",
        description: `Доходы в размере ${revenueAmount} SOL распределены между держателями токенов актива "${selectedAssetData?.name}"! (Демо режим)`,
        variant: "success",
      })
      setRevenueAmount("")
      
    } catch (error) {
      console.error("Error distributing revenue:", error)
      toast({
        title: "Ошибка",
        description: "Ошибка при распределении доходов: " + error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Asset Tokenization</h1>
          <p className="text-muted-foreground">Простая токенизация активов на Solana</p>
        </div>
        {!connected ? (
          <Button onClick={() => connect()}>Подключить кошелек</Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{publicKey?.toString().slice(0, 8)}...</Badge>
            <Button variant="outline" onClick={() => disconnect()}>Отключить</Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Создание актива */}
        <Card>
          <CardHeader>
            <CardTitle>Создать актив</CardTitle>
            <CardDescription>Токенизируйте реальный актив</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Название актива</Label>
              <Input
                placeholder="Например: Квартира в Манхэттене"
                value={newAsset.name}
                onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Общее количество токенов</Label>
                <Input
                  placeholder="1000000"
                  type="number"
                  value={newAsset.totalSupply}
                  onChange={(e) => setNewAsset({...newAsset, totalSupply: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Цена за токен (SOL)</Label>
                <Input
                  placeholder="100"
                  type="number"
                  value={newAsset.pricePerToken}
                  onChange={(e) => setNewAsset({...newAsset, pricePerToken: e.target.value})}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleCreateAsset}
              disabled={!connected || loading}
              className="w-full"
            >
              {loading ? "Создаем..." : "Создать актив"}
            </Button>
          </CardContent>
        </Card>

        {/* Минтинг токенов */}
        <Card>
          <CardHeader>
            <CardTitle>Выпустить токены</CardTitle>
            <CardDescription>Выпустить дополнительные токены</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Выберите актив</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                <option value="">Выберите актив</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Количество для выпуска</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Введите количество"
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                />
                <Button 
                  onClick={handleMintTokens}
                  disabled={!connected || loading}
                >
                  {loading ? "Выпускаем..." : "Выпустить"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Распределение доходов */}
        <Card>
          <CardHeader>
            <CardTitle>Распределить доходы</CardTitle>
            <CardDescription>Выплатить доходы держателям токенов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Выберите актив</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                <option value="">Выберите актив</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Сумма доходов (SOL)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Введите сумму"
                  type="number"
                  value={revenueAmount}
                  onChange={(e) => setRevenueAmount(e.target.value)}
                />
                <Button 
                  onClick={handleDistributeRevenue}
                  disabled={!connected || loading}
                >
                  {loading ? "Распределяем..." : "Распределить"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Список активов */}
        <Card>
          <CardHeader>
            <CardTitle>Мои активы</CardTitle>
            <CardDescription>Список созданных активов</CardDescription>
          </CardHeader>
          <CardContent>
            {assets.length === 0 ? (
              <p className="text-muted-foreground">Активы не найдены</p>
            ) : (
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-lg">{asset.name}</div>
                      <Badge variant="outline">Активен</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Всего токенов:</span>
                        <div className="font-medium">{asset.totalSupply.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Осталось:</span>
                        <div className="font-medium">{asset.remainingSupply.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Цена за токен:</span>
                        <div className="font-medium">{asset.pricePerToken} SOL</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Продано:</span>
                        <div className="font-medium">
                          {(((asset.totalSupply - asset.remainingSupply) / asset.totalSupply) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Создатель: {asset.creator.slice(0, 8)}... | ID: {asset.id.slice(0, 8)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
