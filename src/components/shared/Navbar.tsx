"use client"
import Link from "next/link"
import { Car, LayoutDashboard, PlusCircle, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo & Nama Website */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6 text-blue-600" />
          <span>Jual<span className="text-blue-600">Mobil</span>Ku</span>
        </Link>

        {/* Menu Navigasi */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Katalog</span>
            </Button>
          </Link>

          <div className="h-6 w-[1px] bg-slate-200 mx-2" />

          {/* Bagian Admin */}
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>

          <Link href="/admin/add">
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Jual Mobil</span>
            </Button>
          </Link>
          {session && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}