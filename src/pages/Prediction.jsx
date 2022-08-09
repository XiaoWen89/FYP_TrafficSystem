import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import Map from '../components/Map/Map';
import { incidentShow, prediction_ } from '../services/ant-design-pro/api';
import { Card, Row, Col} from 'antd';
import accidentImage from'./image/accidentLogo.png';
import green from'./image/ModerateTraffic.png';
import orange from'./image/moderateCongest.png';
import red from'./image/highlyCongest.png';
import amber from'./image/servalCongest.png';

const Prediction = () => {
  const intl = useIntl();

  const [accidentOnlyData, setaccidentOnlyData] = useState([]);
  const [predictionData, setpredictionData] = useState([]);
  const [dataLength, setdataLength] = useState();

  useEffect(async () => {
    fetchAccidentData();
  }, []);

  useEffect(() => {
    console.log(accidentOnlyData);
  }, [accidentOnlyData]);

  useEffect(() => {
    console.log(predictionData);
  }, [predictionData]);

  const fetchAccidentData = async () => {
    let processed_data = await incidentShow();

    let accidentOnlyData = processed_data.value;
    console.log(accidentOnlyData);
    setaccidentOnlyData(accidentOnlyData);

    let prediction = await prediction_();
    console.log(prediction.Result);
    console.log(prediction.dataLength);
    setpredictionData(prediction.Result);
    setdataLength(prediction.dataLength);
  };

  return (
    <PageHeaderWrapper>
      <Card>
      <p
        style={{
          textAlign: 'center',
          marginTop: 24,
        }}
      >
      </p>
      <Row>
      <Col span={14}><Map accidentData={accidentOnlyData} type={"prediction"}/></Col>
      <Col span={1}></Col>
      <Col span={9}>
      <h3>Currently there are {dataLength} accident:  </h3>
      
      <h4>
            {predictionData.map((value, index) => (
                <li key={index}>{value.id}{". "}{value.accMsg}<br/>
                {"Prediction: "}<br/>
                {"- Severity level   : "}{value.accInfo.SeverityLevel}<br/>
                {"- Effect Area      : "}{value.accInfo.area}<br/>
                {"- Estimate End Time: "}{value.accInfo.time}<br/>
                {"-----------------------------------------------------------------------------------------"}</li>
            ))}
        </h4>
      </Col>
      </Row>
      </Card>
      {/*<p>Currently there are {accidentOnlyData.length} accident. </p>
      <ul>
            {predictionData.map((value, index) => (
                <li key={index}>{value.id}{". "}{value.accMsg}<br/>{value.accInfo}</li>
            ))}
        </ul>
            <Map accidentData={accidentOnlyData} type={"prediction"}/>*/}
      {/*
      <br></br>
      <h1 style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold',right:'50%',left:'50%',marginLeft :'auto',
            marginRight : 'auto'}}>Map Legend</h1>
      <div
      style={{
        width: '60%',
        height: '80px',
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
              height : '100px',
              borderRadius : '12px'
                }}>
                <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Accident Icon:</label> <br></br>
                 <img  src={accidentImage} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Accident Location</label>
          </div>
        <div style={{
              textAlign: 'center',
              float : 'right',
              width: '50%',
                }}>
                  <div 
                    style={{
                      textAlign: 'center',
                      float : 'top',
                      width: 'auto',
                      height : '50%',
                      borderRadius : '12px'
                      }}>
                          <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Traffic Congestion Level:</label> <br></br>
                          <img  src={green} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Low</label> &nbsp; &nbsp;
                          <img  src={orange} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Moderate</label> &nbsp; &nbsp;
                          <img  src={red} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>High</label> &nbsp; &nbsp;
                          <img  src={amber} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Serve</label> &nbsp; &nbsp;
                  </div>
                  <div style={{
                      textAlign: 'center',
                      float : 'top',
                      width: 'auto',
                      height : '50%',
                      borderRadius : '12px'
                      }}>
                   
                  </div>
          </div>
                    </div>*/}
      
    </PageHeaderWrapper>
  );
};

export default Prediction;
