import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getUserById } from "prisma/models/userModel";

export const loaderUserIdUser = async ({ params }: LoaderFunctionArgs) => {
  const isNewUser:boolean = params.iduser === "new";
  const iduser:number = Number(params.iduser);
  return json({ isNewUser: isNewUser, user: isNewUser ? null: await getUserById(iduser)})
}
