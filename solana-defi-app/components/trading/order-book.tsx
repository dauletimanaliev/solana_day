"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

const buyOrders: OrderBookEntry[] = [
  { price: 98.42, size: 2.5, total: 246.05 },
  { price: 98.41, size: 1.8, total: 177.14 },
  { price: 98.4, size: 3.2, total: 314.88 },
  { price: 98.39, size: 0.9, total: 88.55 },
  { price: 98.38, size: 1.5, total: 147.57 },
]

const sellOrders: OrderBookEntry[] = [
  { price: 98.46, size: 1.2, total: 118.15 },
  { price: 98.47, size: 2.1, total: 206.79 },
  { price: 98.48, size: 0.8, total: 78.78 },
  { price: 98.49, size: 1.9, total: 187.13 },
  { price: 98.5, size: 2.3, total: 226.55 },
]

export function OrderBook() {
  return (
    <Card className="opensea-card p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Order Book</h3>
          <Badge variant="outline" className="text-xs">
            SOL/USDC
          </Badge>
        </div>

        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium">
            <span>Price (USDC)</span>
            <span className="text-right">Size (SOL)</span>
            <span className="text-right">Total</span>
          </div>

          {/* Sell Orders */}
          <div className="space-y-1">
            {sellOrders.reverse().map((order, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-red-500/10 p-1 rounded">
                <span className="text-red-500 font-mono">{order.price.toFixed(2)}</span>
                <span className="text-right text-foreground font-mono">{order.size.toFixed(1)}</span>
                <span className="text-right text-muted-foreground font-mono">{order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Spread */}
          <div className="py-2 text-center">
            <Badge variant="outline" className="text-xs">
              Spread: $0.04 (0.04%)
            </Badge>
          </div>

          {/* Buy Orders */}
          <div className="space-y-1">
            {buyOrders.map((order, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-green-500/10 p-1 rounded">
                <span className="text-green-500 font-mono">{order.price.toFixed(2)}</span>
                <span className="text-right text-foreground font-mono">{order.size.toFixed(1)}</span>
                <span className="text-right text-muted-foreground font-mono">{order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
