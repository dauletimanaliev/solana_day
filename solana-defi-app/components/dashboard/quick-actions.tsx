"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUpDown, Coins, TrendingUp, Send, Plus, Minus } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: <ArrowUpDown className="w-5 h-5" />,
      label: "Swap",
      description: "Exchange tokens",
      color: "bg-solana-gradient",
    },
    {
      icon: <Plus className="w-5 h-5" />,
      label: "Lend",
      description: "Earn yield",
      color: "bg-green-500",
    },
    {
      icon: <Minus className="w-5 h-5" />,
      label: "Borrow",
      description: "Get liquidity",
      color: "bg-blue-500",
    },
    {
      icon: <Send className="w-5 h-5" />,
      label: "Send",
      description: "Transfer tokens",
      color: "bg-purple-500",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Stake",
      description: "Earn rewards",
      color: "bg-orange-500",
    },
    {
      icon: <Coins className="w-5 h-5" />,
      label: "Buy",
      description: "Add funds",
      color: "bg-pink-500",
    },
  ]

  return (
    <Card className="opensea-card p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 border-border bg-transparent"
            >
              <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center text-white`}>
                {action.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
