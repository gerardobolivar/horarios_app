import { Link } from 'react-router-dom';

export default function CicleCard(props) {
  let title = props.innerText;
  let href = props.url;
  let isActive = props.active
  const cicloID = props.cicloID
  const isActiveCycle = props.isActiveCycle
  return (<>
  <div>
    <Link to={`/cicle/${cicloID}`}>
      <i className="bi bi-gear-fill gear-icon"></i>
    </Link>
    <Link to={href} className={!isActiveCycle ? "disableLink noDecoration" : "noDecoration"}>
      <div className="cicleCard">
        <div className="cardBody">
          <h5 className="cardTitle">{title}</h5>
        </div>
      </div>
    </Link>
  </div>
  </>
  )
}