"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateCar } from "@/lib/actions"
import { Loader2 } from "lucide-react"

export default function EditCarForm({ car }: { car: any }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await updateCar(car.id, formData)
    if (result.success) {
      alert("Perubahan berhasil disimpan!")
      router.push("/admin")
      router.refresh()
    }
    setIsPending(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <Input name="brand" defaultValue={car.brand} placeholder="Merek" required />
        <Input name="model" defaultValue={car.model} placeholder="Model" required />
        <Input name="year" type="number" defaultValue={car.year} required />
        <Input name="price" type="number" defaultValue={car.price} required />
        <Input name="mileage" type="number" defaultValue={car.mileage} required />
        <Input name="color" defaultValue={car.color} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select name="transmission" defaultValue={car.transmission} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="MANUAL">Manual</option>
          <option value="AUTOMATIC">Automatic</option>
        </select>
        <Input name="taxExpiry" type="date" defaultValue={new Date(car.taxExpiry).toISOString().split('T')[0]} required />
      </div>

      <Input name="licensePlate" defaultValue={car.licensePlate} required className="uppercase" />
      <Input name="stnkOwnership" defaultValue={car.stnkOwnership} required />
      <textarea name="description" defaultValue={car.description} className="w-full border rounded-md p-2 h-24" />

      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border-2 border-dashed">
        <div>
          <label className="text-xs font-bold block mb-2 text-blue-600">Update Foto (Kosongkan jika tetap)</label>
          <Input name="images" type="file" multiple accept="image/*" />
        </div>
        <div>
          <label className="text-xs font-bold block mb-2 text-purple-600">Update Video (Kosongkan jika tetap)</label>
          <Input name="video" type="file" accept="video/mp4" />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-12 text-lg font-bold bg-blue-600">
        {isPending ? <Loader2 className="animate-spin" /> : "SIMPAN PERUBAHAN"}
      </Button>
    </form>
  )
}