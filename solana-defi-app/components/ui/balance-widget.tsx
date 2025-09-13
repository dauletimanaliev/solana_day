"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BalanceWidgetProps {
  totalBalance: string
  usdcBalance: string
  solBalance: string
}

export function BalanceWidget({ totalBalance, usdcBalance, solBalance }: BalanceWidgetProps) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <Card className="bg-solana-gradient text-white border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium opacity-90">Total Balance</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{isVisible ? totalBalance : "••••••"}</h2>
          <div className="flex justify-between text-sm opacity-90">
            <span>USDC: {isVisible ? usdcBalance : "••••"}</span>
            <span>SOL: {isVisible ? solBalance : "••••"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
