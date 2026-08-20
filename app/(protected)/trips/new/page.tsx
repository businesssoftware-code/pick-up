
import { use } from "react";
import { lookupsApi } from "../../../api/lookups.api";
import MainPage from "./main-page";


export default function Page() {
  const outletsPromise = lookupsApi.getOutlets();
  const vehiclesPromise = lookupsApi.getVehicles();

  const outlets = use(outletsPromise);
  const vehicles = use(vehiclesPromise);

  console.log(vehicles, "vehiclesvehicles");

  return (
    <MainPage
      outletsProp={outlets}
      vehiclesProp={vehicles}
    />
  );
}