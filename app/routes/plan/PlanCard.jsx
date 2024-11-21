import { Link } from 'react-router-dom';

export default function PlanCard(props) {
  let title = props.innerText;
  let href = props.url;
  let isStaticAdd = props.static
  return (
    <div className="card">
      <div className="card-header">
        <h5>{title}</h5>
      </div>
      <div className="card-body">
        {
          !isStaticAdd ? <p className="card-text">Sin información adicional sobre el plan.</p> : 
          <p className="card-text">Crear un nuevo plan de estudios.</p>
        }
        <a href={href} className="btn mainButton">{isStaticAdd ? "Agregar":"Gestionar"}</a>
      </div>
    </div>
  )
}