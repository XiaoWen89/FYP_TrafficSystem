import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { Alert, Card, Typography, Row, Col } from 'antd';
import { useIntl } from 'umi';
import Map from '../components/Map/Map';
import PieChart from '../components/PieChart/PieChart'
import BarChart from '../components/BarChart/BarChart'
import { getAccidentData, get2HourWeatherPred } from '../services/ant-design-pro/api';
import fair from './image/fair.png';
import rain from './image/raining.png';
import sunny from './image/sunny.png';
import left from './image/left.png';
import accidentImage from './image/accidentLogo.png';
import green from './image/ModerateTraffic.png';
import orange from './image/moderateCongest.png';
import red from './image/highlyCongest.png';
import amber from './image/servalCongest.png';
import breakdown from './image/vehicleBreakdown.png';
import moderateTraffic from './image/ModerateTraffic1.png';

const Admin = () => {
  const intl = useIntl();

  const [accidentData, setAccidentData] = useState([])
  const [accidentCountData, setAccidentCountData] = useState([])
  const [weatherForecastData, setWeatherForecastData] = useState([])

  useEffect(async () => {
    let isMounted = true;
    fetchAccidentData(isMounted);
    return () => { isMounted = false };
  }, [])
  /*
  useEffect(() => {
      console.log(accidentData)
  }, [accidentData])

  useEffect(() => {
      console.log(accidentCountData)
  }, [accidentCountData])
  
  useEffect(() => {
      console.log(weatherForecastData)
  }, [weatherForecastData])*/

  useEffect(async () => {
    let isMounted = true;
    get2HourWeatherPredData(isMounted)
    return () => { isMounted = false };
  }, [])

  const fetchAccidentData = async (isMounted) => {
    let raw_data = await getAccidentData();

    let accident_data = raw_data.value;
    if (isMounted) setAccidentData(accident_data)

    let processed_data = processAccidentData(accident_data)
    if (isMounted) setAccidentCountData(processed_data)
  }

  const get2HourWeatherPredData = async (isMounted) => {
    let current_datetime = prepareDatetime()
    console.log(current_datetime)
    let response = await get2HourWeatherPred(current_datetime);
    console.log(response)
    let twoHourWeatherData;
    if (response.data) {
      twoHourWeatherData = response.data
      if (isMounted) setWeatherForecastData(twoHourWeatherData)
    }
  }

  function processAccidentData(accident_data) {
    let processed_data = {}
    for (const index in accident_data) {
      let type = accident_data[index].Type
      if (!(type in processed_data)) {
        processed_data[type] = 1
      } else {
        processed_data[type] = processed_data[type] + 1
      }
    }

    let processed_data_ = []
    for (const type in processed_data) {
      let element = {};
      element["type"] = type;
      element["value"] = processed_data[type];
      processed_data_.push(element);
    }

    return processed_data_
  }

  function prepareDatetime() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let current_datetime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    //let current_datetime = new Date().toISOString();
    let dot_loc = current_datetime.indexOf('.');
    console.log(dot_loc)
    let final_datetime = current_datetime.substring(0, dot_loc)
    console.log(final_datetime)

    return final_datetime
  }

  return (
    <PageHeaderWrapper
    /*
    content={intl.formatMessage({
      id: 'pages.admin.subPage.title',
      defaultMessage: 'This page can only be viewed by admin',
    })}*/
    >
      {/*} <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: 'Faster and stronger heavy-duty components have been released.',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 48,
          }}
        />
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
          }}
        >
          <SmileTwoTone /> Ant Design Pro <HeartTwoTone twoToneColor="#eb2f96" /> You
        </Typography.Title>
      </Card> 
      <p
        style={{
          textAlign: 'center',
          marginTop: 24,
        }}
      >
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
      */}
      <Card
        title="Real Time Traffic Accident Monitoring"
      >
        <Row>
          <Col span={12}><PieChart accidentCountData={accidentCountData} /></Col>
          <Col span={12}><BarChart accidentCountData={accidentCountData} /></Col>
        </Row>
      </Card>
      <Map accidentData={accidentData} weatherForecastData={weatherForecastData} type={"monitoring"}/>
      {/*
      <h1 style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold',right:'50%',left:'50%',marginLeft :'auto',
            marginRight : 'auto'}}>Map Legend</h1>
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
            borderRadius : '12px'
        }}>
          <div
             style={{
                textAlign: 'center',
                float : 'left',
                width: '50%',
                height : '70px',
                
                }}>
                  <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Weather Icon:</label> <br></br>
                  <img  src={fair} /> <label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Fair</label>  &nbsp; &nbsp; &nbsp;
                  <img  src={rain} /> <label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Rain</label> &nbsp; &nbsp; &nbsp;
                  <img  src={sunny} /> <label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Sunny</label> &nbsp; &nbsp; &nbsp;
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
                        <img  src={accidentImage} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Accident Location</label>  &nbsp; &nbsp; &nbsp;
                        <img  src={left} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Road Works</label> &nbsp; &nbsp; &nbsp;
                        <img  src={breakdown} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Vehicle Breakdown</label> &nbsp; &nbsp; &nbsp;
                        <img  src={moderateTraffic} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Heavy Traffic</label> &nbsp; &nbsp; &nbsp;
                  </div>
                  <div style={{
                      textAlign: 'center',
                      float : 'bottom',
                      width: 'auto',
                      height : '50%',
                      
                    }}>
                          <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Traffic Congestion Level:</label> <br></br>
                          <img  src={green} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Low</label> &nbsp; &nbsp;
                          <img  src={orange} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Moderate</label> &nbsp; &nbsp;
                          <img  src={red} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>High</label> &nbsp; &nbsp;
                          <img  src={amber} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Serve</label> &nbsp; &nbsp;
                  </div> 
          </div>
      </div>
                  */}
    </PageHeaderWrapper>
  );
};

export default Admin;
