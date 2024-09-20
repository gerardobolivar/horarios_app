import { Link, redirect, useSearchParams } from "@remix-run/react";
import { Curso } from "~/types/horarioTypes"
let myEvent:any;
function handleDoubleClick(event:any){
  //myEvent.submit();
  
}

function handleClick(event:any){
  myEvent = event;
  event.preventDefault();
}



type Props = {
  curso:Curso,
  classN:string,
  hiddenCell:boolean,
  matriculaId:number,
  horarioId:number,
  aulaID:number
  color: string
}

const CourseCell: React.FC<Props> = ({curso,classN,hiddenCell,matriculaId,horarioId, aulaID, color}) =>{
  const style = {textDecoration:"none"}
  const styleCell = {backgroundColor: `#${color}`}

  return <Link
          style={style}
          to={`/horario/${horarioId}/${matriculaId}`} 
          state={{aulaID: aulaID}}><div style={styleCell} className={`${classN} course-cell`}  onDoubleClick={handleDoubleClick}>
    <span>{hiddenCell?null:curso.nombre}</span>
  </div>
  </Link>
}

export default CourseCell;