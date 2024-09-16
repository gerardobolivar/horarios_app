import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export default function Report(){
  return(
    <div>
      <h1>Personal Report</h1>
      <p>This is where you will be able to generate a personal report</p>
    </div>
  )
}

export async function loader({request}:LoaderFunctionArgs){
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  if(user?.role === "GUEST"){
    return redirect("/");
  }
  return null;
}