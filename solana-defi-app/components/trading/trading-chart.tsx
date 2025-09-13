"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export function TradingChart() {
  return (
    <Card className="opensea-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground">SOL/USDC</h3>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2%
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">$98.45</div>
            <div className="text-sm text-green-500">+$4.89 (5.2%)</div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-64 bg-gradient-to-br from-primary/5 to-chart-2/5 rounded-lg flex items-center justify-center border border-border">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Trading Chart</p>
            <p className="text-xs text-muted-foreground mt-1">Real-time price data</p>
          </div>
        </div>

        {/* Time Frame Buttons */}
        <div className="flex items-center gap-2">
          {["1m", "5m", "15m", "1h", "4h", "1d"].map((timeframe) => (
            <Button key={timeframe} variant={timeframe === "1h" ? "default" : "outline"} size="sm" className="text-xs">
              {timeframe}
            </Button>
          ))}
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">24h High</p>
            <p className="text-sm font-medium text-foreground">$99.12</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">24h Low</p>
            <p className="text-sm font-medium text-foreground">$92.34</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">24h Volume</p>
            <p className="text-sm font-medium text-foreground">12.4K SOL</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm font-medium text-foreground">$45.2B</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
