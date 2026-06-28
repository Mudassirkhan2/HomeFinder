const shimmer = 'bg-surface-border dark:bg-dark-border animate-pulse rounded'

export const ListingCardSkeleton = () => (
  <li className="relative bg-surface dark:bg-dark-surface flex flex-col shadow-md rounded-xl overflow-hidden m-[10px]">
    <div className="h-[170px] w-full bg-surface-border dark:bg-dark-border animate-pulse" />
    <div className="w-full p-[10px] space-y-2.5">
      <div className={`h-3 w-3/4 ${shimmer}`} />
      <div className={`h-5 w-full ${shimmer}`} />
      <div className={`h-5 w-2/5 ${shimmer}`} />
      <div className="flex gap-3 mt-1">
        <div className={`h-3 w-10 ${shimmer}`} />
        <div className={`h-3 w-12 ${shimmer}`} />
        <div className={`h-3 w-14 ${shimmer}`} />
      </div>
    </div>
  </li>
)

export const CarouselCardSkeleton = () => (
  <div className="bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-2xl overflow-hidden shadow-md">
    <div className="h-44 w-full bg-surface-border dark:bg-dark-border animate-pulse" />
    <div className="p-3.5 space-y-2.5">
      <div className={`h-3 w-3/4 ${shimmer}`} />
      <div className={`h-4 w-full ${shimmer}`} />
      <div className={`h-5 w-2/5 ${shimmer}`} />
      <div className={`flex gap-3 pt-2.5 border-t border-surface-border dark:border-dark-border`}>
        <div className={`h-3 w-10 ${shimmer}`} />
        <div className={`h-3 w-12 ${shimmer}`} />
        <div className={`h-3 w-14 ${shimmer}`} />
      </div>
    </div>
  </div>
)
