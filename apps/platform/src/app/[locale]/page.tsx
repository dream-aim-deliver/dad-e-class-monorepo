import { getLocale } from "next-intl/server";
import Home from "../../components/home";
import { TLocale } from "@maany_shr/e-class-translations";
import NextAuthGateway from "../../auth/next-auth-gateway";
import { auth } from "@maany_shr/e-class-models";

export default async function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  const locale = await getLocale();
  const authGateway = new NextAuthGateway();
  const sessionDTO = await authGateway.getSession();
  let session: auth.TSession | undefined;
  if (sessionDTO.success) {
    session = sessionDTO.data;
  }
  return (
    <div className="bg-card-color-fill">
      <Home locale={locale as TLocale} session={session}/>
    </div>
  );
}
