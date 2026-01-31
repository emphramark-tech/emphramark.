import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { InventoryList } from "@/components/inventory-list"
import { InventoryHeader } from "@/components/inventory-header"
import { AddProductDialog } from "@/components/add-product-dialog"
import { StockActionDialog } from "@/components/stock-action-dialog"

interface InventoryPageProps {
  searchParams: Promise<{ action?: string; product?: string; search?: string }>
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch categories for the add product form
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  // Fetch products with optional search
  let query = supabase
    .from("products")
    .select("*, categories(name)")
    .eq("user_id", user?.id)
    .order("name")

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  const { data: products } = await query

  return (
    <div className="p-4 md:p-6 space-y-4">
      <InventoryHeader />
      
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <InventoryList products={products || []} />
      </Suspense>

      {/* Dialogs */}
      <AddProductDialog 
        open={params.action === "add"} 
        categories={categories || []} 
        userId={user?.id || ""} 
      />
      
      <StockActionDialog
        open={params.action === "stock-in" || params.action === "stock-out"}
        type={params.action === "stock-in" ? "in" : "out"}
        products={products || []}
        selectedProductId={params.product}
        userId={user?.id || ""}
      />
    </div>
  )
}
