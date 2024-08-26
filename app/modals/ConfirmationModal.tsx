import { useEffect, useState } from "react";
//import "~/Scripts/FrontEnd/confirmationModal.js";
const ConfirmationModal: React.FC<{ show: boolean, currentCellId: string, btnDisabled: boolean, setShow: any, text:string }> = ({ show, currentCellId, btnDisabled, setShow, text }) => {

  function handleCancelar(event: any) {
    event.preventDefault();
    setShow(false);
  }

  const [importedScript, setImportedScript] = useState<any>();
  useEffect(() => {
    const importedScript = async () => {
      const module = await import("~/Scripts/FrontEnd/confirmationModal.js");
      const script = module.default;
      setImportedScript(script);
    };
    importedScript();
  }, []);

  return <dialog open={show}>
    <div className="overlay_styles">
      <div className="modalContainer confirmationModal">
        <img src="/images/warning.svg" width="250px"/>
        <p>{text}</p>
        <form method="POST" action="/aula">
          <input id="aulaID" name='aulaID' hidden={true} defaultValue={currentCellId}></input>
          <button name="intent"
            value="delete_aula"
            type="submit"
            className={`${currentCellId === "" || btnDisabled ? "disabled" : "active"}`}>
            Aceptar</button>
          <button id={"cancelBtn"} className={"mainButton"} name="intent" value="cancelar" onClick={(e) => { handleCancelar(e) }}>Cancelar</button>
        </form>
      </div>
    </div>
  </dialog>

}

export default ConfirmationModal;