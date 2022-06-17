import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import Map from '../components/Map/Map';
import { incidentShow, prediction_ } from '../services/ant-design-pro/api';

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
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
      </p>
      <Map accidentData={accidentOnlyData} />
      <p>{predictionData}</p>
    </PageHeaderWrapper>
  );
};

export default Prediction;
