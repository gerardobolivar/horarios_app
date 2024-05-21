import { LinksFunction, json, MetaFunction } from "@remix-run/node";
import TableBody from "~/old-app/Components/TableBody";
import TableHeader from "~/old-app/Components/TableHeader";
import Navbar from "~/old-app/Components/NavBarAn";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import dataCells from "~/old-app/data";
import  horarioStyles from "../old-app/Styles/horario.css?url";

function MainTitle({ titleText = "Mi horario" }) {
  return (
      <div className="main-title">
        <h1>{titleText}</h1>
      </div>
    );
  }

  export default function Horario() {
    const data = useLoaderData<typeof loader>();

    //set the state of the table data
    let tableData = data;
    const [tableDataState, setTableDataState] = useState(tableData);
    return (
      <>
        <div className="schedule-container">
          <MainTitle />
          <Navbar setTableDataState={setTableDataState} />
          <table className="schedule-table" id="sch-tbl">
            <thead className="table-head">
              <TableHeader />
            </thead>
            <tbody className="table-body">
              <TableBody tableState={tableDataState} />
            </tbody>
          </table>
        </div>
      </>
    );
  }

export const loader = async () => {
  try {

    return dataCells;
  } catch (error) {
    return json({ ok: false })
  }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: horarioStyles },
];