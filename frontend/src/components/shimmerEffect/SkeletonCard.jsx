import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 justify-center items-center">
      <div className="space-y-2 flex items-center gap-4">
        <Skeleton
          variant="circular"
          className="h-[100px] w-[100px] bg-gray-300 rounded-full"
        ></Skeleton>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px] bg-gray-300" />
          <Skeleton className="h-4 w-[250px] bg-gray-300" />
        </div>
      </div>
      <Skeleton className="h-[40vh] w-full rounded-xl bg-gray-300" />
    </div>
  );
}
