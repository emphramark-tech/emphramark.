"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, TrendingUp, TrendingDown } from "lucide-react"

export function InventoryHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`/inventory?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">सामान की सूची</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search items... / सामान खोजें..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => router.push("/inventory?action=add")}
          className="h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Add Item</span>
          <span className="sm:hidden">Add</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/inventory?action=stock-in")}
          className="h-12 bg-card"
        >
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          <span className="hidden sm:inline">Stock In</span>
          <span className="sm:hidden">In</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/inventory?action=stock-out")}
          className="h-12 bg-card"
        >
          <TrendingDown className="w-5 h-5 mr-2 text-orange-500" />
          <span className="hidden sm:inline">Stock Out</span>
          <span className="sm:hidden">Out</span>
        </Button>
      </div>
    </div>
  )
}
