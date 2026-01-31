"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface AddProductDialogProps {
  open: boolean
  categories: Category[]
  userId: string
}

export function AddProductDialog({ open, categories, userId }: AddProductDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [currentStock, setCurrentStock] = useState("0")
  const [unit, setUnit] = useState("pcs")
  const [minStockLevel, setMinStockLevel] = useState("5")
  const [categoryId, setCategoryId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    router.push("/inventory")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from("products").insert({
      name,
      current_stock: parseFloat(currentStock) || 0,
      unit,
      min_stock_level: parseFloat(minStockLevel) || 5,
      category_id: categoryId || null,
      user_id: userId,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setName("")
      setCurrentStock("0")
      setUnit("pcs")
      setMinStockLevel("5")
      setCategoryId("")
      router.push("/inventory")
      router.refresh()
    }
  }

  const units = [
    { value: "pcs", label: "Pieces / पीस" },
    { value: "kg", label: "Kilogram / किलो" },
    { value: "g", label: "Gram / ग्राम" },
    { value: "l", label: "Liter / लीटर" },
    { value: "ml", label: "Milliliter / मिली" },
    { value: "pack", label: "Pack / पैक" },
    { value: "box", label: "Box / बॉक्स" },
    { value: "dozen", label: "Dozen / दर्जन" },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Item / नया सामान जोड़ें</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Item Name / सामान का नाम</Label>
            <Input
              id="name"
              placeholder="e.g., Toor Dal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock" className="text-base">Current Stock / वर्तमान स्टॉक</Label>
              <Input
                id="currentStock"
                type="number"
                placeholder="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                required
                min="0"
                step="0.01"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-base">Unit / इकाई</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minStockLevel" className="text-base">
              Minimum Stock Alert / कम स्टॉक अलर्ट
            </Label>
            <Input
              id="minStockLevel"
              type="number"
              placeholder="5"
              value={minStockLevel}
              onChange={(e) => setMinStockLevel(e.target.value)}
              min="0"
              step="0.01"
              className="h-12 text-base"
            />
            <p className="text-sm text-muted-foreground">
              Alert when stock falls below this / इस से कम होने पर अलर्ट
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-base">Category / श्रेणी</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select category / श्रेणी चुनें" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 bg-transparent"
            >
              Cancel / रद्द करें
            </Button>
            <Button type="submit" className="flex-1 h-12" disabled={loading}>
              {loading ? "Adding..." : "Add Item / जोड़ें"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
