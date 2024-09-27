import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserId } from "~/.server/session";

const loaderLogin = async ({ params, request}: LoaderFunctionArgs) => {
  const userID = await getUserId(request);
  
  if(userID){
    return redirect("/");
  }

  return json({});
}

export default loaderLogin;