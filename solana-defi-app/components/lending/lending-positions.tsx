"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HealthFactorBar } from "@/components/ui/health-factor-bar"
import { Plus, Minus, AlertTriangle } from "lucide-react"

interface Position {
  type: "supply" | "borrow"
  asset: string
  icon: string
  amount: number
  value: number
  apy: number
}

const positions: Position[] = [
  { type: "supply", asset: "SOL", icon: "◎", amount: 5.2, value: 512.34, apy: 4.2 },
  { type: "supply", asset: "USDC", icon: "$", amount: 1000, value: 1000, apy: 3.5 },
  { type: "borrow", asset: "USDC", icon: "$", amount: 500, value: 500, apy: 5.2 },
]

export function LendingPositions() {
  const totalSupplied = positions.filter((p) => p.type === "supply").reduce((sum, p) => sum + p.value, 0)
  const totalBorrowed = positions.filter((p) => p.type === "borrow").reduce((sum, p) => sum + p.value, 0)
  const netAPY = 2.8
  const healthFactor = 75

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="opensea-card p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Your Positions</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm text-muted-foreground">Total Supplied</p>
              <p className="text-2xl font-bold text-green-500">${totalSupplied.toLocaleString()}</p>
            </div>

            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-sm text-muted-foreground">Total Borrowed</p>
              <p className="text-2xl font-bold text-red-500">${totalBorrowed.toLocaleString()}</p>
            </div>

            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">Net APY</p>
              <p className="text-2xl font-bold text-primary">+{netAPY}%</p>
            </div>
          </div>

          {/* Health Factor */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Health Factor</span>
              {healthFactor < 50 && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
            </div>
            <HealthFactorBar healthFactor={healthFactor} />
          </div>
        </div>
      </Card>

      {/* Positions List */}
      <Card className="opensea-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Active Positions</h3>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <Plus className="w-3 h-3 mr-1" />
                Supply
              </Button>
              <Button size="sm" variant="outline">
                <Minus className="w-3 h-3 mr-1" />
                Borrow
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {positions.map((position, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-solana-gradient flex items-center justify-center text-white">
                    {position.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{position.asset}</p>
                      <Badge
                        variant={position.type === "supply" ? "default" : "destructive"}
                        className="text-xs capitalize"
                      >
                        {position.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {position.amount} {position.asset} • ${position.value.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${position.type === "supply" ? "text-green-500" : "text-red-500"}`}
                  >
                    {position.type === "supply" ? "+" : "-"}
                    {position.apy}% APY
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      {position.type === "supply" ? "Withdraw" : "Repay"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      {position.type === "supply" ? "Add" : "Borrow More"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
