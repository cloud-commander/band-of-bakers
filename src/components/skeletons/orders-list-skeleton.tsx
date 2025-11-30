"use client";

export function OrdersListSkeleton() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-40 bg-stone-200 rounded animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
        </div>
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-6 space-y-3 bg-white shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-stone-200 rounded" />
              <div className="h-5 w-16 bg-stone-200 rounded" />
            </div>
            <div className="h-4 w-48 bg-stone-200 rounded" />
            <div className="h-4 w-24 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
