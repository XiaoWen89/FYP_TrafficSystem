import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import Map from '../components/Map/Map';
import { incidentShow, prediction_ } from '../services/ant-design-pro/api';
import accidentImage from'./image/accidentLogo.png';
import green from'./image/ModerateTraffic.png';
import orange from'./image/moderateCongest.png';
import red from'./image/highlyCongest.png';
import amber from'./image/servalCongest.png';

const Prediction = () => {
  const intl = useIntl();

  //const [accidentData, setAccidentData] = useState([])
  const [accidentOnlyData, setaccidentOnlyData] = useState([]);
  const [predictionData, setpredictionData] = useState([]);

  useEffect(async () => {
    //let raw_data = await getAccidentData();
    fetchAccidentData();
    //let accident_data = raw_data.value;
    //console.log(accident_data)
    //setAccidentData(accident_data)
    //let accident_count = processAccidentData(accident_data);
    //console.log(accident_count)
    //setAccidentCountData(accident_count)
  }, []);
  /*
    useEffect(() => {
        console.log(accidentData)
    }, [accidentData])
    */
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
    setpredictionData(prediction.Result);
  };

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
      <p>Currently there are {accidentOnlyData.length} accident. </p>
      <ul>
            {predictionData.map((value, index) => (
                <li key={index}>{value.id}{". "}{value.accMsg}<br/>{value.accInfo}</li>
            ))}
        </ul>
      <Map accidentData={accidentOnlyData} />
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
      </div>
      
    </PageHeaderWrapper>
  );
};

export default Prediction;
