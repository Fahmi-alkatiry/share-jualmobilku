"use client"
import { useFilterStore } from "@/store/useFilterStore"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FilterBar() {
  const { setSearch, setSortBy, setStatusFilter } = useFilterStore()

  return (
    <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border">
      <Input 
        placeholder="Cari merek/model..." 
        className="flex-1 min-w-[200px]"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select onValueChange={setSortBy} defaultValue="terbaru">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="terbaru">Terbaru</SelectItem>
          <SelectItem value="termurah">Harga Termurah</SelectItem>
          <SelectItem value="termahal">Harga Termahal</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={setStatusFilter} defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="TERSEDIA">Belum Laku</SelectItem>
          <SelectItem value="TERJUAL">Terjual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}