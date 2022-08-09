import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

const DemoColumn = (props) => {

  const [data, setData] = useState([])

  useEffect(() => {
      setData(props.reportData)
    }, [props.reportData])

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
  };
  return <Column {...config} />;
};

export default DemoColumn;

{/*ReactDOM.render(<DemoColumn />, document.getElementById('container'));*/}
