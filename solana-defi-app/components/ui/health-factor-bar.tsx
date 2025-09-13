import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HealthFactorBarProps {
  healthFactor: number // 0-100
  className?: string
}

export function HealthFactorBar({ healthFactor, className }: HealthFactorBarProps) {
  const getHealthColor = (factor: number) => {
    if (factor >= 70) return "bg-green-500"
    if (factor >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getHealthText = (factor: number) => {
    if (factor >= 70) return "Healthy"
    if (factor >= 40) return "Moderate Risk"
    return "High Risk"
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Health Factor</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{getHealthText(healthFactor)}</span>
            <span className="text-sm font-semibold">{healthFactor}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={cn("h-2 rounded-full transition-all", getHealthColor(healthFactor))}
              style={{ width: `${healthFactor}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
