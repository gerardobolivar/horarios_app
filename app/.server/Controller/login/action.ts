import { ActionFunctionArgs } from "@remix-run/node";
import { validateUser } from "prisma/models/userModel";
import { createUserSession } from "~/.server/session";

const actionLogin = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = String(formData.get("username")); 
  const password = String(formData.get("password")); 

  const userID = await validateUser(password,username);


  return userID ? createUserSession({request, userId: userID!}) : null
}

export default actionLogin;