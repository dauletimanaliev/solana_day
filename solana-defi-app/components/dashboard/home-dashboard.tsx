"use client"

import { useState } from "react"
import { TopBar } from "@/components/ui/top-bar"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { BalanceWidget } from "@/components/ui/balance-widget"
import { TokenCard } from "@/components/ui/token-card"
import { HealthFactorBar } from "@/components/ui/health-factor-bar"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Plus } from "lucide-react"

interface HomeDashboardProps {
  connectedWallet: string | null
}

export function HomeDashboard({ connectedWallet }: HomeDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "trade" | "profile">("home")

  const tokens = [
    { icon: "◎", name: "Solana", symbol: "SOL", balance: "12.45 SOL", rate: "$2,180.50" },
    { icon: "💵", name: "USD Coin", symbol: "USDC", balance: "1,250.00 USDC", rate: "$1.00" },
    { icon: "🐕", name: "Bonk", symbol: "BONK", balance: "1,000,000 BONK", rate: "$0.000012" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="SolanaFi" />

      <div className="p-4 space-y-6">
        {/* Balance Widget */}
        <BalanceWidget totalBalance="$29,430.50" usdcBalance="$1,250.00" solBalance="$27,180.50" />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-solana-gradient hover:opacity-90 text-white py-6 flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Swap
          </Button>
          <Button variant="outline" className="py-6 flex items-center gap-2 bg-transparent">
            <Plus className="h-5 w-5" />
            Lend
          </Button>
        </div>

        {/* Health Factor (if user has loans) */}
        <HealthFactorBar healthFactor={75} />

        {/* Token List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Your Assets</h3>
          {tokens.map((token, index) => (
            <TokenCard
              key={index}
              icon={token.icon}
              name={token.name}
              symbol={token.symbol}
              balance={token.balance}
              rate={token.rate}
            />
          ))}
        </div>

        {/* Connected Wallet Info */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Connected with {connectedWallet} •<span className="font-mono"> 7x8k...9mN2</span>
          </p>
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
