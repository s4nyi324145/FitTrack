import pool from "@/lib/pg";
import { error, log } from "console";

export const getDailyNutrition = async (userId: number) => {
  try {
    if (isNaN(userId)) return { error: "Invalid user id" };

    const response = await pool.query(`
  SELECT 
    COALESCE(dns.total_calories, 0) AS total_calories,
    COALESCE(dns.total_protein, 0)  AS total_protein,
    COALESCE(dns.total_carbs, 0)    AS total_carbs,
    COALESCE(dns.total_fat, 0)      AS total_fat,
    up.daily_calorie_goal,
    up.daily_protein_goal_g,
    up.daily_carbs_goal_g,
    up.daily_fat_goal_g
  FROM user_profiles up
  LEFT JOIN daily_nutrition_summary dns
    ON dns.user_id = up.user_id AND dns.date = CURRENT_DATE
  WHERE up.user_id = $1
`, [userId])

    return response.rows[0] ;
  } catch (error) {
   
    
    return { error: "Server error" };
  }
};
