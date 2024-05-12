import { createBrowserRouter } from "react-router-dom";
import MainLayout, { MainLayoutLoader } from "./Layouts/Main";
import Horario, { HorarioLoader } from "./Components/Horario";
import LoginPage from "./views/Login";
import dataCells from "./data";//--> Development purposes (Must use React Router loaders)
import ErrorPage from "./views/no_route";
import Aula, { AulaLoader } from "./views/Aula";

const login = { //---> Development purposes (Must use React Router loaders)
  username: "Nombre Apellido",
  type: "user",
  isAdmin: "false"
}

export default createBrowserRouter([
  {
    path: "/",
    element: <MainLayout loginData={login} />, // Se debe trabajar en el tema del renderizado según el tipo de usuario
    children: [
      {
        path: "aula",
        element: <Aula/>,
        loader: AulaLoader,
        errorElement: <ErrorPage/>
      }
    ],
    errorElement: <ErrorPage />
  }, {
    path: "/login",
    element: <div className=""> <LoginPage /> </div>
  },
  {
    path: "/horario", //this route is for developing purposes
    element: <div className=""> <Horario tableData={dataCells} /> </div>,
  }
]);