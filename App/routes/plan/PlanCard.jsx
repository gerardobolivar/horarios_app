import { Link } from 'react-router-dom';

export default function PlanCard(props) {
  let title = props.innerText;
  let href = props.url;
  let isActive = props.active
  return (
    <Link to={href} className="noDecoration planCard" >
      <div className="planCard">
        <div className="cardBody">
          <h5 className="cardTitle">{title}</h5>
        </div>
      </div>
    </Link>
  )
}