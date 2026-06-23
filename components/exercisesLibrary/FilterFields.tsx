import React from 'react'
import type { FilterExercise } from '@/types'
const FilterFields = ({filter, setFilter}: {filter: FilterExercise, setFilter: React.Dispatch<React.SetStateAction<FilterExercise>>}) => {

  const muscleGrops = ["All", "Chest", "Back","Shoulders","Biceps","Triceps" ,"Legs", "Glutes", "Core", "Cardio"]

  const equipments = ["All", "Barbell", "Dumbell", "Machine", "BodyWeight", "Cable", "Resistance Band", "Kettlebell"]



  return (
    <div className='flex flex-col w-full gap-3  border-2 border-border  p-4 bg-surface rounded-md'>
        <p className='uppercase text-xs font-semibold'>Muscle group</p>
        <div className='flex  flex-1 gap-2 flex-wrap'>
            {muscleGrops.map((muscle, index) =>  
                <div key={index} onClick={() => setFilter(prev => ({...prev, muscle: muscle})) } className={`px-3 transition-colors  py-1 cursor-pointer ${filter.muscle == muscle ? "bg-primary-hover text-white" : "bg-border/50 hover:bg-border" }   text-md rounded-full`}>
                  {muscle}
                </div>

            )}
        </div>
        <hr className='my-2 border-border'/>
        <p className='uppercase text-xs font-semibold'>Equipment</p>
        <div className='flex  flex-1 gap-2 flex-wrap'>
            {equipments.map((eq, index) =>  
                <div key={index} onClick={() => setFilter(prev => ({...prev, equipment: eq})) }className={`px-3 transition-colors hover:border-text-muted ${filter.equipment == eq && "bg-primary/90 text-white"} py-1 cursor-pointer border border-border text-md rounded-full`}>
                  {eq}
                </div>

            )}
        </div>
    </div>
  )
}

export default FilterFields
