"use client"
import { useQuery } from "@tanstack/react-query"
import { useFilterStore } from "@/store/useFilterStore"
import FilterBar from "@/components/shared/FilterBar"
import CarCard from "@/components/shared/CarCard"

export default function HomePage() {
  const { search, sortBy, statusFilter } = useFilterStore()

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars', search, sortBy, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ search, sort: sortBy, status: statusFilter })
      const res = await fetch(`/api/cars?${params.toString()}`)
      return res.json()
    }
  })

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Katalog Mobil</h1>
      <FilterBar />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars?.map((car: any) => <CarCard key={car.id} car={car} />)}
        </div>
      )}
    </div>
  )
}