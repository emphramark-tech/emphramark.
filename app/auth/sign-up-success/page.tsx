"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Package } from "lucide-react"

type ResendStatus = {
  type: "success" | "error"
  message: string
} | null

export default function SignUpSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<ResendStatus>(null)

  const handleResend = async () => {
    if (!email) {
      setStatus({
        type: "error",
        message: "Email not found in the link. / ईमेल लिंक में नहीं मिला।",
      })
      return
    }

    setLoading(true)
    setStatus(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    })

    if (error) {
      setStatus({
        type: "error",
        message: `Could not resend email. ${error.message} / ईमेल दोबारा नहीं भेज पाए।`,
      })
    } else {
      setStatus({
        type: "success",
        message: "Confirmation email resent. Please check your inbox. / पुष्टि ईमेल दोबारा भेज दिया गया है।",
      })
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription className="text-lg">अपना ईमेल देखें</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">
              We sent you a confirmation link. Please check your email to activate your account.
            </p>
            <p className="text-muted-foreground">
              हमने आपको एक confirmation link भेजा है। अपना account activate करने के लिए अपना email देखें।
            </p>
            {email ? (
              <p className="text-sm text-muted-foreground">
                Sent to: <span className="font-medium text-foreground">{email}</span>
              </p>
            ) : (
              <p className="text-sm text-destructive">Email not found in the link. / ईमेल लिंक में नहीं मिला।</p>
            )}
          </div>

          {status && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                status.type === "success"
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-lg"
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend Email / ईमेल फिर से भेजें"}
            </Button>
            <Button asChild className="w-full h-12 text-lg">
              <Link href="/auth/login">Back to Login / लॉगिन पर वापस जाएं</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
