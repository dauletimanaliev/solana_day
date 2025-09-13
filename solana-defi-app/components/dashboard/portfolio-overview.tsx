"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface PortfolioOverviewProps {
  totalValue: number
  change24h: number
  solBalance: number
  usdcBalance: number
}

export function PortfolioOverview({ totalValue, change24h, solBalance, usdcBalance }: PortfolioOverviewProps) {
  const isPositive = change24h >= 0

  return (
    <Card className="opensea-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Portfolio Value</h2>
          <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? "+" : ""}
            {change24h.toFixed(2)}%
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-muted-foreground">
            24h change: {isPositive ? "+" : ""}${((totalValue * change24h) / 100).toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-solana-gradient flex items-center justify-center">
              <span className="text-white text-xs font-bold">◎</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{solBalance} SOL</p>
              <p className="text-xs text-muted-foreground">Solana</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{usdcBalance} USDC</p>
              <p className="text-xs text-muted-foreground">USD Coin</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
