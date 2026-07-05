"use server"

import { auth } from "@/lib/auth"
import pool from "@/lib/pg"
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
