"use server"

import { auth } from "@/lib/auth"
import type { OnboardingData } from "../onboarding/page"
import pool from "@/lib/pg"
import { redirect } from "next/navigation"
import { CalorieCalculator } from "@/lib/utils/calorie"


export async function completeOnBoarding(data:OnboardingData) {


     if(!data.activityLevel || !data.day || !data.gender || !data.goal || !data.height || !data.month || !data.name || !data.targetWeight || !data.units || !data.weight || !data.year){
      return ({error: "Please fill out the forms"})
    }

    const session = await auth()
    
    const userId = session?.user?.id

    const birthDate = `${data.year}-${data.month.padStart(2, "0")}-${data.day.padStart(2, "0")}`;

      const age = new Date().getFullYear() - (Number(data.year) == 0 ? 2000 : Number(data.year));
      //console.log(age);
      
      const macro = CalorieCalculator({
      weight: Number(data.weight),
      height: Number(data.height),
      age,
      goal: data.goal,
      gender: data.gender,
      activity: data.activityLevel,
      });


    try {

        await pool.query(
      `UPDATE user_profiles 
       SET 
         display_name = $1, 
         date_of_birth = $2, 
         gender = $3, 
         units = $4, 
         height_cm = $5, 
         weight_kg = $6, 
         target_weight_kg = $7, 
         goal = $8, 
         activity_level = $9,
         daily_calorie_goal = $10,
         daily_protein_goal_g = $11,
         daily_carbs_goal_g = $12,
         daily_fat_goal_g = $13,  
         onboarding_completed = true
        
       WHERE user_id = $14`,
      [
        data.name,
        birthDate,
        data.gender,
        data.units,
        data.height,
        data.weight,
        data.targetWeight,
        data.goal,
        data.activityLevel,
        macro?.calorie,
        macro?.protein,
        macro?.ch,
        macro?.fat,
        userId, // $10
      ]
    );

        
        
    } catch (error) {
        console.log(error);
        return {error: "Can't save the data"}
        
    }

  
}