import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductSkeletonProps {
  index?: number
}

export function ProductSkeleton({ index = 0 }: ProductSkeletonProps) {
  return (
    <Card
      className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0">
        <div className="relative">
          <Skeleton className="w-full h-64 rounded-t-lg" />
          <Skeleton className="absolute top-3 left-3 w-16 h-6 rounded-full" />
          <Skeleton className="absolute top-3 right-3 w-8 h-8 rounded-full" />
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-3 w-3 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
