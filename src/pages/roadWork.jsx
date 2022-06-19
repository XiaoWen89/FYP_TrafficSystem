import MapAdv from '@/components/MapAdv/mapAdv';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { roadWorkAdv } from '../services/ant-design-pro/api';

const roadWork = () => {
  //const intl = useIntl();

  const [avoidLeftLane, setavoidLeftLane] = useState([]);
  const [avoidRightLane, setavoidRightLane] = useState([]);
  
  useEffect(async () => {
    fetchAccidentData();
  }, []);

  const fetchAccidentData = async () => {
    let avoidLane = await roadWorkAdv();

    let avoidLeftLane = avoidLane.left;
    console.log(avoidLeftLane);
    setavoidLeftLane(avoidLeftLane);
    
    let avoidRightLane = avoidLane.right;
    console.log(avoidRightLane);
    setavoidRightLane(avoidRightLane);
    
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
        </a>/
      </p>
      
      <p>Roadwork - Please avoid left lane. Total: {avoidLeftLane.length} - in red </p>
      <p>Roadwork - Please avoid Right lane. Total: {avoidRightLane.length} - in yellow </p>
      <MapAdv leftData={avoidLeftLane}rightData={avoidRightLane}/>
            
    </PageHeaderWrapper>
  );
};

export default roadWork;