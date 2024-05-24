import React from "react";
import TableRow from "./TableRow";
const timesOfDay = [
  "7:00-8:00",
  "8:00-9:00",
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
  "22:00-23:00",
];

function TableBody({ tableState }) {
  let tableRows = [];
  timesOfDay.map((timeRow, timeIndex) => {
          tableRows.push(
            <TableRow
              timeIndex={timeIndex}
              timeRow={timeRow}
              tableState = {tableState}
              key={crypto.randomUUID()}
            />
          );
  });
  

  return <>{tableRows}</>;
}

export default TableBody;
