import React, { useEffect,useState } from 'react'
import GoogleMapReact from 'google-map-react';
import axios from 'axios'
import { WiMoonAltNew as Dot } from "react-icons/wi";

import Marker from '../MarkerFor/MarkerFor'

import green from '../../pages/image/ModerateTraffic.png';
import orange from'../../pages/image/moderateCongest.png';
import red from'../../pages/image/highlyCongest.png';
import amber from'../../pages/image/servalCongest.png';

const mapStyles = {
  height: '70vh', 
  width: '100%'
};

const MapFor = (props) => {
  const [forcastingData, setforcastingData] = useState([])
  

  useEffect(() => {
    setforcastingData(props.forcastingData)
  }, [props.forcastingData])

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
      {/*keys:'AIzaSyBc4RXXYkZHiW6KveQbOPyFIPd6c9_URf8'*/}
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
        {forcastingData && forcastingData.length ? forcastingData.map((accident, index) => (
          <Marker
            key={index}
            lat={accident.latitude}
            lng={accident.longitude}
            textName={accident.name}
            text = {accident.result}
          />
        )) : null}
      </GoogleMapReact>
      <div
          style={{
            textAlign: 'center',
            width: '80%',
            height: '80px',
            right: '50%',
            left: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: '#E5E4E2',
            borderRadius: '12px',
            marginTop: '10px',
          }}>
          <div
            style={{
              textAlign: 'center',
              float: 'left',
              width: '50%',
              height: '70px',

            }}>
            <label style={{ textAlign: 'center', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Probability Icon:</label> <br></br>
            <span style={{ paddingRight: '20px' }}>
                <Dot size="40" color="red" style={{ verticalAlign: 'middle' }} />
                <b style={{ fontSize: 14, verticalAlign: 'middle' }}>Area: probability</b>
              </span>
          </div>
          <div style={{
            textAlign: 'center',
            float: 'right',
            width: '50%'
          }}>
              <label style={{ textAlign: 'center', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Traffic Congestion Level:</label> <br></br>
              <img src={green} /><label style={{ textAlign: 'center', fontSize: '14px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Low</label> &nbsp; &nbsp;
              <img src={orange} /><label style={{ textAlign: 'center', fontSize: '14px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Moderate</label> &nbsp; &nbsp;
              <img src={red} /><label style={{ textAlign: 'center', fontSize: '14px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>High</label> &nbsp; &nbsp;
              <img src={amber} /><label style={{ textAlign: 'center', fontSize: '14px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Serve</label> &nbsp; &nbsp;
          </div>
      </div>
    </div>     
  )
}

export default MapFor;

