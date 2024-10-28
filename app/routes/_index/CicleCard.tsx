import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
type Props = {
  innerText: string | undefined,
  url: string,
  isAdmin: boolean | undefined,
  cicloID: number | undefined,
  active: boolean | undefined,
  isActiveCycle: boolean | undefined
  user: User | undefined,
}

const CicleCard: React.FC<Props> = ({ innerText, url, isAdmin, cicloID, isActiveCycle, user }) => {
  let title = innerText;
  let href = url;

  return (<>
    <div className='cyCard'>
      <div className='gear_container' hidden={!isAdmin}>
        <Link replace={true} to={`/cicle/${cicloID}`} className='linkA'>
          <i className="bi bi-gear-fill gear_icon_cycle"></i>
        </Link>
      </div>
      <Link replace={true} to={href} className={`${!isActiveCycle ? "disableLink noDecoration" : "noDecoration"}`}>
        <div className={`cicleCard ${user?.role !== "ADMIN" ? "cicleCardHeight" : ""}`} >
          <div className="cardBody">
            <h5 className="cardTitle">{title}</h5>
            {!isActiveCycle ? <span className='tt-cicle'><p className='tt-cicle-text'>Ciclo inactivo</p></span>:null}
          </div>
        </div>
      </Link>
    </div>
  </>
  )
}

export default CicleCard;