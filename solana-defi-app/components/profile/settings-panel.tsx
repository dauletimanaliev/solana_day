"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Shield, Palette, LogOut } from "lucide-react"

export function SettingsPanel() {
  return (
    <Card className="opensea-card p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Settings</h3>

        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Notifications</h4>
          </div>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Transaction Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when transactions complete</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Price Alerts</p>
                <p className="text-xs text-muted-foreground">Notifications for significant price changes</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Lending Updates</p>
                <p className="text-xs text-muted-foreground">Updates on your lending positions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Security</h4>
          </div>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-lock Wallet</p>
                <p className="text-xs text-muted-foreground">Automatically disconnect after inactivity</p>
              </div>
              <Select defaultValue="30min">
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15min</SelectItem>
                  <SelectItem value="30min">30min</SelectItem>
                  <SelectItem value="1hour">1hour</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Transaction Confirmation</p>
                <p className="text-xs text-muted-foreground">Require confirmation for large transactions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Preferences</h4>
          </div>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Currency</p>
                <p className="text-xs text-muted-foreground">Display currency for values</p>
              </div>
              <Select defaultValue="usd">
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="sol">SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Language</p>
                <p className="text-xs text-muted-foreground">Interface language</p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-red-500" />
            <h4 className="font-medium text-foreground">Danger Zone</h4>
          </div>
          <div className="pl-6">
            <Button variant="destructive" size="sm">
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
