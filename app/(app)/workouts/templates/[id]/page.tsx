import TemplateData from "@/components/createTemplate/TemplateData"
import { getAllExercise } from "@/lib/queries/exercises"
import { getTemplateDataById } from "@/lib/queries/templates"
import React from "react"

type Prop = {
  params: Promise<{id:string}>
}

const page = async ({params}: Prop ) => {

  const {id} = await params


  const exercises = await getAllExercise()
  const templateData = await getTemplateDataById(parseInt(id))

  if(!templateData || Array.isArray(templateData)) return null

  //TODO : itt vagy a use clientbe kerjem le a template Datat

  return (
    <TemplateData exercises={exercises} templateData={templateData} />
  )
}

export default page
