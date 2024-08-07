import { LinksFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import localStyles from "./horario.css?url";


function MainTitle({ titleText = "Horario" }) {
  return (
    <div className="main-title">
      <h1>{titleText}</h1>
    </div>
  );
};

export default function Horario() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="">
        <MainTitle titleText="Horario" />
      </div>
      <Outlet/>
    </>
  );
}

export const loader = async () => {
  return null;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: localStyles },
];