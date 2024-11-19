import { useLoaderData } from "@remix-run/react";


export default function Info() {
  const data = useLoaderData<typeof loader>();
  return <div>Nothing to see here.</div>
}

 export const loader = async () => {
  return null;
 }

