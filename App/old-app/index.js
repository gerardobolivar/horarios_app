import dataCells from "./data";
import Horario from "./Components/Horario";
import ReactDOM from 'react-dom/client';
import React from 'react';
import './Styles/horario.css';
import './Styles/app.css';
import { RouterProvider } from "react-router-dom";
import ErrorPage from "./views/no_route";
import LoginPage from "./views/Login";
import HomeAdmin from "./views/admin/home";
import 'bootstrap/dist/css/bootstrap.css';
import MainLayout from "./Layouts/Main";
import App from "./App";
import Router from "./Routes"

const login = {
  username: "Gerardo Vargas",
  type: "user",
  isAdmin: true
}

