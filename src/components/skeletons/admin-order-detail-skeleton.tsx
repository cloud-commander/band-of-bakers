"use client";

export function AdminOrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-stone-200 rounded animate-pulse" />
        <div className="h-6 w-20 bg-stone-200 rounded animate-pulse" />
      </div>
      <div className="h-24 bg-stone-100 rounded animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-32 bg-stone-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
