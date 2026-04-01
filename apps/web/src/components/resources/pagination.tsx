"use client";
 
import Button from "@/components/ui/Button";
 
interface ResourcePaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}
 
export default function ResourcePagination({ page, pageCount, onPageChange }: ResourcePaginationProps) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-600">Page {page} sur {pageCount}</p>
 
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Précédent
        </Button>
 
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              n === page
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}
 
        <Button
          variant="outline"
          size="sm"
          disabled={page === pageCount}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}