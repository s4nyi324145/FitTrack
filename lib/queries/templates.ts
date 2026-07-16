import { TemplateWorkout } from "@/types"
import { auth } from "../auth"
import pool from "../pg"
import { error } from "console"


export const getWorkoutTemplates = async () => {
  
    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return []

    try {

        const result = await pool.query(`SELECT 
                    wt.id AS template_id,
                    wt.name AS template_name,
                    wt.notes AS template_notes,
                    wte.id AS template_exercise_id,
                    wte.sort_order,
                    wte.default_sets,
                    wte.default_reps,
                    wte.default_weight_kg,
                    e.id AS exercise_id,
                    e.name AS exercise_name,
                    e.muscle_group
                    FROM workout_templates wt
                    LEFT JOIN workout_template_exercises wte ON wt.id = wte.template_id
                    LEFT JOIN exercises e ON wte.exercise_id = e.id
                    WHERE wt.user_id = $1
                    ORDER BY wt.id, wte.sort_order`, [userId])

                
        
       
        const rows = result.rows

    

         const templateWorkouts: TemplateWorkout[] = []
        console.log(rows)

        for (const row of rows) {
            if(!row.template_id) return []
            let templete = templateWorkouts.find(t => t.template_id === row.template_id)

            if(!templete) {
                templete = {
                    template_id: row.template_id,
                    template_name: row.template_name,
                    template_notes: row.template_notes,
                    exercises: []
                }
                templateWorkouts.push(templete)
            }

            if(row.template_exercise_id === null) continue
            let ex = templete.exercises.find(e => e.template_exercise_id === row.template_exercise_id)
            if(!ex) {
                 ex = {
                    template_exercise_id: row.template_exercise_id,
                    sort_order: row.sort_order,
                    default_sets: row.default_sets,
                    default_reps: row.default_reps,
                    default_weight_kg: row.default_weight_kg,
                    exercise_id: row.exercise_id,
                    exercise_name: row.exercise_name,
                    muscle_group: row.muscle_group
                }   
                templete.exercises.push(ex)
            }

       
        

            //console.log(ex);
            
            
        }
        console.log(templateWorkouts)
        return templateWorkouts

        
        
    } catch (error) {
        return []
    }
}

export const getTemplateDataById = async (id:number) => {

    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return []
    if(!id || isNaN(id) || id < 0) return []

    try {

        const result = await pool.query(`SELECT 
                    wt.id AS template_id,
                    wt.name AS template_name,
                    wt.notes AS template_notes,
                    wte.id AS template_exercise_id,
                    wte.sort_order,
                    wte.default_sets,
                    wte.default_reps,
                    wte.default_weight_kg,
                    e.id AS exercise_id,
                    e.name AS exercise_name,
                    e.muscle_group
                    FROM workout_templates wt
                    LEFT JOIN workout_template_exercises wte ON wt.id = wte.template_id
                    LEFT JOIN exercises e ON wte.exercise_id = e.id
                    WHERE wt.user_id = $1 AND wt.id = $2
                    ORDER BY wt.id, wte.sort_order`, [userId,id])
        
        const rows = result.rows

        const templateData: TemplateWorkout = {
                template_id: rows[0].template_id,
                template_name: rows[0].template_name,
                template_notes: rows[0].template_notes,
                exercises: [] 
                
        }

        rows.forEach(row => {
            
            if(!row.exercise_id) return []
        
            

            let ex = templateData.exercises.find(e => e.template_exercise_id === row.template_exercise_id )
            if(!ex) {
                ex = {
                    template_exercise_id: row.template_exercise_id,
                    exercise_id: row.exercise_id,
                    sort_order: row.sort_order,
                    default_sets: row.default_sets,
                    default_reps: row.default_reps,
                    default_weight_kg: row.default_weight_kg,
                    exercise_name: row.exercise_name,
                    muscle_group: row.muscle_group
                }
                templateData.exercises.push(ex)
            }
        });

        return templateData
        
        
    } catch (error) {
        return []
    }

}

