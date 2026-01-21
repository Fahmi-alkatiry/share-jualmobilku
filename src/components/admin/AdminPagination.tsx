"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  query?: string;
}

export default function AdminPagination({ currentPage, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", pageNumber.toString());
    return `/admin?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Link href={createPageURL(currentPage - 1)}>
        <Button 
          variant="outline" 
          disabled={currentPage <= 1}
          className="gap-1"
        >
          <ChevronLeft size={16} /> Prev
        </Button>
      </Link>
      
      <div className="text-sm font-medium">
        Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
      </div>

      <Link href={createPageURL(currentPage + 1)}>
        <Button 
          variant="outline" 
          disabled={currentPage >= totalPages}
          className="gap-1"
        >
          Next <ChevronRight size={16} />
        </Button>
      </Link>
    </div>
  );
}