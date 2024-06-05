import { Link } from "react-router-dom";

export default function NavBarSimple() {
  const stateData = {name: "Nombre Apellido"};
  let username = stateData.name
  return (
    <div id="NavBar">
      <nav className="navbar d-flex flex-row-reverse mainNavBar">
        <a className="navbar-brand d-flex" href="#">
          <p>{username}</p>
          <img src="/favicon.ico" width="30" height="30" className="d-inline-block align-top" alt=""/>
        </a>
      </nav>
      <nav className="navbar d-flex flex-row metaNavBar">
        <a className="navbar-brand d-flex">
          <Link to="/home" className="noDecoration"><p>Sistema de Horarios</p></Link>
        </a>
      </nav>
    </div>
  )
}