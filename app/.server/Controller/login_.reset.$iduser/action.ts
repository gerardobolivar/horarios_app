import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getUserById, getUserByName, userHasHash } from "prisma/models/userModel";
import CryptoSec from "../crypto/crypto";

const actionResetUserID = async ({ request, params }: ActionFunctionArgs) => {
  const userID = Number(params.iduser);
  const formData = await request.formData();
  const password = String(formData.get("password"))
  const passwordConfirmed = password === String(formData.get("passwordConf")); 
  const user = await getUserById(userID);


  if (user && user?.resetPassword) {
    const hashFound = await userHasHash(user.id_usuario);
    if (!hashFound && passwordConfirmed) {
      const crp = new CryptoSec();
      return await crp.setPassword(password,user.id_usuario).then((r)=>{
        if(r === true){
          return redirect("/login");
        }else{
          console.error(r)
          return redirect("/error")
        }
      },(r)=>{
        console.error("Could not create password.",r)
      }).catch((e)=>{
        console.error(e)
      });
    } else {
      return redirect("/error")
    }

  } else {
    return redirect("/error")
  }

}

export default actionResetUserID; 