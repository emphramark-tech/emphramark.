"use client"

import React from "react"

import { useState, useEffect } from "react"
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
import { TrendingUp, TrendingDown } from "lucide-react"

interface Product {
  id: string
  name: string
  current_stock: number
  unit: string
}

interface StockActionDialogProps {
  open: boolean
  type: "in" | "out"
  products: Product[]
  selectedProductId?: string
  userId: string
}

export function StockActionDialog({
  open,
  type,
  products,
  selectedProductId,
  userId,
}: StockActionDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [productId, setProductId] = useState(selectedProductId || "")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedProductId) {
      setProductId(selectedProductId)
    }
  }, [selectedProductId])

  const selectedProduct = products.find((p) => p.id === productId)
  const isStockIn = type === "in"

  const handleClose = () => {
    setProductId("")
    setQuantity("")
    setNotes("")
    setError(null)
    router.push("/inventory")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const qty = Number.parseFloat(quantity)
    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Please enter a valid quantity")
      setLoading(false)
      return
    }

    if (!isStockIn && selectedProduct && qty > selectedProduct.current_stock) {
      setError(`Not enough stock. Available: ${selectedProduct.current_stock} ${selectedProduct.unit}`)
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Record transaction
    const { error: transactionError } = await supabase.from("transactions").insert({
      product_id: productId,
      type,
      quantity: qty,
      notes: notes || null,
      user_id: userId,
    })

    if (transactionError) {
      setError(transactionError.message)
      setLoading(false)
      return
    }

    // Update product current_stock
    const newStock = isStockIn
      ? (selectedProduct?.current_stock || 0) + qty
      : (selectedProduct?.current_stock || 0) - qty

    const { error: updateError } = await supabase
      .from("products")
      .update({ current_stock: newStock, updated_at: new Date().toISOString() })
      .eq("id", productId)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    handleClose()
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isStockIn ? (
              <>
                <TrendingUp className="w-6 h-6 text-primary" />
                Stock In / सामान आया
              </>
            ) : (
              <>
                <TrendingDown className="w-6 h-6 text-orange-500" />
                Stock Out / सामान गया
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product" className="text-base">
              Select Item / सामान चुनें
            </Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Choose an item..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <span className="flex items-center justify-between gap-4">
                      <span>{product.name}</span>
                      <span className="text-muted-foreground">
                        ({product.current_stock} {product.unit})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current Stock / मौजूदा स्टॉक</p>
              <p className="text-2xl font-bold text-foreground">
                {selectedProduct.current_stock} {selectedProduct.unit}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-base">
              {isStockIn ? "Quantity Received / प्राप्त मात्रा" : "Quantity Sold / बेची गई मात्रा"}
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity..."
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0.01"
              step="0.01"
              max={!isStockIn && selectedProduct ? selectedProduct.current_stock : undefined}
              className="h-12 text-base text-2xl font-bold text-center"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base">
              Notes (Optional) / नोट्स
            </Label>
            <Input
              id="notes"
              placeholder="e.g., From ABC Supplier"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-12 text-base"
            />
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
            <Button
              type="submit"
              className={`flex-1 h-12 ${!isStockIn ? "bg-orange-500 hover:bg-orange-600" : ""}`}
              disabled={loading || !productId}
            >
              {loading
                ? "Saving..."
                : isStockIn
                ? "Add Stock / स्टॉक जोड़ें"
                : "Remove Stock / स्टॉक घटाएं"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
