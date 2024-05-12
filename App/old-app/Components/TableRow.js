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
            key={"cell" + timeIndex + j}
          >
            {element.cname}
          </DataCell>
        );
      });
      listaCeldas.push(<td className="td-parent">{multiDataCell}</td>)
    } else {
      listaCeldas.push(
        <DataCell
          props={{ className: isTimeCell ? "time-cell" : "td-cell", id: token, colspan: amountCourses }}
          key={"cell" + timeIndex + j}
        >
          {isTimeCell ? timeRow : ""}
        </DataCell>
      );
    }
  }

  return (
    <>
      <tr>{listaCeldas}</tr>
    </>
  );
}

function DataCell({ props, children }) {
  let debug = true;
  function handleClick() {
    if (debug) { console.log("Click en celda con id: " + props.id) }
  }
  return (
    <td
      className={props.className}
      id={props.id + props.index}
      onClick={handleClick}
      colSpan={props.colspan}
    >
      {children}
    </td>
  )
}