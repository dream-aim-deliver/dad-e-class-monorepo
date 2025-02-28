import { getLocale } from "next-intl/server";
import Home from "../../components/home";
import { TLocale } from "@maany_shr/e-class-translations";

export default async function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  const locale = await getLocale();
  return (
    <div className="bg-card-color-fill">
      <h1 className="text-3xl font-extrablack text-base-neutral-50 text-center">Welcome to platform!</h1>
      
      <Home locale={locale as TLocale}/>
    </div>
  );
}
