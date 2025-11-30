"use client";

export function AdminOrdersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 bg-stone-200 rounded animate-pulse" />
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 gap-0 bg-muted/50 p-3 text-sm text-muted-foreground">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-stone-200 rounded animate-pulse" />
          ))}
        </div>
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-0 border-t p-4">
            {[...Array(5)].map((__, i) => (
              <div key={i} className="h-4 bg-stone-200 rounded animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
