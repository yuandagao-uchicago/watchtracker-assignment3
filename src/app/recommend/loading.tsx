import { SkeletonHeading, SkeletonLine, SkeletonCardGrid } from "@/components/ui/Skeleton";

export default function RecommendLoading() {
  return (
    <div className="space-y-10">
      <div>
        <SkeletonHeading width="w-72" />
        <div className="w-12 h-0.5 bg-primary mt-4" />
        <div className="mt-4"><SkeletonLine width="w-96" /></div>
      </div>
      <SkeletonCardGrid count={10} />
    </div>
  );
}
