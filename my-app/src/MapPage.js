import { useEffect, useState } from "react";
import MapView from "./MapView";

function MapPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5010/api/locations")
      .then((res) => res.json())
      .then((data) => {
        console.log("FETCHED DATA:", data);
        console.log("IS ARRAY:", Array.isArray(data));
        setLocations(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Map</h1>
      <MapView locations={locations} />
    </div>
  );
}

export default MapPage;