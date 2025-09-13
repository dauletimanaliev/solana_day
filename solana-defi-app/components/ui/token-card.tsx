"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TokenCardProps {
  icon: string
  name: string
  symbol: string
  balance: string
  rate?: string
  action?: "deposit" | "borrow" | "swap"
  onAction?: () => void
  className?: string
}

export function TokenCard({ icon, name, symbol, balance, rate, action, onAction, className }: TokenCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-primary-foreground font-semibold">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{name}</h3>
              <p className="text-xs text-muted-foreground">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">{balance}</p>
            {rate && <p className="text-xs text-muted-foreground">{rate}</p>}
          </div>
        </div>
        {action && onAction && (
          <Button onClick={onAction} className="w-full mt-3 bg-solana-gradient hover:opacity-90 text-white" size="sm">
            {action === "deposit" && "Deposit"}
            {action === "borrow" && "Borrow"}
            {action === "swap" && "Swap"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
