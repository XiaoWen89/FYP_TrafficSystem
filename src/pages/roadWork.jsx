import MapAdv from '@/components/MapAdv/mapAdv';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { roadWorkAdv } from '../services/ant-design-pro/api';
import { Card, Row, Col} from 'antd';
import left from'./image/left.png';
import right from'./image/right.png';
import green from'./image/ModerateTraffic.png';
import orange from'./image/moderateCongest.png';
import red from'./image/highlyCongest.png';
import amber from'./image/servalCongest.png';

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
    <PageHeaderWrapper>
      <Card>
      <Row>
      <Col span={14}><MapAdv leftData={avoidLeftLane}rightData={avoidRightLane}/></Col>
      <Col span={1}></Col>
      <Col span={9}>
      <h3>Roadwork - Please avoid left lane. Total: <br/>{avoidLeftLane.length} - in red </h3><br/><br/>
      <h3>Roadwork - Please avoid Right lane. Total: <br/>{avoidRightLane.length} - in yellow </h3>
      </Col>
      </Row>
      </Card>
      {/*      
      <p>Roadwork - Please avoid left lane. Total: {avoidLeftLane.length} - in red </p>
      <p>Roadwork - Please avoid Right lane. Total: {avoidRightLane.length} - in yellow </p>
      <MapAdv leftData={avoidLeftLane}rightData={avoidRightLane}/>*/}
      {/*
      <br></br>
      <h1 style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold',right:'50%',left:'50%',marginLeft :'auto',
            marginRight : 'auto'}}>Map Legend</h1>
      <div
       style={{
        width: '60%',
        height: '90px',
        right: '50%',
        left: '50%',
        marginLeft :'auto',
        marginRight : 'auto',
        backgroundColor : '#E5E4E2',
        borderRadius : '12px'
      }}>
      
      <div style={{
              textAlign: 'center',
              float : 'left',
              width: '50%',
              height : '100px'
                }}>
                  <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Road Works Icon:</label> <br></br>
                  <img  src={left} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Avoid Left Lane</label>  &nbsp;  &nbsp;  &nbsp;
                  <img  src={right} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Avoid Right Lane</label>  &nbsp; &nbsp;  &nbsp;
                </div>
      <div style={{
              textAlign: 'center',
              float : 'right',
              width: '50%'
                }}>
                    <label style={{ textAlign: 'center',fontSize: '18px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Traffic Congestion Level:</label> <br></br>
                    <img  src={green} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Low</label> &nbsp; &nbsp;
                    <img  src={orange} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Moderate</label> &nbsp; &nbsp;
                    <img  src={red} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>High</label> &nbsp; &nbsp;
                    <img  src={amber} /><label style={{ textAlign: 'center',fontSize: '14px', fontFamily : 'Arial, Helvetica, sans-serif',fontWeight :'bold'}}>Serve</label> &nbsp; &nbsp;
                </div>
      </div>
              */}
    </PageHeaderWrapper>
  );
};

export default roadWork;