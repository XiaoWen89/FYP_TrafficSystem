import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react';
import axios from 'axios'

import { Checkbox } from 'antd';

import Marker from '../Marker/Marker'
import WeatherIcon from '../WeatherIcon/WeatherIcon'

import { WiMoonAltNew as Dot } from "react-icons/wi";
import { WiDaySunny as Sunny, WiCloud as Cloudy, WiHail as Rain } from "react-icons/wi";

import green from '../../pages/image/ModerateTraffic.png';
import orange from'../../pages/image/moderateCongest.png';
import red from'../../pages/image/highlyCongest.png';
import amber from'../../pages/image/servalCongest.png';

const mapStyles = {
  height: '70vh',
  width: '100%',
  paddingBottom: '50px'
};

const Map = (props) => {
  const [accidentData, setAccidentData] = useState([])
  const [accidentDataDisplay, setAccidentDataDisplay] = useState([])
  const [weatherForecastData, setWeatherForecastData] = useState([])

  const [accident, setAccident] = useState(true);
  const [roadWork, setRoadWork] = useState(true);
  const [breakdown, setBreakdown] = useState(true);
  const [heavyTraffic, setHeavyTraffic] = useState(true);
  const [others, setOthers] = useState(true);

  useEffect(() => {
    setAccidentData(props.accidentData);
    setAccidentDataDisplay(props.accidentData)
  }, [props.accidentData])
  
  if (props.type === "monitoring") {
    useEffect(() => {
      setWeatherForecastData(props.weatherForecastData)
    }, [props.weatherForecastData])
  }
  //console.log(weatherForecastData)
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
  function processAccidentData(accidentData, accident_, roadwork_, breakdown_, heavyTraffic_, others_) {
    let new_data_list = []
    for (var index in accidentData) {
      if (accident_) {
        if (accidentData[index]['Type'] === "Accident") {
          //console.log("accident data added")
          new_data_list.push(accidentData[index])
          continue;
        }
      }

      if (roadwork_) {
        //console.log("got roadwork data")
        if (accidentData[index]['Type'] === "Roadwork") {
          new_data_list.push(accidentData[index])
          continue;
        }
      }

      if (breakdown_) {
        if (accidentData[index]['Type'] === "Vehicle breakdown") {
          new_data_list.push(accidentData[index])
          continue;
        }
      }

      if (heavyTraffic_) {
        if (accidentData[index]['Type'] === "Heavy Traffic") {
          new_data_list.push(accidentData[index])
          continue;
        }
      }

      if (others_) {
        if (accidentData[index]['Type'] !== "Roadwork" && accidentData[index]['Type'] !== "Accident" && accidentData[index]['Type'] !== "Vehicle breakdown" && accidentData[index]['Type'] !== "Heavy Traffic") {
          //console.log(accidentData[index])
          new_data_list.push(accidentData[index])
        }
      }
    }

    return new_data_list
  }

  const handleChangeAccident = (e) => {
    setAccident(e.target.checked)

    let processed_accident_data = processAccidentData(accidentData, e.target.checked, roadWork, breakdown, heavyTraffic, others)

    setAccidentDataDisplay(processed_accident_data)
  };

  const handleChangeRoadWork = (e) => {
    setRoadWork(e.target.checked);

    let processed_accident_data = processAccidentData(accidentData, accident, e.target.checked, breakdown, heavyTraffic, others)

    setAccidentDataDisplay(processed_accident_data)
  };

  const handleChangeBreakdown = (e) => {
    setBreakdown(e.target.checked);

    let processed_accident_data = processAccidentData(accidentData, accident, roadWork, e.target.checked, heavyTraffic, others)

    setAccidentDataDisplay(processed_accident_data)
  };

  const handleChangeHeavyTraffic = (e) => {
    setHeavyTraffic(e.target.checked);

    let processed_accident_data = processAccidentData(accidentData, accident, roadWork, breakdown, e.target.checked, others)

    setAccidentDataDisplay(processed_accident_data)
  };

  const handleChangeOthers = (e) => {
    setOthers(e.target.checked);

    let processed_accident_data = processAccidentData(accidentData, accident, roadWork, breakdown, heavyTraffic, e.target.checked)

    setAccidentDataDisplay(processed_accident_data)
  };
  
  if (props.type === "monitoring"){
    return (
      <div style={mapStyles}>
        {/*keys:'AIzaSyBc4RXXYkZHiW6KveQbOPyFIPd6c9_URf8'*/}
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCQ_DqjXNhkrQq4fQfkGMFUJMX49U-g6Q0' }}
          //defaultCenter={mapCenter}
          defaultCenter={{
            lat: 1.3521,
            lng: 103.8198
          }}
          defaultZoom={12.5}
          layerTypes={['TrafficLayer']}
        >
          {accidentDataDisplay && accidentDataDisplay.length ? accidentDataDisplay.map((accident, index) => (
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
        {/*
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <Checkbox checked={accident} onChange={handleChangeAccident} />
            <b style={{ fontSize: 12 }}>Accident</b>
            <Dot size="20" color="red" />
          </div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <Checkbox checked={roadWork} onChange={handleChangeRoadWork} />
            <b style={{ fontSize: 12 }}>Roadwork</b>
            <Dot size="20" color="yellow" />
          </div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <Checkbox checked={breakdown} onChange={handleChangeBreakdown} />
            <b style={{ fontSize: 12 }}>Vehicle breakdown</b>
            <Dot size="20" color="blue" />
          </div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <Checkbox checked={heavyTraffic} onChange={handleChangeHeavyTraffic} />
            <b style={{ fontSize: 12 }}>Heavy traffic</b>
            <Dot size="20" color="orange" />
          </div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <Checkbox checked={others} onChange={handleChangeOthers} />
            <b style={{ fontSize: 12 }}>Others</b>
            <Dot size="20" color="grey" />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}><Cloudy size={35} /><b style={{fontSize:20}}>Fair</b> </div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}><Rain size={35} /><b style={{fontSize:20}}>Rain</b> </div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}><Sunny size={35} /><b style={{fontSize:20}}>Sunny</b></div>
        </div>
        */}
        <div
          style={{
              textAlign: 'center',
              width: '80%',
              height: '140px',
              right: '50%',
              left: '50%',
              marginLeft :'auto',
              marginRight : 'auto',
              backgroundColor : '#E5E4E2',
              borderRadius : '12px',
              marginTop : '10px',
          }}>
            <div
               style={{
                  textAlign: 'center',
                  float : 'left',
                  width: '50%',
                  height : '70px',
                  
                  }}>
                    <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Weather Icon:</label> <br></br>
                    {/*<img  src={fair} /> <label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Fair</label>  &nbsp; &nbsp; &nbsp;
                    <img  src={rain} /> <label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Rain</label> &nbsp; &nbsp; &nbsp;
                <img  src={sunny} /> <label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Sunny</label> &nbsp; &nbsp; &nbsp;*/}
                    <span style={{paddingRight:'20px'}}><Cloudy size={35} style={{verticalAlign: 'middle'}}/><b style={{fontSize:14, verticalAlign: 'middle'}}>Fair</b></span>
                    <span style={{paddingRight:'20px'}}><Rain size={35} style={{verticalAlign: 'middle'}}/><b style={{fontSize:14, verticalAlign: 'middle'}}>Rain</b></span>
                    <span style={{paddingRight:'20px'}}><Sunny size={35} style={{verticalAlign: 'middle'}}/><b style={{fontSize:14, verticalAlign: 'middle'}}>Sunny</b></span>
            </div>
            <div style={{
                textAlign: 'center',
                float : 'right',
                width: '50%'
                  }}>
                    <div style={{
                        textAlign: 'center',
                        float : 'top',
                        width: 'auto',
                        height : '50%',
                        
                      }}>
                          <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Traffic Icon:</label> <br></br>
                          {/*<img  src={accidentImage} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Accident Location</label>  &nbsp; &nbsp; &nbsp;
                          <img  src={left} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Road Works</label> &nbsp; &nbsp; &nbsp;
                          <img  src={breakdown} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Vehicle Breakdown</label> &nbsp; &nbsp; &nbsp;
                    <img  src={moderateTraffic} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Heavy Traffic</label> &nbsp; &nbsp; &nbsp;*/}
                          <span style={{paddingRight:'20px'}}>
                            <Checkbox checked={accident} onChange={handleChangeAccident} style={{verticalAlign: 'middle'}}/>
                            <Dot size="25" color="red" style={{verticalAlign: 'middle'}}/>
                            <b style={{fontSize:14, verticalAlign: 'middle'}}>Accident</b>
                          </span>
                          <span style={{paddingRight:'20px'}}>
                            <Checkbox checked={roadWork} onChange={handleChangeRoadWork} style={{verticalAlign: 'middle'}}/>
                            <Dot size="25" color="yellow" style={{verticalAlign: 'middle'}}/>
                            <b style={{fontSize:14, verticalAlign: 'middle'}}>Roadwork</b>
                          </span>
                          <span style={{paddingRight:'20px'}}>
                            <Checkbox checked={breakdown} onChange={handleChangeBreakdown} style={{verticalAlign: 'middle'}}/>
                            <Dot size="25" color="blue" style={{verticalAlign: 'middle'}}/>
                            <b style={{fontSize:14, verticalAlign: 'middle'}}>Vehicle breakdown</b>
                          </span>
                          <br></br>
                          <span style={{paddingRight:'20px'}}>
                            <Checkbox checked={heavyTraffic} onChange={handleChangeHeavyTraffic} style={{verticalAlign: 'middle'}}/>
                            <Dot size="25" color="orange" style={{verticalAlign: 'middle'}}/>
                            <b style={{fontSize:14, verticalAlign: 'middle'}}>Heavy traffic</b>
                          </span>
                          <span style={{paddingRight:'20px'}}>
                            <Checkbox checked={others} onChange={handleChangeOthers} style={{verticalAlign: 'middle'}}/>
                            <Dot size="25" color="grey" style={{verticalAlign: 'middle'}}/>
                            <b style={{fontSize:14, verticalAlign: 'middle'}}>Others</b>
                          </span>
                    </div>
  
                    <div style={{
                        textAlign: 'center',
                        float : 'bottom',
                        width: 'auto',
                        height : '50%',
                        paddingTop: '10px',
                      }}>
                            <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Traffic Congestion Level:</label> <br></br>
                            <img  src={green} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Low</label> &nbsp; &nbsp;
                            <img  src={orange} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Moderate</label> &nbsp; &nbsp;
                            <img  src={red} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>High</label> &nbsp; &nbsp;
                            <img  src={amber} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Serve</label> &nbsp; &nbsp;
                    </div> 
  
            </div>
        </div>
      </div>
    )
  }
  else if (props.type === "prediction"){
    return(
      <div style={mapStyles}>
        {/*keys:'AIzaSyBc4RXXYkZHiW6KveQbOPyFIPd6c9_URf8'*/}
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCQ_DqjXNhkrQq4fQfkGMFUJMX49U-g6Q0' }}
          //defaultCenter={mapCenter}
          defaultCenter={{
            lat: 1.3521,
            lng: 103.8198
          }}
          defaultZoom={12.5}
          layerTypes={['TrafficLayer']}
        >
          {accidentDataDisplay && accidentDataDisplay.length ? accidentDataDisplay.map((accident, index) => (
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
            <label style={{ textAlign: 'center', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Accident Icon:</label> <br></br>
            <span style={{ paddingRight: '20px' }}>
                <Dot size="25" color="red" style={{ verticalAlign: 'middle' }} />
                <b style={{ fontSize: 14, verticalAlign: 'middle' }}>Accident</b>
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
  }else{
    return(
      <div>
        <p>There is no such type, please check ....</p>
      </div>
    )
  }
}

export default Map;

