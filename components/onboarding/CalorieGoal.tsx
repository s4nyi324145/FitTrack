'use client'

import React from 'react'
import type { OnboardingData } from '@/app/onboarding/page'
import { CalorieCalculator } from '@/lib/utils/calorie'
const CalorieGoal =  ({ data }: { data: OnboardingData }) => {


  const age = new Date().getFullYear() - (Number(data.year) == 0 ? 2000 : Number(data.year));
  //console.log(age);
  
  const macro  = CalorieCalculator({
  weight: Number(data.weight),
  height: Number(data.height),
  age,
  goal: data.goal,
  gender: data.gender,
  activity: data.activityLevel,
  });
  
    return (
    <div className='flex flex-col gap-4 bg-background items-center p-6'>
       <p className='uppercase text-text-muted text-xs font-bold'>Your estimated daily calories</p>
       <div className='flex items-end  gap-2'>
          <p className='text-4xl text-foreground font-extrabold'>{macro?.calorie ? macro.calorie : "-"}</p>
          <p className='text-xl font-extrabold text-primary'>kcal</p>
       </div>
    </div>
  )
}

export default CalorieGoal
