import { LoadingSkeleton } from "@/components/state/loading-skeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <LoadingSkeleton variant="card" count={6} />
    </div>
  );
}
