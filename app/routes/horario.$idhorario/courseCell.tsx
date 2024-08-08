import { Curso } from "~/types/horarioTypes"

const CourseCell: React.FC<{curso:Curso,classN:string,hiddenCell:boolean}> = ({curso,classN,hiddenCell}) =>{
  return <div className={`${classN} course-cell`}>
    <span>{hiddenCell?null:curso.nombre}</span>
  </div>;
}

export default CourseCell;