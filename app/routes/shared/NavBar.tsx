import { useSubmit } from "@remix-run/react";
import { Link } from "react-router-dom";
import { useOptionalUser } from "~/utils";

export default function NavBar() {
  const user = useOptionalUser();
  let username = user?.role === "ADMIN" ? `${user?.nombre_usuario.toLocaleUpperCase()} (ADMIN)`: user?.nombre_usuario.toLocaleUpperCase()


  const submit = useSubmit();

  function handleLogOut(event: Event) {
    event.preventDefault();
    submit({ ok: true }, { method: "post", action: "/logout" });
  }

  return (
    <div id="NavBar">
      <nav className="navbar d-flex flex-row-reverse mainNavBar">
        <a className="navbar-brand d-flex" href="#">
          <p>{username}</p>
          <img src="/favicon.ico" width="30" height="30" className="d-inline-block align-top" alt="" />
        </a>
      </nav>
      <nav className="navbar d-flex flex-row metaNavBar">
        <Link to="/" className="noDecoration navbar-brand d-flex"><p>Sistema de Horarios</p></Link>
      </nav>
      <hr className="hr divider"></hr>
      <nav className="navbar navbar-expand-lg mainNavBarmenu ">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li>
            <Link to="/plan"
              preventScrollReset={true}
              className="navbar-brand d-flex nav-item" >Planes de estudio</Link>
          </li>
          <li>
            <Link 
              className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="/aula">Aulas</Link>
          </li>
          <li>
            <Link 
              className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="/movil">Laboratorios móviles</Link>
          </li>
          <li>
            <Link className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="/report">Mi reporte</Link>
          </li>
          <li>
            <Link
              className="navbar-brand d-flex nav-item"
              preventScrollReset={true}
              to="profesor">Profesores</Link>
          </li>
          <li>
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