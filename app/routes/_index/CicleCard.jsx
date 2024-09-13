import { Link } from 'react-router-dom';

export default function CicleCard(props) {
  let title = props.innerText;
  let href = props.url;
  let isActive = props.active
  const cicloID = props.cicloID
  const isActiveCycle = props.isActiveCycle
  return (<>
    <div className='cyCard'>
      <div className='gear_container'>
        <Link to={`/cicle/${cicloID}`} className='linkA'>
          <i className="bi bi-gear-fill gear_icon_cycle"></i>
        </Link>
      </div>
      <Link to={href} className={`${!isActiveCycle ? "disableLink noDecoration" : "noDecoration"}`}>
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