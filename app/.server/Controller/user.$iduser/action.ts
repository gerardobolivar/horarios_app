import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createUsuario, getUserById, getUserByName, updateUsuarioRole } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const  actionUserIdUser = async ({ request, params }: ActionFunctionArgs) =>{
  const currentUserID = await requireUser(request);
  const currentUser = await getUserById(currentUserID);
  if(currentUser?.role !== "ADMIN"){return null}


  const formData = await request.formData();
  const username = String(formData.get("username")).toLocaleLowerCase();
  const role = String(formData.get("user_role"));
  const intent = formData.get("intent");
  const user = await getUserByName(username);

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
    if(user?.nombre_usuario === "ad"){
      return null;
    }else{
      await updateUsuarioRole(iduser,role);
      return redirect(`/user/`); 
    }
  }
  
    
  return null;
}