import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { logout } from "~/.server/session";

export async function action({request} : ActionFunctionArgs){
  return logout(request);
}

export async function loader(){
  return redirect("/login")
}