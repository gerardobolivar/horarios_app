export default function TableRow(props) {
  let timeIndex = props.timeIndex;
  let timeRow = props.timeRow;
  let tableState = props.tableState;
  const listaCeldas = [];

  for (let j = 0; j < 7; j++) {
    let token = "cell" + timeIndex + j;
    let isTimeCell = j === 0;
    let emptyDataCell = tableState[token] == undefined || null;
    let dataCell = tableState[token];
    let amountCourses = !emptyDataCell ? dataCell.length : 1;

    if (!emptyDataCell) {
      let multiDataCell = [];
      dataCell.forEach((element, elementIndex) => {
        multiDataCell.push(

          <DataCell
            props={{ className: isTimeCell ? "time-cell" : "td-cell", id: token, colspan: amountCourses, index: elementIndex }}
            key={crypto.randomUUID()}
          >
            {element.cname}
          </DataCell>
        );
      });
      listaCeldas.push(
        <table key={crypto.randomUUID()}>
          <th>
          <tr key={crypto.randomUUID()} className="td-parent">{multiDataCell}</tr>
          </th>
        </table>  
      )
    } else {
      listaCeldas.push(
        <DataCell
          props={{ className: isTimeCell ? "time-cell" : "td-cell", id: token, colspan: amountCourses }}
          key={crypto.randomUUID()}
        >
          {isTimeCell ? timeRow : ""}
        </DataCell>
      );
    }
  }

  return (
    <>
      <tr key={crypto.randomUUID()}>{listaCeldas}</tr>
    </>
  );
}

function DataCell({ props, children }) {
  let debug = false;
  function handleClick() {
    if (debug) { console.log("Click en celda con id: " + props.id) }
  }
  return (
    <td
      className={props.className}
      id={props.id + props.index}
      onClick={handleClick}
      colSpan={props.colspan}
      key={crypto.randomUUID()}
    >
      {children}
    </td>
  )
}



//Solving the table bugs