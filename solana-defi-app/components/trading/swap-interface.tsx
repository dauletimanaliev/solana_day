"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Settings, Info, ChevronDown } from "lucide-react"

interface Token {
  symbol: string
  name: string
  icon: string
  balance: number
  price: number
}

const tokens: Token[] = [
  { symbol: "SOL", name: "Solana", icon: "◎", balance: 12.45, price: 98.45 },
  { symbol: "USDC", name: "USD Coin", icon: "$", balance: 1250, price: 1.0 },
  { symbol: "RAY", name: "Raydium", icon: "⚡", balance: 45.2, price: 1.23 },
  { symbol: "SRM", name: "Serum", icon: "🔥", balance: 120.5, price: 0.85 },
]

export function SwapInterface() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const calculateToAmount = (amount: string) => {
    if (!amount || isNaN(Number(amount))) return ""
    const fromValue = Number(amount) * fromToken.price
    const toValue = fromValue / toToken.price
    return toValue.toFixed(6)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    setToAmount(calculateToAmount(value))
  }

  return (
    <Card className="opensea-card p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Swap</h2>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm text-muted-foreground">
              Balance: {fromToken.balance} {fromToken.symbol}
            </span>
          </div>

          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="pr-32 text-lg font-medium bg-secondary/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <span className="mr-1">{fromToken.icon}</span>
                <span className="font-medium">{fromToken.symbol}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapTokens}
            className="rounded-full border-border hover:bg-secondary/50 bg-transparent"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-sm text-muted-foreground">
              Balance: {toToken.balance} {toToken.symbol}
            </span>
          </div>

          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="pr-32 text-lg font-medium bg-secondary/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <span className="mr-1">{toToken.icon}</span>
                <span className="font-medium">{toToken.symbol}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && (
          <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="text-foreground">
                1 {fromToken.symbol} = {(toToken.price / fromToken.price).toFixed(6)} {toToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-foreground">{slippage}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="text-foreground">~0.00025 SOL</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          className="w-full bg-solana-gradient hover:opacity-90 text-white py-3"
          disabled={!fromAmount || Number(fromAmount) <= 0}
        >
          {!fromAmount ? "Enter amount" : "Swap"}
        </Button>

        {/* Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="w-3 h-3" />
          <span>Powered by Jupiter aggregator for best rates</span>
        </div>
      </div>
    </Card>
  )
}
