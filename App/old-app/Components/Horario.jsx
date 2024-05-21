import { useState } from "react";
import React from "react";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import Navbar from "./NavBarAn";

function MainTitle({ titleText = "Mi horario" }) {
return (
    <div className="main-title">
      <h1>{titleText}</h1>
    </div>
  );
}

export default function Horario(tableData) {
  //set the state of the table data
  const [tableDataState, setTableDataState] = useState(tableData.tableData);
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

async function HorarioLoader(){
  //Some fetch call in here...
}

export {HorarioLoader};