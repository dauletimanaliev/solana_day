"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TrendingToken {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  icon: string
}

const trendingTokens: TrendingToken[] = [
  {
    id: "1",
    name: "Solana",
    symbol: "SOL",
    price: 98.45,
    change24h: 5.2,
    icon: "/solana-logo.png",
  },
  {
    id: "2",
    name: "Serum",
    symbol: "SRM",
    price: 0.85,
    change24h: -2.1,
    icon: "/serum-token-logo.jpg",
  },
  {
    id: "3",
    name: "Raydium",
    symbol: "RAY",
    price: 1.23,
    change24h: 8.7,
    icon: "/images/ray.png",
  },
  {
    id: "4",
    name: "Mango",
    symbol: "MNGO",
    price: 0.045,
    change24h: 12.3,
    icon: "/mango-token-logo.jpg",
  },
]

export function TrendingTokens() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Trending Tokens</h3>

      <div className="space-y-2">
        {trendingTokens.map((token) => (
          <Card key={token.id} className="p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={token.icon || "/placeholder.svg"} alt={token.name} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-medium text-foreground">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">{token.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-foreground">${token.price}</p>
                <div className="flex items-center gap-1">
                  {token.change24h > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${token.change24h > 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.change24h > 0 ? "+" : ""}
                    {token.change24h}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
