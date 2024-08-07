import { Curso } from "~/types/horarioTypes"

const CourseCell: React.FC<{curso:Curso,classN:string}> = ({curso,classN}) =>{
  return <div className={`${classN} course-cell`}>
    <span>{curso.nombre}</span>
  </div>;
}

export default CourseCell;