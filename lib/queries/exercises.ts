import { auth } from "../auth"
import pool from "../pg"

export const getAllExercise = async () => {

     const session = await auth()
     const userId = session?.user?.id

     if(!userId) return []

    try {

        const result = await pool.query("SELECT * FROM exercises WHERE user_id IS NULL OR user_id = $1 ORDER BY created_at DESC ", [userId])   
        return result.rows
        
    } catch (error) {
        return []
    }
}