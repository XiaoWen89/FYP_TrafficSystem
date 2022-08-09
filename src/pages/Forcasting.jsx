import MapFor from '@/components/MapFor/mapFor';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { forcasting } from '../services/ant-design-pro/api';
import { Tabs,Card, Row, Col } from 'antd';


const forcastingAcc = () => {
  const intl = useIntl();

  //const [accidentForecastData, setaccidentForecastData] = useState([[]])
  const [accnextTwoHourForecastData, setaccnextTwoHourForecastData] = useState([[]])
  const [accnextTenHourForecastData, setaccnextTenHourForecastData] = useState([[]])
  const [accnext24HourForecastData, setaccnext24HourForecastData] = useState([[]])
  const [htnextTwoHourForecastData, sethtnextTwoHourForecastData] = useState([[]])
  const [htnextTenHourForecastData, sethtnextTenHourForecastData] = useState([[]])
  const [htnext24HourForecastData, sethtnext24HourForecastData] = useState([[]])
  const [typeforc, setTypeforc] = useState(['acc','ht']);
  const [type, setType] = useState(['two','ten','24']);
  
  useEffect(async () => {
    nextTwoHour();
    nextTenHour();
    nextTFHour();
  }, []);

  
  const nextTwoHour = async () => {
    let hour = 2 //defalt
    let process_data = await forcasting(hour)
         
    console.log(process_data)
    console.log("next Two")
    setaccnextTwoHourForecastData(process_data.dataAcc)
    sethtnextTwoHourForecastData(process_data.dataHT)
  };

  
  const nextTenHour= async () => {
    let hour = 10
    let process_data = await forcasting(hour)
         
    console.log(process_data)
    console.log("next Ten")
    setaccnextTenHourForecastData(process_data.dataAcc)
    sethtnextTenHourForecastData(process_data.dataHT)
   
  }

  const nextTFHour= async () => {
    
    let hour = 24
    let process_data = await forcasting(hour)
         
    console.log(process_data)
    console.log("next 24 Hour")
    setaccnext24HourForecastData(process_data.dataAcc)
    sethtnext24HourForecastData(process_data.dataHT)
    
  }
  
  return (
    <PageHeaderWrapper>
       <p
        style={{
          textAlign: 'center',
          marginTop: 24,
        }}
      >
      </p>
      <Card>
      <Tabs activeKey={typeforc} onChange={setTypeforc}>
            <Tabs.TabPane
              key="acc"
              tab={intl.formatMessage({
                id: 'pages.forcasting.accident.tab',
                defaultMessage: 'Forcasting for Accident', 
              })}
            />
            {
            <Tabs.TabPane
              key="ht"
              tab={intl.formatMessage({
                id: 'pages.forcasting.heavytraffic.tab',
                defaultMessage: 'Forcasting for Heavy Traffic',
              })}  
            />
            }
      </Tabs>

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
          {type === 'Two' && typeforc==='acc'&& (
            <>
             <Row>
             <Col span={14}><MapFor forcastingData={accnextTwoHourForecastData}/></Col>
             <Col span={1}></Col>
            <Col span={9}> 
            <h3>There are some risk to travell to below {accnextTwoHourForecastData.length} area for Next 2 Hours:</h3>
            {accnextTwoHourForecastData.map((value, index) => (
                <div>
                {(() => {

                  if (value.result !== "0.0%") {
                    return (
                      <h4>
                      <li>{index+1}{". "}{value.name}{":"}</li>
                          <li>{"- Please avoid travell to here: "}</li>
                          <li>{"-->"}{value.advice}{"later"}</li>
                    </h4>)
                      }
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
          {type === 'Ten' && typeforc==='acc'&& (
            <>
            <Row>
            <Col span={14}><MapFor forcastingData={accnextTenHourForecastData}/></Col>
            <Col span={1}></Col>
            <Col span={9} > 
            <h3>There are some risk to travell to below {accnextTenHourForecastData.length} area for Next 10 Hours:</h3>
            {accnextTenHourForecastData.map((value, index) => (
                <div>
                {(() => {
                  
                  if (value.result !== "0.0%") {
                    return (
                    <h4>
                      <li>{index+1}{". "}{value.name}{":"}</li>
                      <li>{"- Please avoid travell to here: "}</li>
                      <li>{"-->"}{value.advice}{"later"}</li>
                    </h4>)
                    }
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
          {type === '24' && typeforc==='acc'&& (
            <>
            <Row>
            <Col span={14}><MapFor forcastingData={accnext24HourForecastData}/></Col>
            <Col span={1}></Col>
            <Col span={9} > 
            <h3>There are some risk to travell to below {accnext24HourForecastData.length} area for Next 24 Hours:</h3>
            {accnext24HourForecastData.map((value, index) => (
                <div>
                {(() => {

                  if (value.result !== "0.0%") {
                    return (
                      <h4>
                      <li>{index+1}{". "}{value.name}{":"}</li>
                      <li>{"-Please avoid travell to here: "}</li>
                      <li>{"-->"}{value.advice}{"later"}</li>
                    </h4>)}
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
            {type === 'Two' && typeforc==="ht" && (
            <>
             <Row>
             <Col span={14}><MapFor forcastingData={htnextTwoHourForecastData}/></Col>
             <Col span={1}></Col>
             <Col span={9}> 
            <h3>There are some risk to travell to below {htnextTwoHourForecastData.length} area for Next 2 Hours:</h3>
            {htnextTwoHourForecastData.map((value, index) => (
                <div>
                {(() => {

                  if (value.result !== "0.0%") {
                    return (
                      <h4>
                      <li>{index+1}{". "}{value.name}{":"}</li>
                          <li>{"- Please avoid travell to here: "}</li>
                          <li>{"-->"}{value.advice}{"later"}</li>
                    </h4>)
                      }
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
            {type === 'Ten' && typeforc==='ht'&& (
            <>
            <Row>
            <Col span={14}><MapFor forcastingData={htnextTenHourForecastData}/></Col>
            <Col span={1}></Col>
            <Col span={9} > 
            <h3>There are some risk to travell to below {htnextTenHourForecastData.length} area for Next 10 Hours:</h3>
            {htnextTenHourForecastData.map((value, index) => (
                <div>
                {(() => {
                  
                  if (value.result !== "0.0%") {
                    return (
                    <h4>
                      <li>{index+1}{". "}{value.name}{":"}</li>
                      <li>{"- Please avoid travell to here: "}</li>
                      <li>{"-->"}{value.advice}{"later"}</li>
                    </h4>)
                    }
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}
            {type === '24' && typeforc==='ht'&& (
            <>
            <Row>
            <Col span={14}><MapFor forcastingData={htnext24HourForecastData}/></Col>
            <Col span={1}></Col>
            <Col span={9} > 
            <h3>There are some risk to travell to below {htnext24HourForecastData.length} area for Next 24 Hours:</h3>
            {htnext24HourForecastData.map((value, index) => (
                <div>
                {(() => {

                  if (value.result !== "0.0%") {
                    return (
                      <h4>
                      <li>{index+1}{". "}{value.name}{":"}</li>
                      <li>{"- Please avoid travell to here: "}</li>
                      <li>{"-->"}{value.advice}{"later"}</li>
                    </h4>)}
                     })()}
                </div>
            ))}</Col>
            </Row>
            </>
            )}

     </Card>
    </PageHeaderWrapper>
    

  );
};

export default forcastingAcc;