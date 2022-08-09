import React, { useEffect,useState } from 'react'
import GoogleMapReact from 'google-map-react';
import axios from 'axios'

import MarkerAdv from '../MarkerAdv/markerAdv';

import green from '../../pages/image/ModerateTraffic.png';
import orange from'../../pages/image/moderateCongest.png';
import red from'../../pages/image/highlyCongest.png';
import amber from'../../pages/image/servalCongest.png';

import { WiMoonAltNew as Dot } from "react-icons/wi";

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
          <label style={{ textAlign: 'center', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Road Works Icon:</label> <br></br>
          <span style={{ paddingRight: '20px' }}>
            <Dot size="25" color="yellow" style={{verticalAlign: 'middle'}}/>
            <b style={{fontSize:'14px', verticalAlign: 'middle'}}>Avoid Left Lane</b>
            <Dot size="25" color="red" style={{ verticalAlign: 'middle' }} />
            <b style={{ fontSize: '14px', verticalAlign: 'middle' }}>Avoid Right Lane</b>
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

export default MapAdv;

