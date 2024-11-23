import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getUserById, userHasHash } from "prisma/models/userModel";

export const loaderUserIdUser = async ({ params }: LoaderFunctionArgs) => {
  const isNewUser:boolean = params.iduser === "new";
  
  if(isNewUser){
    return json({ isNewUser: true, user: null, userHasHash: null})
    
  }else{
    const iduser:number = Number(params.iduser);
    const user = await getUserById(iduser);
    const userHasHashd = await userHasHash(user?.id_usuario!)
    return json({ isNewUser: false, user: user, userHasHash: userHasHashd})
  }

}
