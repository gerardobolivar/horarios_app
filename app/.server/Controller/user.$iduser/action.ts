import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createUsuario, getUserByName, updateUsuarioRole } from "prisma/models/userModel";

export const  actionUserIdUser = async ({ request, params }: ActionFunctionArgs) =>{
  const formData = await request.formData();
  const username = String(formData.get("username")).toLocaleLowerCase();
  const role = String(formData.get("user_role"));
  const intent = formData.get("intent");
  const user = await getUserByName(username);
  console.log(user);
  debugger

  if (intent === "create") {
    if(user === null){
      return await createUsuario(username,role).then(()=>{
        return redirect("/user");
      }).catch(e=>{
        console.error(e);
      return redirect("/error");
      })

    }else{
      const url = new URL(request.url);
      url.pathname = "/error";
      url.searchParams.set("reason", "USER_NOT_AVAILABLE");
      return redirect(url.toString());
    }
    

  }else if (intent === "update"){
    const iduser = Number(params.iduser);
    await updateUsuarioRole(iduser,role)
    return null;
  }
  
    
  return redirect(`/user/`);
}