import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Package, CheckCircle } from "lucide-react"

export default async function RestockPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all products to filter low stock
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("user_id", user?.id)
    .order("current_stock")

  // Filter products where current_stock is below min_stock_level
  const lowStockProducts = products?.filter(p => p.current_stock < p.min_stock_level) || []
  const criticalStock = lowStockProducts.filter(p => p.current_stock === 0)
  const warningStock = lowStockProducts.filter(p => p.current_stock > 0)

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Restock Report</h1>
        <p className="text-muted-foreground">री-स्टॉक रिपोर्ट</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={criticalStock.length > 0 ? "border-destructive bg-destructive/5" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{criticalStock.length}</p>
            <p className="text-sm text-muted-foreground">स्टॉक खत्म</p>
          </CardContent>
        </Card>

        <Card className={warningStock.length > 0 ? "border-orange-500/50 bg-orange-500/5" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{warningStock.length}</p>
            <p className="text-sm text-muted-foreground">कम स्टॉक</p>
          </CardContent>
        </Card>
      </div>

      {/* Restock List */}
      {lowStockProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">All Stocked Up!</h3>
            <p className="text-muted-foreground">
              No items need restocking right now
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              अभी कोई सामान री-स्टॉक करने की जरूरत नहीं है
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Critical - Out of Stock */}
          {criticalStock.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Out of Stock - Urgent! / स्टॉक खत्म - तुरंत मंगाएं!
              </h2>
              {criticalStock.map((product) => (
                <Card key={product.id} className="border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-5 h-5 text-destructive" />
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <Badge variant="destructive">OUT</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {product.categories?.name && (
                            <Badge variant="secondary" className="text-xs">
                              {product.categories.name}
                            </Badge>
                          )}
                          <span>Need: {product.min_stock_level} {product.unit}</span>
                        </div>
                      </div>
                      <Link href={`/inventory?action=stock-in&product=${product.id}`}>
                        <Button size="sm" className="h-10">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Restock
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Warning - Low Stock */}
          {warningStock.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-semibold text-orange-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Low Stock - Order Soon / कम स्टॉक - जल्दी मंगाएं
              </h2>
              {warningStock.map((product) => (
                <Card key={product.id} className="border-orange-500/30 bg-orange-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-5 h-5 text-orange-500" />
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <Badge variant="outline" className="text-orange-500 border-orange-500">
                            {product.current_stock} left
                          </Badge>
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
                      <Link href={`/inventory?action=stock-in&product=${product.id}`}>
                        <Button size="sm" variant="outline" className="h-10 bg-card">
                          <TrendingUp className="w-4 h-4 mr-1 text-primary" />
                          Restock
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
