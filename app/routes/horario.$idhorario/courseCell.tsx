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

const CourseCell: React.FC<{curso:Curso,classN:string,hiddenCell:boolean,matriculaId:number,horarioId:number}> = ({curso,classN,hiddenCell,matriculaId,horarioId}) =>{
  return <Link style={style} to={`/horario/${horarioId}/${matriculaId}`}><div className={`${classN} course-cell`}  onDoubleClick={handleDoubleClick}>
    <span>{hiddenCell?null:curso.nombre}</span>
  </div>
  </Link>
}

export default CourseCell;