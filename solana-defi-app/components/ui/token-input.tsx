"use client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Token {
  symbol: string
  name: string
  icon: string
  balance?: string
}

interface TokenInputProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  selectedToken: Token
  onTokenChange: (token: Token) => void
  tokens: Token[]
  disabled?: boolean
}

export function TokenInput({
  label,
  value,
  onValueChange,
  selectedToken,
  onTokenChange,
  tokens,
  disabled = false,
}: TokenInputProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">{label}</label>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 min-w-[120px] bg-transparent">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {selectedToken.icon}
                  </div>
                  <span className="font-semibold">{selectedToken.symbol}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tokens.map((token) => (
                  <DropdownMenuItem
                    key={token.symbol}
                    onClick={() => onTokenChange(token)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-primary-foreground text-xs font-semibold">
                      {token.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{token.name}</div>
                    </div>
                    {token.balance && <div className="ml-auto text-xs text-muted-foreground">{token.balance}</div>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="number"
              placeholder="0.00"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              disabled={disabled}
              className="flex-1 text-right text-lg font-semibold"
            />
          </div>
          {selectedToken.balance && (
            <div className="text-xs text-muted-foreground text-right">Balance: {selectedToken.balance}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
