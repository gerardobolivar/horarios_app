import { User } from "@prisma/client";
import { createCookieSessionStorage } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getUserById } from "prisma/models/userModel";

const USER_SESSION_KEY = "userId"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  }
})

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  }
  )
}

export async function createUserSession({request,userId}:{request: Request; userId:number}){
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);

  return redirect("/",{
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session,{
        maxAge: 60 * 60 * 24 * 7,
      })
    }
  })
}

export async function getUserId(request:Request):Promise<User["id_usuario"] | undefined>{
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request:Request){
  const userId = await getUserId(request);
  if(userId === undefined) return null;

  const user = await getUserById(userId);

  if(user) return user;

  throw await logout(request);
}

export async function requireUser(request: Request){
  const userId = await getUserId(request);

  if(!userId){
    throw redirect("/login")
  }
  
  return userId;
}