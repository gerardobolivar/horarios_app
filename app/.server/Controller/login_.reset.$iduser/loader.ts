import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getUserById, userHasHash } from "prisma/models/userModel";

const loaderResetUserID = async ({request, params}:LoaderFunctionArgs) => {
  const userID = Number(params.iduser)
  const user = await getUserById(Number(userID));
  const requiredChange = user?.resetPassword;
  const hashFound = await userHasHash(userID);

  if(!user || !requiredChange || hashFound){
    return redirect("/error");
  }

  
  
  

  return null;
}

export default loaderResetUserID;