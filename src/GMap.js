import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"


const GMap = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: 34.0466697, lng: -118.2801951 }}
    onDragEnd={ (e) => { if (props.onMap[0] !== null) { props.onLatLngUpdate(props.onMap[0].getCenter().lat(), props.onMap[0].getCenter().lng()) }}}
    ref={map => { if (map != null) { props.onGetMap(map) } } }
  >
    {props.showMarkers }
  </GoogleMap>
))


export default GMap;
