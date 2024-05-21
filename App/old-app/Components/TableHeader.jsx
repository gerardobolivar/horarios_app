import React from "react";

function TableHeader() {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return (
    <tr>
      <th>Horas</th>
      {dias.map((dia, index) => {
        return (
           <th className="header-cell" key={"d" + index}>{dias[index]}</th>
        )}
        )
      }
    </tr>
  )
}

export default TableHeader;
