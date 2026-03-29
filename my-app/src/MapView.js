import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapView({ locations }) {
  console.log("locations in MapView:", locations);

  return (
    <MapContainer
      center={[43.4643, -80.5204]}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {Array.isArray(locations) &&
        locations.map((loc, index) => {
          console.log("ONE LOCATION:", loc);
          console.log("LAT/LON:", loc.lat, loc.lon);

          return (
            <Marker
              key={loc.id || index}
              position={[Number(loc.lat), Number(loc.lon)]}
            >
              <Popup>{loc.name || "User Location"}</Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}