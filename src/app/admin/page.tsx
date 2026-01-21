import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminPagination from "@/components/admin/AdminPagination";
import DeleteCarButton from "@/components/admin/DeleteCarButton";

export default async function AdminDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; page?: string }> 
}) {
  // 1. Ambil params secara async
  const { q, page } = await searchParams;
  
  // 2. Konfigurasi Pagination
  const currentPage = Number(page) || 1;
  const limit = 8; // Menampilkan 8 mobil per halaman
  const skip = (currentPage - 1) * limit;

  // 3. Filter Pencarian (berdasarkan merek atau model)
  const where = q ? {
    OR: [
      { brand: { contains: q, mode: 'insensitive' as any } },
      { model: { contains: q, mode: 'insensitive' as any } },
    ],
  } : {};

  // 4. Ambil data & total count secara paralel
  const [cars, totalCars] = await Promise.all([
    prisma.car.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    }),
    prisma.car.count({ where })
  ]);

  const totalPages = Math.ceil(totalCars / limit);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">DASHBOARD ADMIN</h1>
          <p className="text-muted-foreground">Kelola {totalCars} unit mobil yang terdaftar</p>
        </div>
        <Link href="/admin/add">
          <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
            <PlusCircle size={20} /> TAMBAH UNIT
          </Button>
        </Link>
      </div>

      {/* FITUR PENCARIAN */}
      <div className="mb-6">
        <AdminSearch defaultValue={q} />
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Mobil</TableHead>
              <TableHead className="font-bold">Harga</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="font-bold">{car.brand} {car.model}</div>
                  <div className="text-xs text-muted-foreground">{car.year} • {car.licensePlate}</div>
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  Rp {car.price.toLocaleString('id-ID')}
                </TableCell>
                <TableCell>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    car.status === 'TERSEDIA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {car.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/edit/${car.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <DeleteCarButton id={car.id} carName={`${car.brand} ${car.model}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {cars.length === 0 && (
          <div className="p-10 text-center text-muted-foreground italic">
            Data tidak ditemukan...
          </div>
        )}
      </div>

      {/* FITUR PAGINATION */}
      <div className="mt-8">
        <AdminPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          query={q} 
        />
      </div>
    </div>
  );
}