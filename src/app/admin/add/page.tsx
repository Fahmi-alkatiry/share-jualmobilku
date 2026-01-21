"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createCar } from "@/lib/actions"
import { Loader2, Upload, Video, ImagePlus } from "lucide-react"

export default function AddCarPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    try {
      const result = await createCar(formData)
      if (result?.success) {
        alert("Mobil berhasil ditambahkan ke katalog!")
        router.push("/admin")
        router.refresh()
      } else {
        alert("Gagal menyimpan data. Pastikan semua file tidak terlalu besar.")
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            Tambah Unit Mobil Baru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={handleSubmit} className="space-y-6">
            
            {/* Informasi Dasar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Merek</label>
                <Input name="brand" placeholder="Contoh: Toyota, Honda" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Model</label>
                <Input name="model" placeholder="Contoh: Avanza, Civic" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Tahun</label>
                <Input name="year" type="number" placeholder="Contoh: 2022" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Harga Jual (Rp)</label>
                <Input name="price" type="number" placeholder="Contoh: 150000000" required />
              </div>
            </div>

            <SeparatorLabel label="Detail Teknis" />

            {/* Detail Teknis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Jarak Tempuh (KM)</label>
                <Input name="mileage" type="number" placeholder="Contoh: 45000"  />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Warna</label>
                <Input name="color" placeholder="Contoh: Putih Pearl" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Transmisi</label>
                <select name="transmission" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Masa Pajak</label>
                <Input name="taxExpiry" type="date" required />
              </div>
            </div>

            {/* Dokumen & Deskripsi */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Nomor Polisi</label>
                <Input name="licensePlate" placeholder="Contoh: B 1234 ABC" required className="uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Kepemilikan STNK</label>
                <Input name="stnkOwnership" placeholder="Contoh: Tangan Pertama / Atas Nama PT" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Deskripsi Kendaraan</label>
                <textarea 
                  name="description" 
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ceritakan kondisi mesin, ban, servis rutin, dll..."
                />
              </div>
            </div>

            <SeparatorLabel label="Media Promosi" />

            {/* Upload Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border-2 border-dashed rounded-xl bg-blue-50/30">
                <label className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-2">
                  <ImagePlus className="h-4 w-4" /> Foto Mobil
                </label>
                <Input 
                  name="images" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  required 
                  className="bg-white"
                />
                <p className="text-[10px] text-muted-foreground mt-2 italic">Bisa pilih banyak foto sekaligus</p>
              </div>

              <div className="p-4 border-2 border-dashed rounded-xl bg-purple-50/30">
                <label className="flex items-center gap-2 text-sm font-bold text-purple-700 mb-2">
                  <Video className="h-4 w-4" /> Video Review (MP4)
                </label>
                <Input 
                  name="video" 
                  type="file" 
                  accept="video/mp4" 
                  className="bg-white"
                />
                <p className="text-[10px] text-muted-foreground mt-2 italic">Opsional. Disarankan durasi &lt; 1 menit</p>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sedang Mengupload...
                </>
              ) : (
                "SIMPAN DAN PUBLIKASI"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function SeparatorLabel({ label }: { label: string }) {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-slate-200"></span>
      </div>
      <div className="relative flex justify-start">
        <span className="bg-white pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
    </div>
  )
}