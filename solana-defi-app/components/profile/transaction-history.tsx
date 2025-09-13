"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Repeat, Coins, ExternalLink } from "lucide-react"

interface Transaction {
  id: string
  type: "swap" | "lend" | "borrow" | "transfer" | "supply" | "withdraw"
  fromToken: string
  toToken?: string
  amount: string
  value: number
  timestamp: string
  status: "completed" | "pending" | "failed"
  txHash: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "swap",
    fromToken: "SOL",
    toToken: "USDC",
    amount: "2.5 SOL",
    value: 246.13,
    timestamp: "2024-01-15 14:30",
    status: "completed",
    txHash: "5KJp...9mN2",
  },
  {
    id: "2",
    type: "supply",
    fromToken: "USDC",
    amount: "1000 USDC",
    value: 1000,
    timestamp: "2024-01-15 12:15",
    status: "completed",
    txHash: "8Xm2...4kL9",
  },
  {
    id: "3",
    type: "borrow",
    fromToken: "USDC",
    amount: "500 USDC",
    value: 500,
    timestamp: "2024-01-14 16:45",
    status: "completed",
    txHash: "3Nq7...8pR5",
  },
  {
    id: "4",
    type: "transfer",
    fromToken: "SOL",
    amount: "0.5 SOL",
    value: 49.23,
    timestamp: "2024-01-14 10:20",
    status: "completed",
    txHash: "9Wr4...2mK8",
  },
]

export function TransactionHistory() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "swap":
        return <Repeat className="w-4 h-4" />
      case "supply":
      case "lend":
        return <ArrowUpRight className="w-4 h-4" />
      case "borrow":
      case "withdraw":
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground capitalize">{tx.type}</p>
                    <Badge className={`text-xs ${getStatusColor(tx.status)}`}>{tx.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tx.amount}
                    {tx.toToken && ` → ${tx.toToken}`} • {tx.timestamp}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-foreground">${tx.value.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <code className="text-xs text-muted-foreground">{tx.txHash}</code>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          Load More Transactions
        </Button>
      </div>
    </Card>
  )
}
