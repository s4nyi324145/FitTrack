"use server"

import { auth } from "@/lib/auth"
import pool from "@/lib/pg"
import { TemplateWorkout } from "@/types"
import { error } from "console"
import { revalidatePath } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"


export const createNewTemplate = async() => {

    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return({error: "Unauthorized"})

    try {

        const result = await pool.query(`INSERT INTO workout_templates (user_id,name,created_at) VALUES ($1,'New Template',NOW()) RETURNING id `, [userId])

        if(result.rowCount === 0) return ({error: "Can not create new template"})
        
        const id = result.rows[0].id;
        return ({id: id})
        

        
    } catch (error) {
        return({error: "Server error"})
    }
}

export const deleteTemplateById = async(template_id:number) => {
     const session = await auth()
    const userId = session?.user?.id

    if(!userId) return({error: "Unauthorized"})

        if(!template_id || isNaN(template_id) || template_id < 0) return({error: "Invalid template id"})

    try {

        const result = await pool.query(`DELETE FROM workout_templates   WHERE id = $1 AND user_id = $2`, [template_id, userId])

        if(result.rowCount === 0) return ({error: "Invalid template id or Unauthorized"})
        
        //TODO: template_id check and other security options
        revalidatePath("/workouts/templates")
        

        
    } catch (error) {
        console.log(error);
        
        return({error: "Server error"})
    }
}

export const editTemplateById = async(templateDataS:TemplateWorkout) => {

    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return({error: "Unauthorized"})
    if(templateDataS.template_name.trim() === "") return({error: "Template name can not be empty"})
    if(isNaN(templateDataS.template_id) || templateDataS.template_id < 0 || !templateDataS.template_id) return({error: "Invalid template id"})

    try {
        const result = await pool.query("UPDATE workout_templates SET name = $1, notes = $2 WHERE id = $3", [templateDataS.template_name,templateDataS.template_notes,templateDataS.template_id])

        await Promise.all(
            templateDataS.exercises.map(ex => pool.query("UPDATE workout_template_exercises SET sort_order = $1 WHERE id = $2", [ex.sort_order, ex.template_exercise_id]))
        )

        if(result.rowCount === 0) return({error: "Can not update this template"})
        return({succes: true})
    } catch (error) {
        return ({error: "Server error"})   
    }
}

export const deleteExerciseFromTemplate = async(templete_id:number, templete_exercise_id: number) => {
    const session = await auth()
    const user_id = session?.user?.id

    if(!user_id) return ({error: "Unauthorized"})
    if(!templete_id || isNaN(templete_id) || templete_id < 0) return({error: "Invalid templete_id"})
    if(!templete_exercise_id || isNaN(templete_exercise_id) || templete_exercise_id < 0) return({error: "Invalid templete_exercise_id"})

    try {

        const result = await pool.query("DELETE  FROM workout_template_exercises WHERE id = $1 AND template_id IN (SELECT id FROM workout_templates WHERE id = $2 AND user_id =  $3)", [templete_exercise_id,templete_id,user_id])
        console.log(templete_id);
        
        revalidatePath(`/workouts/templates/${templete_id}`)
        return ({success: true})
        
    } catch (error) {
        console.log(error);
        
        return ({error: "Server error"})
    }
}
