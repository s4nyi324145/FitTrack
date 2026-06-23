'use client'

import React, { useState, useTransition } from 'react'
import { Pencil, X } from 'lucide-react'
import { editWorkoutById } from '@/app/actions/workoutsActions'

type Props = {
  id: number
  currentName: string
  currentNotes: string | null
}

const EditWorkoutButton = ({ id, currentName, currentNotes }: Props) => {
  const [showModal, setShowModal]   = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError]           = useState<string | null>(null)
  const [name, setName]             = useState(currentName)
  const [notes, setNotes]           = useState(currentNotes ?? "")

  const handleEdit = () => {
    setError(null)
    startTransition(async () => {
      const result = await editWorkoutById(id, name, notes)
      if (result?.error) {
        setError(result.error)
      } else {
        setShowModal(false)
      }
    })
  }

  const handleClose = () => {
    setShowModal(false)
    setError(null)
    setName(currentName)
    setNotes(currentNotes ?? "")
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-surface w-full max-w-[440px] flex rounded-xl border border-border flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <p className="font-bold text-lg">Edit Workout</p>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-raised transition-colors text-text-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 p-5">
              {error && (
                <p className="text-red-500 font-semibold text-sm bg-red-500/10 p-3 rounded-md">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-muted tracking-wide">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Push Day A"
                  className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-muted tracking-wide">
                  Notes <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add workout notes..."
                  rows={3}
                  className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-border">
              <button
                onClick={handleClose}
                disabled={isPending}
                className="flex flex-1 justify-center cursor-pointer border border-border rounded-md py-2 text-sm font-semibold hover:bg-surface-raised transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isPending || !name.trim()}
                className="flex flex-1 justify-center cursor-pointer bg-primary hover:bg-primary-hover transition-colors text-white border border-border rounded-md py-2 text-sm font-semibold disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setShowModal(true); setError(null) }}
        className="flex cursor-pointer border-primary font-bold px-3 py-2 text-primary rounded-md border-2 items-center gap-2 hover:bg-primary/10 transition-colors text-sm"
      >
        <Pencil strokeWidth={2} size={16} />
      </button>
    </>
  )
}

export default EditWorkoutButton