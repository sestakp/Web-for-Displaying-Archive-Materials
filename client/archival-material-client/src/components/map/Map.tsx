import React from 'react';
import { LatLngTuple, Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import archivalRecordSelector from '../../store/archivalRecord/archivalRecordSelector';
import useArchivalRecordSelector from '../../store/archivalRecord/hooks/archivalRecordSelectorHook';
import Loading from '../loading/Loading';
import logger from '../../utils/loggerUtil';
import LocationDto from '../../models/Location/LocationDto';
//https://leaflet-extras.github.io/leaflet-providers/preview/
//https://docs.stadiamaps.com/tutorials/getting-started-with-react-leaflet/#import-and-setup

//Themes
//Esri.WorldGrayCanvas
//CartoDB.Positron
//CartoDB.PositronNoLabels


Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Map: React.FC = () => {


  const archivalRecordSelector = useArchivalRecordSelector()
  

  if(archivalRecordSelector.detail == undefined){
    return <Loading />
  }

  logger.debug("locations length: ", archivalRecordSelector.detail.locations.length)

  const points = archivalRecordSelector.detail.locations.filter(l => l.latitude != null && l.longitude != null)

  
  const pointsWithoutLocation = archivalRecordSelector.detail.locations.filter(l => l.latitude == null || l.longitude == null)

  
  logger.debug("points length: ", points.length)
  logger.debug("pointsWithoutLocation length: ", pointsWithoutLocation.length)



  const center: LatLngTuple = [points[0]?.latitude ?? 49.8175, points[0]?.longitude ?? 15.4730]

  return (
    <div>
      
      <MapContainer center={center} zoom={10} /*scrollWheelZoom={false}*/ style={{height: "55vh"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      {/*<TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
/>*/}
      {/*
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>*/}
    {/*<TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
/>*/}
      

      {/*<GeoJSON data={europeGeoJson as GeoJsonObject} style={{ color: 'white', weight: 1, fillOpacity: 0.2 }} />*/}
        {points.map((location, index) => 
          <Marker key={index} position={[location.latitude, location.longitude]}>
            <Popup>
              {location.municipality}
            </Popup>
          </Marker>
        )}
    </MapContainer>
    {pointsWithoutLocation.length > 0 &&
      <div>
      <h2>Další územní rozsah</h2>
      <p>Zde jsou uvedeny ostatní obce dané archiválie, pro které se nepovedlo algoritmicky dohledat souřadnice</p>
      {pointsWithoutLocation.map((point : LocationDto) => 
        <p>{point.borough} {point.municipality} {point.district} {point.region} {point.country}</p>
      )

      }
    </div>
    }
    

  </div>
  );
};

export default Map;