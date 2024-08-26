import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { useEffect, useState } from "react";
import { getAulas, removeAula } from "prisma/models/aulaModel";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import modalStyles from "~/modals/modalStyles.css?url";
import ConfirmationModal from "~/modals/ConfirmationModal";

const ROUTE_TAG = "Aulas";

export default function Aulas() {
  let data = useLoaderData<typeof loader>();
  const [curretCellId, setCurretCellId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();
  const [show, setShow] = useState(false);

  let aulasLista: any = data.listaAulas.map((aula) => {
    return <div
      className="noLinkDecoration dataRowLink"
      key={String(aula.id_aula)}
      onMouseDown={handleCellClick}>
      <div
        id={String(aula.id_aula) + "d"}>
        <h5 id={String(aula.id_aula)} className={`${curretCellId === String(aula.id_aula) ? "selected" : null} dataRow`}>
          {`Aula ${Number(aula?.identificador) < 10 ?
            "0"+aula?.identificador:
            aula?.identificador === 999 ? "Virtual" : aula?.identificador}`}
        </h5>
      </div>
    </div>
  })

  function handleCellClick(e: any) {
    setCurretCellId(e.target.id);
  }

  function handleEliminar(){
    setShow(true);
  }

  useEffect(() => {
    if (navigation.state === "submitting" || navigation.state === "loading") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [navigation.state]);

  useEffect(() => {
    if(data.listaAulas.length > 0){
      setCurretCellId(String(data.listaAulas[data.listaAulas.length-1].id_aula));
    }else{
    setCurretCellId("");
    }
  }, [data.listaAulas]);

  return (
    <div className="container-sm">
      <MainTitle innerText={ROUTE_TAG} />
      <Form autoComplete="off" method="post">
        <div className="whiteContainer" id="whiteContainerPlan">
          <div>
            <div>
            </div>
            <label>Aulas disponibles:</label>
            <div className="whiteContainer whiteContainerTable">
              {aulasLista}
            </div>
            <span className="horarios-plan-new-listacursos-buttons">
              <input id="elementID" name='elementID' hidden={true} defaultValue={curretCellId}></input>
              <Link to={`/aula/new`}
                preventScrollReset={true}>
                <button
                  type="button"
                  disabled={btnDisabled}
                  className={`${btnDisabled ? "disabled" : null} mainButton active`}>
                  Agregar</button>
              </Link>
              <Link to={`/aula/${curretCellId}`}
                preventScrollReset={true}>
                <button type="submit"
                  disabled={curretCellId === "" ? true : false}
                  className={curretCellId === "" ? "disabled" : "active"}>
                  Ver/Actualizar</button>
              </Link>
              <button
                onClick={handleEliminar}
                type="button"
                disabled={curretCellId === "" || btnDisabled ? true : false}
                className={`${curretCellId === "" || btnDisabled ? "disabled" : "active"}`}>
                Eliminar</button>
            </span>
          </div>
          <div>
          </div>
        </div>
        <Link to={"/"}>
          <button className="mainButton" >Regresar</button>
        </Link>
      </Form>
      <Outlet/>
      {show ? <ConfirmationModal 
                show={true} 
                currentCellId={curretCellId} 
                btnDisabled={btnDisabled}
                text="¿Está seguro que desea eliminar el aula?"
                action="/aula"
                value="delete_aula" 
                setShow={setShow}/> : null}
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentAula = Number(formData.get("elementID"))
  
  if(intent === "delete_aula"){
    return await removeAula(currentAula).then(()=>{
      return redirect("/aula")
    },(e)=>{
      switch (e.code) {
        case "P2003":
          console.error(`A constraint failed on in the field: ${e.meta.field_name}, in the model ${e.meta.modelName}`);
          throw redirect("/aula",405)
        default:
          return console.error(e);
      }
    })
  }
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {

  const listaAulas = await getAulas();

  return json({ listaAulas: listaAulas })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
  { rel: "stylesheet", href: modalStyles },
];
