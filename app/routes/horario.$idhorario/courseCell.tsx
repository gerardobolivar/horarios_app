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

const style = {textDecoration:"none",
}

type Props = {
  curso:Curso,
  classN:string,
  hiddenCell:boolean,
  matriculaId:number,
  horarioId:number,
  aulaID:number
}

const CourseCell: React.FC<Props> = ({curso,classN,hiddenCell,matriculaId,horarioId, aulaID}) =>{
  return <Link
          style={style}
          to={`/horario/${horarioId}/${matriculaId}`} 
          state={{aulaID: aulaID}}><div className={`${classN} course-cell`}  onDoubleClick={handleDoubleClick}>
    <span>{hiddenCell?null:curso.nombre}</span>
  </div>
  </Link>
}

export default CourseCell;