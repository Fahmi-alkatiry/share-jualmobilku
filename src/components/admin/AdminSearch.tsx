"use client"
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function AdminSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    
    // Kembali ke halaman 1 setiap kali melakukan pencarian baru
    router.push(`/admin?q=${q}&page=1`);
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        name="q"
        placeholder="Cari merek atau model..." 
        defaultValue={defaultValue}
        className="pl-10 h-11 border-slate-200 focus:ring-blue-500"
      />
    </form>
  );
}