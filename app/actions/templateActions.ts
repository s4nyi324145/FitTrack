"use server"

import { auth } from "@/lib/auth"
import pool from "@/lib/pg"
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
        redirect(`/workouts/templates/${id}`);
        

        
    } catch (error) {
        console.log(error);
        
        if(isRedirectError(error)) throw error
        return({error: "Server error"})
    }
}

export const deleteTemplateById = async(template_id:number) => {
     const session = await auth()
    const userId = session?.user?.id

    if(!userId) return({error: "Unauthorized"})

    try {

        const result = await pool.query(`DELETE FROM workout_templates   WHERE id = $1 AND user_id = $2`, [template_id, userId])

        if(result.rowCount === 0) return ({error: "Can not delete this template"})
        
        //TODO: template_id check and other security options
        revalidatePath("/workouts/templates")
        

        
    } catch (error) {
        console.log(error);
        
        return({error: "Server error"})
    }
}
