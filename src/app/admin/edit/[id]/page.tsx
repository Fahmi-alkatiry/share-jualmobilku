
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCarForm from "@/components/admin/EditCarForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const car = await prisma.car.findUnique({
    where: { id }
  });

  if (!car) notFound();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Data: {car.brand} {car.model}</h1>
      {/* Kita kirim data car yang sudah ada ke komponen Form */}
      <EditCarForm car={car} />
    </div>
  );
}