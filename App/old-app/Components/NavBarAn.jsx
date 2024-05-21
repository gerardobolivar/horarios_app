import dataCells from "../data";
import {dataCellsI,} from "../data";
import { useState } from "react";

function Button (props) {
  const { setSelectedButton } = props;
  const { selectedButton } = props;   
  const {setTableDataState} = props;

  function handleClick() {
    //Make a token taking the number from the id of the button
    let token = props.id.slice(-1);

    //Make a switch to change the table data
    switch (token) {
      case "1":
        setTableDataState(dataCells);
        setSelectedButton("btn-1");
        break;
      case "2":
        setTableDataState(dataCellsI);
        setSelectedButton("btn-2");
        break;
      case "3":
        setTableDataState(dataCells);
        setSelectedButton("btn-3");
        break;
      case "4":
        setTableDataState(dataCells);
        setSelectedButton("btn-4");
        break;
      default:
        setTableDataState(dataCells[0]);
        break;
    }

  }

  return (
    <button
      className={selectedButton === props.id ? "selected" : ""}
      onClick={handleClick}
    >
      {props.value}
    </button>
  );
}

export default function NavBarAn({setTableDataState}){
  //Keep the selected button
  const [selectedButton, setSelectedButton] = useState("btn-1");
    return (
      <div className="nav">
        <Button
          value="I"
          id="btn-1"
          setTableDataState={setTableDataState}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
        <Button
          value="II"
          id="btn-2"
          setTableDataState={setTableDataState}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
        <Button
          value="III"
          id="btn-3"
          setTableDataState={setTableDataState}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
        <Button
          value="IV"
          id="btn-4"
          setTableDataState={setTableDataState}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
      </div>
    );
}