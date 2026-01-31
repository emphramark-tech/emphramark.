import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription className="text-lg">प्रमाणीकरण त्रुटि</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-lg">
            Something went wrong during authentication. Please try again.
          </p>
          <p className="text-muted-foreground">
            प्रमाणीकरण के दौरान कुछ गलत हो गया। कृपया पुनः प्रयास करें।
          </p>
          <Button asChild className="w-full h-12 text-lg">
            <Link href="/auth/login">Try Again / पुनः प्रयास करें</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
