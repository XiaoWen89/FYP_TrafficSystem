import React, { useEffect,useState } from 'react'
import GoogleMapReact from 'google-map-react';
import axios from 'axios'

import MarkerAdv from '../MarkerAdv/markerAdv';

const mapStyles = {
  height: '70vh', 
  width: '100%'
};

const MapAdv = (props) => {
  const [leftData, setleftData] = useState([])
  const [rightData, setrightData] = useState([])

  useEffect(() => {
    setleftData(props.leftData)
  }, [props.leftData])
  console.log(props.leftData);

  useEffect(() => {
    setrightData(props.rightData)
  }, [props.rightData])
  console.log(props.rightData);
  /*
  useEffect(() =>{
    //setIncidentData({loading:true});
    let bypass = "https://cors-anywhere.herokuapp.com/" //this is just for development purpose
    const apiUrl = `http://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents`;
    const key = "4n+sGLYmQcGvMXYO+rYn+A=="

    axios.get(bypass + apiUrl, { headers: { "AccountKey": key } }).then((response) => {
        console.log(response)

        const incidents_data = response.data

        setIncidentData(incidents_data.value)
    }).catch(error => console.log(error))
  },[]);*/

  return(
    <div style={mapStyles}>
      <GoogleMapReact
        bootstrapURLKeys={{ key:'AIzaSyCQ_DqjXNhkrQq4fQfkGMFUJMX49U-g6Q0' }}
        //defaultCenter={mapCenter}
        defaultCenter={{
          lat: 1.3521,
          lng: 103.8198
        }}
        defaultZoom={12.5}
        layerTypes={['TrafficLayer']}
      >
        {leftData && leftData.length ? leftData.map((left, index) => (
          <MarkerAdv
            key={index}
            lat={left.Latitude}
            lng={left.Longitude}
            text={"left"}
          />)) : null}
         {rightData && rightData.length ? rightData.map((right, index) => (
          <MarkerAdv
            key={index}
            lat={right.Latitude}
            lng={right.Longitude}
            text={"right"}
          />
         )) : null}

      </GoogleMapReact>
    </div>     
  )
}

export default MapAdv;

