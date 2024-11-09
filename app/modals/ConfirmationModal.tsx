import { useEffect, useState } from "react";
//import "~/Scripts/FrontEnd/confirmationModal.js";
const ConfirmationModal: React.FC<{ show: boolean, currentCellId: string, btnDisabled: boolean, setShow: any, text:string, action:string, value:string }> = ({ show, currentCellId, btnDisabled, setShow, text, action, value }) => {

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
        <form method="POST" action={action}>
          <input id="elementID" name='elementID' hidden={true} defaultValue={currentCellId}></input>
          <button name="intent"
            value={value}
            type="submit"
            className={`${currentCellId === "" || btnDisabled ? "disabled mainButton" : "active mainButton"}`}>
            Aceptar</button>
          <button id={"cancelBtn"} className={"mainButton"} name="intent" value="cancelar" onClick={(e) => { handleCancelar(e) }}>Cancelar</button>
        </form>
      </div>
    </div>
  </dialog>

}

export default ConfirmationModal;