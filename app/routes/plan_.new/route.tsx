import { LinksFunction } from "@remix-run/node";
import { Form, Link, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import actionplanNew from "~/.server/Controller/plan_.new/action";

export default function PlanNew() {
  const DEFAULT_TOOLTIP_PLAN = "Nombre del plan de estudios"
  const [nombrePlan, setNombrePlan] = useState(DEFAULT_TOOLTIP_PLAN);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();

  useEffect(()=>{
    if(navigation.state === "submitting" || navigation.state === "loading"){
      setBtnDisabled(true);
    }else{
      setBtnDisabled(false);
    }
  },[navigation.state])


  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value !== ""
      ? setNombrePlan(event.currentTarget.value)
      : setNombrePlan(DEFAULT_TOOLTIP_PLAN)
  }

  const [importedScript, setImportedScript] = useState<any>();
  useEffect(() => {
    const importedScript = async () => {
      const module = await import("~/Scripts/FrontEnd/newPlan.js");
      const script = module.default;
      setImportedScript(script);
    };
    importedScript();
  }, []);

  return (
    <div className="container">
      <Form method="post" autoComplete="off">
        <span className="d-block">
          <input
            id="planTitle"
            title={nombrePlan}
            type="text"
            name="nombre"
            placeholder="Nombre del plan✎"
            className="inputTitle mainTitle"
            required={true}
            maxLength={100}
            onChange={handleChange} />
        </span>
        <div className="whiteContainer">
          <div>
            <label>
              Código:
              <input type="text"
                    name="codigo"
                    maxLength={10}
                    placeholder="Código✎" />
            </label>
          </div>
        </div>
        <button 
          className={`${btnDisabled?"disabled":null} menu_bottom_btn`}
          disabled={btnDisabled}
          type="submit">
            Crear</button>
        <Link to={"/plan"}>
            <button className="mainButton" >Regresar</button>
          </Link>
      </Form>
    </div>
  )
}

export const action = actionplanNew;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];
