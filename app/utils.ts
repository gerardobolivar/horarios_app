import { User } from "@prisma/client";
import { useMemo } from "react";
import { useMatches } from "react-router";

export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(() => matchingRoutes.find((route) => route.id === id)
    , [matchingRoutes, id]);

  return route?.data as Record<string, unknown> | undefined;
}

export function isUser(user: any): user is User{
  return user && typeof user === "object" && typeof user.nombre_usuario === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }

  return data.user as User
}