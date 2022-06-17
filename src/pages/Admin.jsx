import React, { useEffect,useState } from 'react'
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import { useIntl } from 'umi';
import Map from '../components/Map/Map';
import PieChart from '../components/PieChart/PieChart'
import { getAccidentData } from '../services/ant-design-pro/api';

const Admin = () => {
  const intl = useIntl();

  const [accidentData, setAccidentData] = useState([])
  const [accidentCountData, setAccidentCountData] = useState([])

  useEffect(async () => {
    //let raw_data = await getAccidentData();
    fetchAccidentData();
    //let accident_data = raw_data.value;
    //console.log(accident_data)
    //setAccidentData(accident_data)
    //let accident_count = processAccidentData(accident_data);
    //console.log(accident_count)
    //setAccidentCountData(accident_count)
  }, [])

  useEffect(() => {
      console.log(accidentData)
  }, [accidentData])

  useEffect(() => {
      console.log(accidentCountData)
  }, [accidentCountData])

  const fetchAccidentData = async()=>{
    let raw_data = await getAccidentData();

    let accident_data = raw_data.value;
    setAccidentData(accident_data)

    let processed_data = processAccidentData(accident_data)
    setAccidentCountData(processed_data)
  }

  function processAccidentData(accident_data){
    let processed_data = {}
    for (const index in accident_data) {
      let type = accident_data[index].Type
      if (!(type in processed_data)){
        processed_data[type] = 1
      }else{
        processed_data[type] = processed_data[type]  + 1
      }
    }

    let processed_data_ = []
    for (const type in processed_data){
      let element = {};
      element["type"] = type;
      element["value"]= processed_data[type];
      processed_data_.push(element);
    }

    return processed_data_
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
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
      <Card 
      title="Real Time Traffic Accident Monitoring"
      >
        <PieChart accidentCountData = {accidentCountData}/>
      </Card>
      <Map accidentData={accidentData}/>
    </PageHeaderWrapper>
  );
};

export default Admin;
