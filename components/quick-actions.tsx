"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Link href="/inventory?action=add">
        <Button
          variant="outline"
          className="w-full h-auto flex-col py-4 gap-2 bg-card hover:bg-accent"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium">Add Item</span>
          <span className="text-xs text-muted-foreground">नया सामान</span>
        </Button>
      </Link>
      
      <Link href="/inventory?action=stock-in">
        <Button
          variant="outline"
          className="w-full h-auto flex-col py-4 gap-2 bg-card hover:bg-accent"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium">Stock In</span>
          <span className="text-xs text-muted-foreground">सामान आया</span>
        </Button>
      </Link>
      
      <Link href="/inventory?action=stock-out">
        <Button
          variant="outline"
          className="w-full h-auto flex-col py-4 gap-2 bg-card hover:bg-accent"
        >
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-orange-500" />
          </div>
          <span className="text-xs font-medium">Stock Out</span>
          <span className="text-xs text-muted-foreground">सामान गया</span>
        </Button>
      </Link>
    </div>
  )
}
