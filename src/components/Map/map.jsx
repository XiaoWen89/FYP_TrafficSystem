import React, { useEffect,useState } from 'react'
import GoogleMapReact from 'google-map-react';
import axios from 'axios'

import Marker from '../Marker/Marker'
import WeatherIcon from '../WeatherIcon/WeatherIcon'

const mapStyles = {
  height: '70vh', 
  width: '100%'
};

const Map = (props) => {
  const [accidentData, setAccidentData] = useState([])
  const [weatherForecastData, setWeatherForecastData] = useState([])

  useEffect(() => {
    setAccidentData(props.accidentData)
  }, [props.accidentData])

  useEffect(() => {
    setWeatherForecastData(props.weatherForecastData)
  }, [props.weatherForecastData])

  console.log(weatherForecastData)
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
        {accidentData && accidentData.length ? accidentData.map((accident, index) => (
          <Marker
            key={index}
            lat={accident.Latitude}
            lng={accident.Longitude}
            text={accident.Type}
          />
        )) : null}
        {weatherForecastData && weatherForecastData.length ? weatherForecastData.map((weather, index) => (
          <WeatherIcon
           key={index}
           lat={weather.location.latitude}
           lng={weather.location.longitude}
           forecast={weather.forecast}
          />
        )) : null}
      </GoogleMapReact>
    </div>     
  )
}

export default Map;

