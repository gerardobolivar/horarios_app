import { Link } from "react-router-dom";

export default function LoginPage (){

  return(
  <div id="main-login" className="infoText">
    <h1>This would be a login page for Sistema de horarios</h1>
    <Link to={"/"}><a>Back home</a></Link>
  </div>
  );
}