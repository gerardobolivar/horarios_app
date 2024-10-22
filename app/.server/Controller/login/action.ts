import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getUserById, getUserByName, userHasHash, validateUser } from "prisma/models/userModel";
import { createUserSession } from "~/.server/session";

const actionLogin = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = String(formData.get("username")); 
  const password = String(formData.get("password")); 

  const userID = await validateUser(password,username);
  
  if(!userID){
    const user = await getUserByName(username);
    if(user){
      const hashFound = await userHasHash(user.id_usuario);
      if(user?.resetPassword && !hashFound){
        return redirect(`/login/reset/${user.id_usuario}`)
      }
    }

  }


  return userID ? createUserSession({request, userId: userID!}) : null
}

export default actionLogin;