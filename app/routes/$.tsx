import { useSearchParams } from "@remix-run/react";
import { Link } from "react-router-dom";
import { SCHEDULE_ERRORS } from "~/types/horarioTypes";
export default function ErrorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const error = searchParams.get("reason");

  return (
    <div id="error-page" className="infoText">
      <h1>Oops!</h1>
      <p>{error ? `Causa: ${SCHEDULE_ERRORS[error]}` : "Sorry, an unexpected error ocurred."}</p>
      <Link to="/"><a>Back home</a></Link>
    </div>
  );
}