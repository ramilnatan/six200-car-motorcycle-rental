export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gradient-to-r from-[#F0F0F0] via-[#E8E8E8] to-[#F0F0F0] animate-pulse rounded-xl ${className}`} />
}

export function VehicleCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-52 rounded-none rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /></div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}
