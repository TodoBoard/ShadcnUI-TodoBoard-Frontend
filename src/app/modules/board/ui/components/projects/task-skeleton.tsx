import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "./task-card";

export function TaskSkeleton() {
  return (
    <TaskCard>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-3 w-[70%]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-[120px]" />
          <Skeleton className="h-7 w-[100px]" />
        </div>
      </div>
    </TaskCard>
  );
}

export function TaskSkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <TaskSkeleton key={i} />
      ))}
    </div>
  );
}
