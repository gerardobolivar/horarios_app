import { User } from "@prisma/client";
import { useSubmit } from "@remix-run/react";
import { Link } from "react-router-dom";
import { useOptionalUser } from "~/utils";


type Props = {
  user: User,
}

 const NavBar: React.FC<Props> = ({user}) => {
  const isAdmin = user.role === "ADMIN";
  let username = `${user?.nombre_usuario.toLocaleUpperCase()} ${user.role !== "USER" ? `(${user.role})` :"" }`


  const submit = useSubmit();

  function handleLogOut(event: Event) {
    event.preventDefault();
    submit({ ok: true }, { method: "post", action: "/logout" });
  }

  return (
    <div id="NavBar" className="hide-on-print">
      <nav className="navbar d-flex flex-row-reverse mainNavBar">
        <a className="navbar-brand d-flex" href="#">
          <p>{username}</p>
          <i className="bi bi-person-fill" id="profileIcon"></i>
        </a>
      </nav>
      <nav className="navbar d-flex flex-row metaNavBar">
        <Link to="/" className="noDecoration navbar-brand d-flex"><p>Sistema de horarios</p></Link>
      </nav>
      <hr className="hr divider"></hr>
      <nav className="navbar navbar-expand-lg mainNavBarmenu ">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li hidden={user.role === "GUEST"}>
            <Link to="/plan"
              preventScrollReset={true}
              className="navbar-brand d-flex nav-item" >Planes de estudio</Link>
          </li>
          <li hidden={!isAdmin}>
            <Link 
              className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="/aula">Aulas</Link>
          </li>
          <li hidden={!isAdmin}>
            <Link 
              className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="/movil">Laboratorios móviles</Link>
          </li>
          <li hidden={user.role === "GUEST"}>
            <Link className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="/report">{isAdmin ? "Reportes":"Mi reporte"}</Link>
          </li>
          <li hidden={user.role === "GUEST"}>
            <Link
              className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="profesor">Profesores</Link>
          </li>
          <li hidden={!isAdmin}>
            <Link
              className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="user">Usuarios</Link>
          </li>
          <li>
            <Link className="navbar-brand d-flex nav-item"
              to="" preventScrollReset={true} onClick={(e:any)=>{handleLogOut(e)}}>Salir</Link>
          </li>
        </ul>
      </nav>
      <div>
      </div>
    </div>
  )
}

export default NavBar;