"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation" // 1. Import ini
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter() // 2. Definisikan ini di dalam komponen
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Kita gunakan signIn dari next-auth/react
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, // Agar tidak otomatis redirect jika error
      })

      if (result?.error) {
        setError("Username atau Password salah!")
      } else {
        // 3. Sekarang router.push akan berfungsi
        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-black italic">LOGIN ADMIN</CardTitle>
          <p className="text-sm text-muted-foreground">Masukkan kredensial untuk akses dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <p className="text-center text-[10px] font-black uppercase text-red-500 bg-red-50 py-2 rounded">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 font-bold h-12">
              MASUK KE DASHBOARD
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}