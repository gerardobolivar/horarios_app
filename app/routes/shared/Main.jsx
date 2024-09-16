import NavBar from "./NavBar";

export default function MainLayout(props){
  const user = props.user
  return(
    <div>
      <NavBar user={user}/>
    </div>
  )
}