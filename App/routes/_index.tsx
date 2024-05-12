import { json } from "@remix-run/node";
export {default} from "App/old-app/views/admin/home";


export const loader = async () => {
  return json({ ok: true });
};