 const TimeColumn: React.FC<{slots:string[]}> = ({slots})=>{
  
  return <div className="time-column">
    {slots.map(slot=>
    slot === "HORAS" ? 
    <div key={slot} style={{fontWeight:"bold"}}>{slot}</div>:
    <div key={slot} className="time-cell">{slot}</div>
    )}
  </div>
}

export default TimeColumn;