import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import { FormattedMessage, useIntl } from 'umi';
import styles from './Welcome.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome = () => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        {/*<Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: 'Faster and stronger heavy-duty components have been released.',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-components</CodePreview>/*/}
        <h3>We are a group of student from the Singapore Institute of Management Global and working professionals in Singapore. We created this project for our Final Year Project.</h3>
        <br/>
        <h3>The project aims to:</h3>
        <h4>- Develop a data-driven system to forecast traffic situations based on existing traffic incidents.</h4> 
        <h4>- Develop monitor unit for traffic incidents driven by daily traffic data. </h4>
        <h4>- Forecast the possible traffic impact to end-users. </h4>
        <br/>
        <h3>The service of the system:</h3>
        <h4>1. Monitoring - display the real time incident by different type/ weather condition/ traffic congestion level in Singapore. </h4>
        <h4>2. Prediction - prediction the severity level, effect area and estimate end time for the accdient happened.</h4>
        <h4>3. Roadwork Advice - advice for the end-user for to avoid the area for the road work</h4>
        <h4>4. Forcasting - forcasting for the probility of have incident/ heavy traffic for next 2/10/24 hours at different area of Singapore </h4>
        <h4>5. Report - for the traffic agent to view overall incident/ heavy traffic by different date/ area/ hour/ day of week and view the summary. </h4>
        <br/>
        {/*<h5>Visit our project websit <a href="url">here</a> to know more about the our team members.</h5>*/}
      </Card>
    </PageContainer>
  );
};

export default Welcome;
