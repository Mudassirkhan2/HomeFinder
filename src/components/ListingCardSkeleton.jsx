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

export const SliderSkeleton = () => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
    <div className="flex items-end justify-between mb-4">
      <div className="space-y-2">
        <div className={`h-3 w-16 ${shimmer}`} />
        <div className={`h-8 w-56 ${shimmer}`} />
      </div>
    </div>
    <div className="relative rounded-2xl overflow-hidden h-[360px] sm:h-[420px] lg:h-[480px] bg-surface-border dark:bg-dark-border animate-pulse" />
  </section>
)

export const ListingDetailSkeleton = () => (
  <main className="min-h-screen bg-surface-secondary dark:bg-dark-bg pb-20">
    <div className="max-w-6xl mx-auto px-4 pt-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className={`h-6 w-20 ${shimmer} rounded-full`} />
            <div className={`h-6 w-24 ${shimmer} rounded-full`} />
          </div>
          <div className={`h-8 w-3/4 ${shimmer}`} />
          <div className={`h-4 w-1/2 ${shimmer}`} />
        </div>
      </div>

      {/* Image gallery */}
      <div className="bg-surface dark:bg-dark-surface rounded-2xl overflow-hidden shadow-lift mb-6">
        <div className="h-[400px] w-full bg-surface-border dark:bg-dark-border animate-pulse" />
        <div className="flex gap-2 p-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`flex-shrink-0 w-20 h-14 ${shimmer}`} />
          ))}
        </div>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-4">
          {/* Specs */}
          <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${shimmer}`} />
                  <div className="space-y-1.5 flex-1">
                    <div className={`h-3 w-16 ${shimmer}`} />
                    <div className={`h-4 w-20 ${shimmer}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6 space-y-2.5">
            <div className={`h-5 w-44 ${shimmer}`} />
            <div className={`h-4 w-full ${shimmer}`} />
            <div className={`h-4 w-5/6 ${shimmer}`} />
            <div className={`h-4 w-4/6 ${shimmer}`} />
          </div>

          {/* Map placeholder */}
          <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border dark:border-dark-border">
              <div className={`h-5 w-20 ${shimmer}`} />
            </div>
            <div className="h-[280px] bg-surface-border dark:bg-dark-border animate-pulse" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6 space-y-4 shadow-lift">
          <div className={`h-3 w-24 ${shimmer}`} />
          <div className={`h-9 w-40 ${shimmer}`} />
          <div className={`h-3 w-20 ${shimmer}`} />
          <div className="flex items-center gap-3 py-4 border-t border-surface-border dark:border-dark-border">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 ${shimmer}`} />
            <div className="space-y-1.5 flex-1">
              <div className={`h-4 w-28 ${shimmer}`} />
              <div className={`h-3 w-20 ${shimmer}`} />
            </div>
          </div>
          <div className={`h-11 w-full rounded-xl ${shimmer}`} />
          <div className={`h-10 w-full rounded-xl ${shimmer}`} />
        </div>
      </div>
    </div>
  </main>
)

export const EditListingFormSkeleton = () => (
  <div className="min-h-screen bg-surface-secondary dark:bg-dark-bg pb-16">
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <div className="mb-6 space-y-2">
        <div className={`h-8 w-44 ${shimmer}`} />
        <div className={`h-4 w-72 ${shimmer}`} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-6 items-start">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface dark:bg-dark-surface rounded-2xl border border-surface-border dark:border-dark-border p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-7 h-7 rounded-full ${shimmer}`} />
                <div className={`h-5 w-32 ${shimmer}`} />
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`h-10 rounded-xl ${shimmer}`} />
                  <div className={`h-10 rounded-xl ${shimmer}`} />
                </div>
                {i < 3 && <div className={`h-10 rounded-xl ${shimmer}`} />}
                {i === 2 && <div className={`h-24 rounded-xl ${shimmer}`} />}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <div className={`flex-1 h-12 rounded-xl ${shimmer}`} />
            <div className={`w-24 h-12 rounded-xl ${shimmer}`} />
          </div>
        </div>
        <div className="space-y-4">
          <div className={`h-56 rounded-2xl ${shimmer}`} />
          <div className={`h-32 rounded-2xl ${shimmer}`} />
        </div>
      </div>
    </div>
  </div>
)
