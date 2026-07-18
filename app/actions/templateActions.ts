"use server"

import { auth } from "@/lib/auth"
import pool from "@/lib/pg"
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

export const editTemplateById = async(template_id:number, template_name: string, template_notes: string) => {

    const session = await auth()
    const userId = session?.user?.id

    if(!userId) return({error: "Unauthorized"})
    if(template_name.trim() === "") return({error: "Template name can not be empty"})
    if(isNaN(template_id) || template_id < 0 || !template_id) return({error: "Invalid template id"})

    try {
        const result = await pool.query("UPDATE workout_templates SET name = $1, notes = $2 WHERE id = $3", [template_name,template_notes,template_id])

        if(result.rowCount === 0) return({error: "Can not update this template"})
        return({succes: true})
    } catch (error) {
        return ({error: "Server error"})   
    }
}
