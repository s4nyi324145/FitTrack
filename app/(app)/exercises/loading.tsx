


import React from 'react'



const ExercisesLoading = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 p-8">
      <div className="flex flex-col gap-3 mb-7">
        <div className="h-9 w-64 bg-surface-raised rounded-md animate-pulse" />
        <div className="h-4 w-96 bg-surface-raised rounded-md animate-pulse" />
      </div>

      <div className="h-32 w-full bg-surface-raised rounded-md animate-pulse" />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mt-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface-raised rounded-xl overflow-hidden animate-pulse">
            <div className="h-28 bg-border/40" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 w-3/4 bg-border/40 rounded" />
              <div className="h-px bg-border/40" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-border/40 rounded-md" />
                <div className="h-6 w-20 bg-border/40 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExercisesLoading