
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link";

export default function CarCard({ car }: { car: any }) {
  return (
    <Link href={`/cars/${car.id}`}>
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition">
      <div className="relative h-48 w-full">
        <Image 
          src={car.images[0] || "/placeholder-car.png"} 
          alt={car.model} 
          fill 
          className="object-cover group-hover:scale-105 transition"
        />
        <Badge className={`absolute top-2 right-2 ${car.status === 'TERJUAL' ? 'bg-red-500' : 'bg-green-600'}`}>
          {car.status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{car.brand} {car.model} ({car.year})</h3>
        <p className="text-blue-600 font-semibold text-xl">
          Rp {car.price.toLocaleString('id-ID')}
        </p>
        <div className="mt-2 text-sm text-gray-500 grid grid-cols-2 gap-y-1">
          <span>🛣️ {car.mileage.toLocaleString()} km</span>
          <span>⚙️ {car.transmission}</span>
          <span>📅 Pajak: {new Date(car.taxExpiry).toLocaleDateString('id-ID')}</span>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}