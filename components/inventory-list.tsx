"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  current_stock: number
  unit: string
  min_stock_level: number
  categories: { name: string } | null
}

interface InventoryListProps {
  products: Product[]
}

export function InventoryList({ products }: InventoryListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No Items Yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first product to get started
          </p>
          <p className="text-sm text-muted-foreground">
            अपना पहला प्रोडक्ट जोड़ें
          </p>
          <Link href="/inventory?action=add">
            <Button className="mt-4">Add First Item / पहला सामान जोड़ें</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {products.map((product) => {
        const isLowStock = product.current_stock < product.min_stock_level
        
        return (
          <Card
            key={product.id}
            className={isLowStock ? "border-destructive/50 bg-destructive/5" : ""}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {product.name}
                    </h3>
                    {isLowStock && (
                      <Badge variant="destructive" className="text-xs">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {product.categories?.name && (
                      <Badge variant="secondary" className="text-xs">
                        {product.categories.name}
                      </Badge>
                    )}
                    <span>Min: {product.min_stock_level} {product.unit}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${isLowStock ? "text-destructive" : "text-foreground"}`}>
                      {product.current_stock}
                    </p>
                    <p className="text-xs text-muted-foreground">{product.unit}</p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Link href={`/inventory?action=stock-in&product=${product.id}`}>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-card">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="sr-only">Stock In</span>
                      </Button>
                    </Link>
                    <Link href={`/inventory?action=stock-out&product=${product.id}`}>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-card">
                        <TrendingDown className="w-4 h-4 text-orange-500" />
                        <span className="sr-only">Stock Out</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
