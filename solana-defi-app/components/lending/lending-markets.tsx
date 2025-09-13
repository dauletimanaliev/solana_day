"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface LendingMarket {
  asset: string
  icon: string
  totalSupply: string
  totalBorrow: string
  supplyAPY: number
  borrowAPY: number
  utilization: number
  price: number
}

const lendingMarkets: LendingMarket[] = [
  {
    asset: "SOL",
    icon: "◎",
    totalSupply: "1.2M SOL",
    totalBorrow: "850K SOL",
    supplyAPY: 4.2,
    borrowAPY: 6.8,
    utilization: 70.8,
    price: 98.45,
  },
  {
    asset: "USDC",
    icon: "$",
    totalSupply: "45M USDC",
    totalBorrow: "32M USDC",
    supplyAPY: 3.5,
    borrowAPY: 5.2,
    utilization: 71.1,
    price: 1.0,
  },
  {
    asset: "RAY",
    icon: "⚡",
    totalSupply: "2.8M RAY",
    totalBorrow: "1.9M RAY",
    supplyAPY: 8.7,
    borrowAPY: 12.3,
    utilization: 67.9,
    price: 1.23,
  },
  {
    asset: "SRM",
    icon: "🔥",
    totalSupply: "890K SRM",
    totalBorrow: "620K SRM",
    supplyAPY: 6.4,
    borrowAPY: 9.1,
    utilization: 69.7,
    price: 0.85,
  },
]

export function LendingMarkets() {
  return (
    <Card className="opensea-card p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Lending Markets</h2>
          <p className="text-muted-foreground">Supply assets to earn yield or borrow against your collateral</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Asset</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Total Supply</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Total Borrow</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Supply APY</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Borrow APY</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Utilization</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lendingMarkets.map((market) => (
                <tr key={market.asset} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-solana-gradient flex items-center justify-center text-white text-sm">
                        {market.icon}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{market.asset}</p>
                        <p className="text-xs text-muted-foreground">${market.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <p className="text-sm font-medium text-foreground">{market.totalSupply}</p>
                  </td>
                  <td className="text-right py-4">
                    <p className="text-sm font-medium text-foreground">{market.totalBorrow}</p>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-sm font-medium text-green-500">{market.supplyAPY}%</span>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <span className="text-sm font-medium text-red-500">{market.borrowAPY}%</span>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <Badge variant="outline" className="text-xs">
                      {market.utilization}%
                    </Badge>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        Supply
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        Borrow
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
