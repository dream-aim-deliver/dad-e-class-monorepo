import { getLocale } from "next-intl/server";
import Home from "../../components/home";
import { TLocale } from "@maany_shr/e-class-translations";
import { auth } from "@maany_shr/e-class-models";
import { NextAuthGateway } from "@maany_shr/e-class-auth";
import nextAuth from "../../auth/config";
import { getHomePage, listTopics } from '../../components/mock/serverQueries';


export default async function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  const locale = await getLocale();
  const authGateway = new NextAuthGateway(nextAuth);
  const sessionDTO = await authGateway.getSession();
  let session: auth.TSession | undefined;
  if (sessionDTO.success) {
    session = sessionDTO.data;
  }

  const homePage = await getHomePage(locale as TLocale);
  const topics = await listTopics(locale as TLocale);

//  const pingResult = await pingCMSFastAPI();
  //if (!pingResult) {
    //return <div>CMS FastAPI is not running</div>;
  //}

  //const homePageDTO = await listApiV1RepositoryHomePageGet({
    //headers: {
      //"x-auth-token": "test123",
    //},
    //query: {
      //platform_language_id: 1,
      //},
    //})



  return (
    <div className="bg-card-color-fill">
      <Home locale={locale as TLocale} session={session} homePage={homePage} topics={topics}/>
    </div>
  );
}
