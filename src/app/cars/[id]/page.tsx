import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Calendar, 
  Gauge, 
  Settings, 
  ShieldCheck, 
  Palette, 
  UserCircle,
  Download
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// 1. GENERATE METADATA (Untuk Preview WhatsApp yang Profesional)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  
  if (!car) return { title: "Mobil Tidak Ditemukan" };

  // Konversi Json ke String Array untuk metadata
  const images = car.images as string[];

  return {
    title: `${car.brand} ${car.model} ${car.year} - JualMobilKu`,
    description: `Cek detail mobil ${car.brand} ${car.model}. Harga Rp ${car.price.toLocaleString('id-ID')}`,
    openGraph: {
      images: images.length > 0 ? [images[0]] : [],
    },
  };
}

// 2. MAIN PAGE COMPONENT
export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params untuk kompatibilitas Next.js 15/16
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id: id },
  });

  if (!car) notFound();

  // KRUSIAL: Konversi data Json dari MySQL menjadi Array String agar bisa di-map
  const carImages = car.images as string[];

  // Konfigurasi WhatsApp
  const waNumber = "628123456789"; // GANTI DENGAN NOMOR ANDA
  const waMessage = `Halo, saya tertarik dengan mobil ${car.brand} ${car.model} (${car.year}) yang ada di website. Apakah unitnya masih tersedia?`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* SISI KIRI: GALERI MEDIA & DOWNLOAD */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            {carImages.map((img, index) => (
              <div key={index} className="group relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border shadow-sm">
                <Image 
                  src={img} 
                  alt={`${car.brand} ${car.model} - ${index}`} 
                  fill 
                  className="object-cover group-hover:scale-105 transition duration-700" 
                  priority={index === 0}
                />
                
                {/* Overlay Tombol Download Gambar */}
                <a 
                  href={img} 
                  download={`Foto-${car.brand}-${car.model}-${index}.jpg`}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white flex items-center gap-2 text-xs font-bold text-slate-800"
                >
                  <Download className="h-4 w-4" />
                  SIMPAN FOTO
                </a>
              </div>
            ))}
          </div>

          {/* Player Video & Download Video */}
          {car.video && (
            <div className="mt-12 bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2 italic">
                  Video Review
                </h3>
                <a 
                  href={car.video} 
                  download={`Video-${car.brand}-${car.model}.mp4`}
                  className="flex items-center gap-2 text-xs font-black text-blue-600 hover:underline uppercase tracking-widest"
                >
                  <Download className="h-4 w-4" />
                  Download Video
                </a>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <video controls className="w-full h-full">
                  <source src={car.video} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video.
                </video>
              </div>
            </div>
          )}
        </div>

        {/* SISI KANAN: INFORMASI LENGKAP */}
        <div className="space-y-8">
          <div className="sticky top-28">
            <div className="mb-6">
              <Badge variant={car.status === "TERSEDIA" ? "default" : "destructive"} className="mb-3 px-4 py-1 rounded-full text-[10px] uppercase font-black tracking-[0.2em]">
                {car.status === "TERSEDIA" ? "Unit Tersedia" : "Sudah Terjual"}
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                {car.brand} <span className="text-blue-600">{car.model}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2 italic">
                Pelat Nomor: <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-900 not-italic font-bold uppercase">{car.licensePlate}</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-200 mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Harga Penawaran</p>
                <h2 className="text-4xl font-black">
                  Rp {car.price.toLocaleString('id-ID')}
                </h2>
            </div>

            <Separator className="my-8" />

            {/* Grid Spesifikasi Teknis */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Calendar, label: "Tahun", value: car.year },
                { icon: Gauge, label: "Jarak Tempuh", value: `${car.mileage.toLocaleString()} KM` },
                { icon: Settings, label: "Transmisi", value: car.transmission },
                { icon: ShieldCheck, label: "Pajak Berlaku", value: new Date(car.taxExpiry).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) },
                { icon: Palette, label: "Warna Eksterior", value: car.color },
                { icon: UserCircle, label: "Status STNK", value: car.stnkOwnership },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <item.icon className="text-blue-500 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-tighter leading-none mb-1">{item.label}</p>
                    <p className="font-bold text-slate-800 leading-none">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Deskripsi */}
            {car.description && (
              <Card className="p-6 bg-slate-50 border-none shadow-none rounded-2xl mb-8">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">Catatan Penjual:</p>
                <p className="text-sm leading-relaxed text-slate-700 italic">
                  "{car.description}"
                </p>
              </Card>
            )}

            {/* Tombol Kontak Utama */}
            <div className="flex flex-col gap-4">
              <Link href={waLink} target="_blank">
                <Button className="w-full h-20 text-xl font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100 gap-4 rounded-[1.5rem] transition-all hover:scale-[1.02]">
                  <MessageCircle className="h-7 w-7 fill-white" />
                  CHAT VIA WHATSAPP
                </Button>
              </Link>
              
              <p className="text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Klik tombol di atas untuk negosiasi langsung
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}