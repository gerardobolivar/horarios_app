import { Link } from 'react-router-dom';

export default function PlanCard(props) {
  let title = props.innerText;
  let href = props.url;
  let isActive = props.active
  return (
    <Link to={href} className={!isActive ? "disableLink noDecoration" : "noDecoration"}>
      <div className=" planCard">
        <div className="card-body cardBody">
          <h5 className="cardTitle">{title}</h5>
        </div>
      </div>
    </Link>
  )
}