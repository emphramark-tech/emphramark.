import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { QuickActions } from "@/components/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch stats
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  const { data: allProducts } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user?.id)
  
  const lowStockCount = allProducts?.filter(p => p.current_stock < p.min_stock_level).length || 0

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*, products(name)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Calculate today's stock in/out
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: todayTransactions } = await supabase
    .from("transactions")
    .select("type, quantity")
    .eq("user_id", user?.id)
    .gte("created_at", today.toISOString())

  const todayStockIn = todayTransactions?.filter(t => t.type === "in").reduce((sum, t) => sum + Number(t.quantity), 0) || 0
  const todayStockOut = todayTransactions?.filter(t => t.type === "out").reduce((sum, t) => sum + Number(t.quantity), 0) || 0

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Namaste! नमस्ते!
        </h1>
        <p className="text-muted-foreground">
          {user?.user_metadata?.store_name || "Your Store"} - Today&apos;s Overview
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{totalProducts || 0}</p>
            <p className="text-sm text-muted-foreground">कुल सामान</p>
          </CardContent>
        </Card>

        <Card className={lowStockCount > 0 ? "border-destructive/50 bg-destructive/5" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? "text-destructive" : ""}`} />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${lowStockCount > 0 ? "text-destructive" : "text-foreground"}`}>
              {lowStockCount}
            </p>
            <p className="text-sm text-muted-foreground">कम स्टॉक</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Stock In Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">+{todayStockIn}</p>
            <p className="text-sm text-muted-foreground">आज आया</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              Stock Out Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">-{todayStockOut}</p>
            <p className="text-sm text-muted-foreground">आज गया</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity / हाल की गतिविधि</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions && recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "in"
                          ? "bg-primary/10 text-primary"
                          : "bg-orange-500/10 text-orange-500"
                      }`}
                    >
                      {transaction.type === "in" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.products?.name || "Unknown Product"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.type === "in" ? "text-primary" : "text-orange-500"
                    }`}
                  >
                    {transaction.type === "in" ? "+" : "-"}
                    {transaction.quantity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No recent activity / कोई हालिया गतिविधि नहीं
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
