"use server"

import { auth } from "@/lib/auth"
import pool from "@/lib/pg"
import { error } from "console"



export const checkAndUpdatePrs = async(workout_id:number)  => {

    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return ({error: "Unauthorized"})

    try {
        
        const sets = await pool.query(`SELECT s.weight_kg, s.reps, we.exercise_id FROM sets s JOIN workout_exercises we ON we.id = s.workout_exercise_id WHERE we.workout_id = $1 AND s.is_completed = true`, [workout_id])
        const rows = sets.rows

        console.log(rows);

        const data: any[] = []

        rows.forEach(row => {
            
            if(!row.exercise_id) return []

            let ex = data.find(e => e.exercise_id == row.exercise_id)

            console.log(`finded ex: ${ex}`);
            

            if(!ex){
                ex = {
                    exercise_id: row.exercise_id,
                    weights: [],
                    reps: []
                }

                if(row.exercise_id == ex.exercise_id) {
                    ex.weights.push(parseInt(row.weight_kg))
                    ex.reps.push(parseInt(row.reps))
                }

                data.push(ex)
               
            }
            else {
              
                    ex.weights.push(parseInt(row.weight_kg))
                    ex.reps.push(parseInt(row.reps))
                
            }       
        })

        console.log(data);

        const getPrs = await pool.query("SELECT exercise_id, value, record_type FROM personal_records WHERE user_id = $1", [userId])
        const prRows = getPrs.rows
        
        for(const ex of data) {
            const maxWeight = Math.max(...ex.weights)
            const maxReps = Math.max(...ex.reps)
             const est1RMs = ex.weights.map((w: number, i: number) => w * (1 + ex.reps[i] / 30))
            const bestEst1RM = Math.max(...est1RMs)

            const currentMaxWeightInPr = prRows.find(pr => pr.exercise_id == ex.exercise_id && pr.record_type == "max_weight")
            const currentMaxRepsInPr = prRows.find(pr => pr.exercise_id == ex.exercise_id && pr.record_type == "max_reps")
            const currentEst1RMPR = prRows.find(pr => pr.exercise_id == ex.exercise_id && pr.record_type == "est_1rm")

            if(!currentMaxWeightInPr || maxWeight > currentMaxWeightInPr.value){
                await updatePrs(userId,ex.exercise_id,"max_weight", maxWeight)
            }
            if(!currentMaxRepsInPr || maxReps > currentMaxRepsInPr.value){
                await updatePrs(userId, ex.exercise_id, "max_reps", maxReps)
            }
            if(!currentEst1RMPR || bestEst1RM > currentEst1RMPR.value){
                await updatePrs(userId, ex.exercise_id, "est_1rm", bestEst1RM)
            }
        }
        
        
        


    } catch (error) {
        console.log(error);
        return({error: "Server error"})
        
    }

}



async function updatePrs(user_id: string, exercise_id: number, record_type: string, value: number) {
    try {
        await pool.query(
            `INSERT INTO personal_records (user_id, exercise_id, record_type, value, achieved_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (user_id, exercise_id, record_type)
             DO UPDATE SET value = EXCLUDED.value, achieved_at = NOW()`,
            [user_id, exercise_id, record_type, value]
        )
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: "Server error" }
    }
}