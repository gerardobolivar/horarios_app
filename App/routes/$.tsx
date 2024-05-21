import { Link } from "react-router-dom";
export default function ErrorPage() {

  return (
    <div id="error-page" className="infoText">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error ocurred.</p>
      <Link to="/"><a>Back home</a></Link>
    </div>
  );
}