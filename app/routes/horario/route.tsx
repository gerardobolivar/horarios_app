import { LinksFunction, json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dataCells from "./data";
//import  "~/WebComponents/MyCustomElement";
//import MyCustomElement from "~/WebComponents/MyCustomElement";

function MainTitle({ titleText = "Mi horario" }) {
  return (
      <div className="main-title">
        <h1>{titleText}</h1>
      </div>
    );
  };

  export default function Horario() {
    const data = useLoaderData<typeof loader>();
    //To be able to use the custom web component it is necessary to do a import dynamicly.
    //HTMLElement its a DOM element and it is not available in the server side.
    /*
    
    const [importedComponent, setImportedComponent] = useState<any>();
    useEffect(() => {
      const importComponent = async () => {
        const module = await import('~/WebComponents/MyCustomElement');
        const AnotherComponent = module.default;
        setImportedComponent(new AnotherComponent);
      };
  
      importComponent();
    }, []);
    */
    
    return (
      <>
        <div className="">
          <MainTitle titleText="Horario"/>
          {/*<my-custom-element text="Hola mundo" size="50px"  color="blue"></my-custom-element>*/}
        </div>
        
      </>
    );
  }

export const loader = async () => {
  try {

    return dataCells;
  } catch (error) {
    return json({ ok: false })
  }
}


export const links: LinksFunction = () => [

];
