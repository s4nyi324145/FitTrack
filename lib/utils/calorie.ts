

type Prop = {
    weight: number,
    height: number,
    age: number,
    goal: string,
    gender: string,
    activity: string
}

export const CalorieCalculator = ({weight, height,age, goal,gender,activity}:Prop) => {

   
    //console.log(height);
    
        
    
    if(isNaN(weight) || isNaN(height) || isNaN(age) || !goal || !gender || !activity) return 


   let calorie = 0
   let protein = 0
   let fat = 0
   let ch = 0

    if(gender == "Male"){
            calorie = 10 * weight + 6.25 * height - 5 * age + 5
    }
    else {
          
            calorie = 10 * weight + 6.25 * height - 5 * age - 161
    }

    switch (activity) {
        case "Sedentary":
            calorie = calorie * 1.2
            break;
        case "Lightly active":
            calorie = calorie * 1.375
            break
        case "Moderately active":
            calorie = calorie * 1.55
            break
        case "Very active":
            calorie = calorie * 1.725
            break
        default:
            calorie
            break;
    }
    


    switch (goal) {
        case "Lose weight":
            calorie -= 500
            protein = 2.2 * weight                        // g
            fat = (calorie * 0.25) / 9                    // g — kalória 25%-a zsírból, /9 mert 1g zsír = 9kcal
            ch = (calorie - (protein * 4) - (fat * 9)) / 4 // g — ami marad, /4 mert 1g ch = 4kcal
            break

        case "Build muscle":
            calorie += 300
            protein = 2.0 * weight
            fat = (calorie * 0.25) / 9
            ch = (calorie - (protein * 4) - (fat * 9)) / 4
            break

        default: // Stay in shape
            protein = 1.8 * weight
            fat = (calorie * 0.30) / 9
            ch = (calorie - (protein * 4) - (fat * 9)) / 4
            break
}

return {
    calorie: Math.round(calorie),
    protein: Math.round(protein),
    fat:     Math.round(fat),
    ch: Math.max(0, Math.round(ch)),
}
}
