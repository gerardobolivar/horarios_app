import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export default async function loaderReport({request}:LoaderFunctionArgs){
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  
  if(user){
    const isAdmin = user?.role === "ADMIN"
    
    if(user.role === "GUEST"){
      return redirect("/");
    }

    return json({isAdmin:isAdmin})
    
  }else{
    return redirect("/error/")
  }

}