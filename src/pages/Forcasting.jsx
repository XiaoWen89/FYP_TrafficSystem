import MapFor from '@/components/MapFor/mapFor';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { forcasting } from '../services/ant-design-pro/api';
import left from'./image/left.png';
import right from'./image/right.png';
import green from'./image/ModerateTraffic.png';
import orange from'./image/moderateCongest.png';
import red from'./image/highlyCongest.png';
import amber from'./image/servalCongest.png';

import { Tabs,Card, Row, Col } from 'antd';


const forcastingAcc = () => {
  const intl = useIntl();

  //const [accidentForecastData, setaccidentForecastData] = useState([[]])
  const [accnextTwoHourForecastData, setaccnextTwoHourForecastData] = useState([[]])
  const [accnextTenHourForecastData, setaccnextTenHourForecastData] = useState([[]])
  const [accnext24HourForecastData, setaccnext24HourForecastData] = useState([[]])
  const [type, setType] = useState(['two','ten','24']);
  
  useEffect(async () => {
    nextTwoHour();
    nextTenHour();
    nextTFHour();
  }, []);
  /*
  useEffect(() => {
    console.log(accidentForecastData)
    }, [accidentForecastData])

  */
  useEffect(() => {
      console.log(accnextTwoHourForecastData)
      }, [accnextTwoHourForecastData])
  
  useEffect(() => {
      console.log(accnextTenHourForecastData)
      }, [accnextTenHourForecastData])

  useEffect(() => {
        console.log(accnext24HourForecastData)
        }, [accnext24HourForecastData])

  const nextTwoHour = async () => {
    let hour = 2 //defalt
    let process_data = await forcasting(hour)
         
    console.log(process_data)
    console.log("next Two")
    setaccnextTwoHourForecastData(process_data.data)
     
  };

  
  const nextTenHour= async () => {
    let hour = 10
    let process_data = await forcasting(hour)
         
    console.log(process_data)
    console.log("next Ten")
    setaccnextTenHourForecastData(process_data.data)
   
  }

  const nextTFHour= async () => {
    let hour = 24
    let process_data = await forcasting(hour)
         
    console.log(process_data)
    console.log("next 24 Hour")
    setaccnext24HourForecastData(process_data.data)
   
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
        </Card> */}
       <p
        style={{
          textAlign: 'center',
          marginTop: 24,
        }}
      >
      </p>
      {/*
       <ul>
            {accidentForecastData.map((value, index) => (
                <li key={index}>{value.name}{" "}{value.result}</li>
            ))}
        </ul>
      */}
      {/*<Button onClick={nextTwoHour}>nextTwoHour</Button>;       
      <Button onClick={nextTenHour}>nextTenHour</Button>;*/}
      <Card 
      title="Forcasting for Accident">
      <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="Two"
              tab={intl.formatMessage({
                id: 'pages.forcasting.nextTwoHour.tab',
                defaultMessage: 'Forcasting Probility for Next Two Hour', 
              })}
            />
            {
            <Tabs.TabPane
              key="Ten"
              tab={intl.formatMessage({
                id: 'pages.forcasting.nextTenHour.tab',
                defaultMessage: 'Forcasting Probility for Next Ten Hour',
              })}  
            />
            }
            
            {
            <Tabs.TabPane
              key="24"
              tab={intl.formatMessage({
                id: 'pages.forcasting.next24Hour.tab',
                defaultMessage: 'Forcasting Probility for Next 24 Hour',
              })}  
            />
            }
            
          </Tabs>
          {type === 'Two' && (
            <>
             <Row>
             <Col span={14}><MapFor forcastingData={accnextTwoHourForecastData}/></Col>
             <Col span={0.5}></Col>
            <Col span={10}> 
            There are some risk to travell to below area for Next 2 Hours:
            {accnextTwoHourForecastData.map((value, index) => (
                <div>
                {(() => {

                  if (value.result !== "0.0%") {
                    return (
                      <p>{"- "}{value.advice}</p>)}
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
          {type === 'Ten' && (
            <>
            <Row>
            <Col span={14}><MapFor forcastingData={accnextTenHourForecastData}/></Col>
            <Col span={0.5}></Col>
            <Col span={10} > 
            There are some risk to travell to below area for Next 10 Hours:
            {accnextTenHourForecastData.map((value, index) => (
                <div>
                {(() => {

                  if (value.result !== "0.0%") {
                    return (
                      <span>{"- "}{value.advice}</span>)}
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
          {type === '24' && (
            <>
            <Row>
            <Col span={14}><MapFor forcastingData={accnext24HourForecastData}/></Col>
            <Col span={.5}></Col>
            <Col span={10} > 
            There are some risk to travell to below area for Next 24 Hours:
            {accnext24HourForecastData.map((value, index) => (
                <div>
                {(() => {

                  if (value.result !== "0.0%") {
                    return (
                      <li>{"- "}{value.advice}</li>)}
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
     

     </Card>
      {/*<MapFor forcastingData={accidentForecastData}/>*/}
    </PageHeaderWrapper>
    

  );
};

export default forcastingAcc;