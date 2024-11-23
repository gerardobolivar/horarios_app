import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
//import "~/Scripts/FrontEnd/confirmationModal.js";
const ConfirmationModal: React.FC<{ show: boolean, btnDisabled: boolean, setShow: any, text:string, action:string, value:string }> = ({ show, btnDisabled, setShow, text, action, value }) => {
  const navigation = useNavigation();
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

  useEffect(()=>{
    if(navigation.state === "submitting"){
      const btn = document.getElementById("ok_btn") as HTMLButtonElement;
      btn.disabled = true;
    }else if(navigation.state === "loading"){
      setShow(false)
    }
  },[navigation.state])

  return <dialog open={show}>
    <div className="overlay_styles">
      <div className="modalContainer confirmationModal">
        <img src="/images/warning.svg" width="250px"/>
        <p>{text}</p>
        <Form method="POST" action={action}>
          <button
            id="ok_btn"
            name="intent"
            value={`delete-${value}`}
            type="submit"
            className={`${ navigation.state === "loading" || navigation.state === "submitting" ? "disabled mainButton" : "active mainButton"}`}>
            Aceptar</button>
          <button id={"cancelBtn"} className={"mainButton"} name="intent" value="cancelar" onClick={(e) => { handleCancelar(e) }}>Cancelar</button>
        </Form>
      </div>
    </div>
  </dialog>

}

export default ConfirmationModal;