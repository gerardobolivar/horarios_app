import { Outlet } from "@remix-run/react";
import NavBar from "./NavBar";

export default function MainLayout(props){
  //let login = props.loginData
  
  return(
    <div>
      <NavBar/>
      <Outlet/>
    </div>
  )
}

async function MainLayoutLoader(){
  //Some fecth call in here...
}

export {MainLayoutLoader};