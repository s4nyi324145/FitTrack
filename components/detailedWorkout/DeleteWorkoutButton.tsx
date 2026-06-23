'use client'

import React, { useState, useTransition } from 'react'
import { Trash2, TriangleAlert } from 'lucide-react'
import { deleteWorkoutById } from '@/app/actions/workoutsActions'

const DeleteWorkoutButton = ({ id, name }: { id: string; name: string }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition() 
  const [error, setError] = useState<null | string>(null)

  const handleWorkoutDelete = () => {
    setError(null)
    startTransition(async () => {
      const result = await deleteWorkoutById(parseInt(id,10))
      
     
      if (result?.error) {
        setError(result.error)
      }
    })
    
  }

  return (
    <>
      {showConfirm && (
        <div className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-surface w-full max-w-[400px] flex rounded-md border-2 border-border gap-4 items-center flex-col p-4 justify-center">
            {error && <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">{error}</p>}
            <TriangleAlert className="text-red-500" />
            <p className="font-bold">Delete workout ?</p>
            <p className="text-center text-sm text-text-muted">
              This will permanently delete "{name}" and all associated sets. This cannot be undone.
            </p>
            <div className="flex gap-3 w-full flex-1 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="border-border cursor-pointer border rounded-md flex py-1.5 justify-center flex-[0.5] hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWorkoutDelete} 
                disabled={isPending} 
                className="border-border cursor-pointer hover:bg-red-500 transition-colors bg-red-700 text-white border rounded-md flex py-1.5 justify-center flex-[0.5] disabled:opacity-50 font-semibold"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {setShowConfirm(true), setError(null)}}
        className="flex cursor-pointer border-red-400 font-bold px-3 py-2 text-red-400 rounded-md border-2 items-center gap-2 hover:bg-red-400/10 transition-colors text-sm"
      >
        <Trash2 strokeWidth={2} size={16} />
      </button>
    </>
  )
}

export default DeleteWorkoutButton