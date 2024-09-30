 const TimeColumn: React.FC<{slots:string[]}> = ({slots})=>{
  
  return <div className="time-column">
    {slots.map(slot=>
    slot.toUpperCase() === "HORAS" ? 
    <div key={slot} className="time-cell aulaTitle" style={{fontWeight:"bold"}}><h3>{slot}</h3></div>:
    <div key={slot} className="time-cell"><p className="timeSpanRowTitle">{slot}</p></div>
    )}
  </div>
}

export default TimeColumn;