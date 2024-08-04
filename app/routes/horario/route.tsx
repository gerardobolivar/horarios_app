import { LinksFunction, json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Filters from "./filters";
import TIMES from "~/.server/allowedTimes";
import { getAulas } from "prisma/models/aulaModel";
import { useEffect, useState } from "react";


function MainTitle({ titleText = "Horario" }) {
  return (
    <div className="main-title">
      <h1>{titleText}</h1>
    </div>
  );
};




export default function Horario() {
  const data = useLoaderData<typeof loader>();

  let fillingTDS = Object.values(data.aulas).map((aula,index) => {
    return <td id={`${aula.identificador}-${index}`} key={aula.identificador}></td>
  })


  const timeColumn = data.allowedTimes.map((time, index) => {
    return <tr key={time}>
      <td>{time}</td>
    </tr>
  })

  const aulaRows = data.aulas.map((aula) => {
    return <th key={aula.id_aula} id={String(aula.id_aula)}>{aula.identificador}</th>
  });


  return (
    <>
      <div className="">
        <MainTitle titleText="Horario" />
      </div>
      <Filters data={data} ></Filters>
      <div id="calendar">

      </div>
    </>
  );
}

export const loader = async () => {
  const allowedTimes = TIMES;
  const aulas = await getAulas();

  return json({ allowedTimes: allowedTimes, aulas: aulas, ok: true });
}

export const links: LinksFunction = () => [];
