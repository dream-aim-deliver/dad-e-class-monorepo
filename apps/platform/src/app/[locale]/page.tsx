import Home from "../../components/home";

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  const serverSideParam = "Hello from server";
  //changes
  return (
    <div className="bg-card-color-fill">
      <h1 className="text-3xl font-extrablack text-base-neutral-50 text-center">Welcome to platform!</h1>
      
      <Home serverSideParam={serverSideParam}/>
    </div>
  );
}
