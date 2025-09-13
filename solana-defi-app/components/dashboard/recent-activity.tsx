"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Repeat, Coins } from "lucide-react"

interface Transaction {
  id: string
  type: "swap" | "lend" | "borrow" | "transfer"
  amount: string
  token: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

const recentTransactions: Transaction[] = [
  {
    id: "1",
    type: "swap",
    amount: "2.5 SOL",
    token: "USDC",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    type: "lend",
    amount: "1000 USDC",
    token: "USDC",
    timestamp: "1 day ago",
    status: "completed",
  },
  {
    id: "3",
    type: "transfer",
    amount: "0.5 SOL",
    token: "SOL",
    timestamp: "2 days ago",
    status: "completed",
  },
]

export function RecentActivity() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "swap":
        return <Repeat className="w-4 h-4" />
      case "lend":
        return <ArrowUpRight className="w-4 h-4" />
      case "borrow":
        return <ArrowDownLeft className="w-4 h-4" />
      case "transfer":
        return <Coins className="w-4 h-4" />
      default:
        return <Coins className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card className="opensea-card p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>

        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{tx.amount}</p>
                <Badge className={`text-xs ${getStatusColor(tx.status)}`}>{tx.status}</Badge>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors">
          View all transactions
        </button>
      </div>
    </Card>
  )
}
