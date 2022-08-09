import { PageHeaderWrapper } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { reportingAdmin,lastUpdate,updateData } from '../services/ant-design-pro/api';
import { Tabs,Card, Row, Col } from 'antd';
import DemoColumn from '../components/ColumnPlot/ColumnPlot';
import { DatePicker } from 'antd';

const reporting = () => {
    const intl = useIntl();
    
    const [today, settoday] = useState()
    const [avedaily, setavedaily] = useState()
    const [sumdaily, setsumdaily] = useState([[]])
    const [sumsmall, setsumsmall] = useState([[]])
    const [avesmall, setavesmall] = useState([[]])
    const [sumhour, setsumhour] = useState([[]])
    const [avehour, setavehour] = useState([[]])
    const [sumday, setsumday] = useState([[]])
    const [aveday, setaveday] = useState([[]])
    const [avedailyht, setavedailyht] = useState()
    const [sumdailyht, setsumdailyht] = useState([[]])
    const [sumsmallht, setsumsmallht] = useState([[]])
    const [avesmallht, setavesmallht] = useState([[]])
    const [sumhourht, setsumhourht] = useState([[]])
    const [avehourht, setavehourht] = useState([[]])
    const [sumdayht, setsumdayht] = useState([[]])
    const [avedayht, setavedayht] = useState([[]])
    const [summary, setsummary] = useState([[]])
    const [summaryht, setsummaryht] = useState([[]])
    const [lastupdate, setlastupdate] = useState()
    const [typereport, setTypeforc] = useState(['acc','ht']);
    const [type, setType] = useState(['daily','area','hour','day',"sumary"]);
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    
    useEffect(async () => {
      dateLoad();
    }, []);

    useEffect(() => {
      console.log(lastupdate);
    }, [lastupdate]);

    const dateLoad = async () => {
      let process_ = await updateData()
      let process_date = await lastUpdate()
      let date_update = process_date.update
      console.log(date_update)
      setlastupdate(date_update)
      setsummary([{"type":"","value":0},{"type":"","value":0},{"type":"","value":0},{"type":"","value":0}])
      setsummaryht([{"type":"","value":0},{"type":"","value":0},{"type":"","value":0},{"type":"","value":0}])
      let today = new Date().toLocaleDateString()
      settoday(today)
      console.log(today)
    };

   const onChange = (dates, dateStrings) => {
        if (dates) {
          console.log('From#: ', dates[0], ', to: ', dates[1]);
          console.log('From%: ', dateStrings[0], ', to: ', dateStrings[1]);

        } else {
          console.log('Clear');
        }
        reportLoading(dateStrings);
        
      };

    const reportLoading = async (dateStrings) => {
      
      let dates={
        "start_date": dateStrings[0],
        "end_date": dateStrings[1]
      }
      let process_data = await reportingAdmin(dates)
      let process_dataAcc = process_data.acc
      let process_dataHt = process_data.ht
      console.log(process_dataAcc)
      console.log(process_dataHt)

      setavedaily(process_dataAcc.avedaily)
      setsumdaily(process_dataAcc.sumdaily)
      
      setsumsmall(process_dataAcc.sumsmall)
      setavesmall(process_dataAcc.avesmall)

      setsumhour(process_dataAcc.sumhour)
      setavehour(process_dataAcc.avehour)

      setsumday(process_dataAcc.sumday)
      setaveday(process_dataAcc.aveday)
      //
      setavedailyht(process_dataHt.avedaily)
      setsumdailyht(process_dataHt.sumdaily)
      
      setsumsmallht(process_dataHt.sumsmall)
      setavesmallht(process_dataHt.avesmall)

      setsumhourht(process_dataHt.sumhour)
      setavehourht(process_dataHt.avehour)

      setsumdayht(process_dataHt.sumday)
      setavedayht(process_dataHt.aveday)
      //
      setsummary(process_data.accr)
      setsummaryht(process_data.htr)
    };   


    return (

      <PageHeaderWrapper>
         <p
          style={{
            textAlign: 'center',
            marginTop: 24,
          }}
        ></p>
        
        <Card>
        <Row>
        <Col span={6}><h2>Select for the Period for the Report: </h2></Col>
        <Col span={5}>
        <RangePicker 
                    format={dateFormat} disabledDate={d => !d || d.isBefore('2022/07/06') || d.isAfter(today)}
                    onChange={onChange}
                    />
        </Col>
        </Row>        
        <Tabs activeKey={typereport} onChange={setTypeforc}>
              <Tabs.TabPane
                key="acc"
                tab={intl.formatMessage({
                  id: 'pages.reporting.accident.tab',
                  defaultMessage: 'Report for Accident', 
                })}
              />
              {
              <Tabs.TabPane
                key="ht"
                tab={intl.formatMessage({
                  id: 'pages.reporting.heavytraffic.tab',
                  defaultMessage: 'Forcasting for Heavy Traffic',
                })}  
              />
              }
        </Tabs>
  
        <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="daily"
                tab={intl.formatMessage({
                  id: 'pages.reporting.daily.tab',
                  defaultMessage: 'Report for daliy Accident', 
                })}
              />
              {
              <Tabs.TabPane
                key="area"
                tab={intl.formatMessage({
                  id: 'pages.reporting.area.tab',
                  defaultMessage: 'Report for area of Accident',
                })}  
              />
              } 
              {
              <Tabs.TabPane
                key="hour"
                tab={intl.formatMessage({
                  id: 'pages.reporting.hour.tab',
                  defaultMessage: 'Report for hour of Accident',
                })}  
              />
              }
              {
              <Tabs.TabPane
                key="day"
                tab={intl.formatMessage({
                  id: 'pages.reporting.day.tab',
                  defaultMessage: 'Report for day of Accident',
                })}  
              />
              }
              {
              <Tabs.TabPane
                key="summary"
                tab={intl.formatMessage({
                  id: 'pages.reporting.summary.tab',
                  defaultMessage: 'Summary of the report',
                })}  
              />
              }
              
            </Tabs>
            {type === 'daily' && typereport==='acc'&& (
              <>
               <Row>
               <Col span={20}><DemoColumn reportData = {sumdaily}/></Col>
               <Col span={4}><h3>Average daily accident is: {avedaily}</h3></Col>
               </Row>
              </>
              )}
            {type === 'area' && typereport==='acc'&& (
              <>
              <Row>
              <h3>Total Accident for the period of time for different area:</h3>
              <Col span={24}><DemoColumn reportData = {sumsmall}/></Col>
              </Row>
              <Row>
              <h3>Daily Accident for the period of time for different area:</h3>
              <Col span={24}><DemoColumn reportData = {avesmall}/></Col>
              </Row>    
              </>
              )}
            {type === 'hour' && typereport==='acc'&& (
              <>
            <Row>
            <h3>Total Accident for the period of time for different hour:</h3>
              <Col span={24}><DemoColumn reportData = {sumhour}/></Col>
              </Row>
              <Row>
              <h3>Daily Accident for the period of time for different hour:</h3>
              <Col span={24}><DemoColumn reportData = {avehour}/></Col>
              </Row>    
              </>
              )}
              {type === 'day' && typereport==='acc'&& (
              <>
              <Row>
              <Col span={11}><h3>Total Accident for the period of time for different day:</h3></Col>
              <Col span={2}></Col>
              <Col span={11}><h3>Average Accident for the period of time for different day:</h3></Col>
              </Row>
              <Row>
              <Col span={11}><DemoColumn reportData = {sumday}/></Col>
              <Col span={2}></Col>
              <Col span={11}><DemoColumn reportData = {aveday}/></Col>
              </Row>    
              </>
              )}
              {type === 'summary' && typereport==='acc'&& (
              <>
              <h2>The report is for Accident the select period:</h2>
              <br></br>
              <h3>Average daily accident is: {avedaily} </h3><br></br>
              <h3>Highest daily accident is on {summary[0].type}: {summary[0].value} cases</h3><br></br>
              <h3>Highest average daily accident is at {summary[1].type}: {summary[1].value} cases</h3><br></br>
              <h3>Highest average daily accident is at {summary[2].type}:00 everyday: {summary[2].value} cases</h3><br></br>
              <h3>Highest average accident is on {summary[3].type} every week: {summary[3].value} cases</h3><br></br>
              </>
              )}
              {type === 'daily' && typereport==="ht" && (
              <>
               <Row>
               <Row>
               <Col span={20}><DemoColumn reportData = {sumdailyht}/></Col>
               <Col span={4}><h3>Average Heavy Traffic incident happened daily is: {avedailyht}</h3></Col>
               </Row>
              </Row>
              </>
              )}
              {type === 'area' && typereport==='ht'&& (
              <>
              <Row>
              <h3>Total Heavy Traffic incident happened for the period of time for different area:</h3>
              <Col span={24}><DemoColumn reportData = {sumsmallht}/></Col>
              </Row>
              <Row>
              <h3>Daily Heavy Traffic incident happened for the period of time for different area:</h3>
              <Col span={24}><DemoColumn reportData = {avesmallht}/></Col>
              </Row>  
              </>
              )}
              {type === 'hour' && typereport==='ht'&& (
              <>
              <Row>
              <h3>Total Heavy Traffic incident happened for the period of time for different hour:</h3>
              <Col span={24}><DemoColumn reportData = {sumhourht}/></Col>
              </Row>
              <Row>
              <h3>Daily Heavy Traffic incident happened for the period of time for different hour:</h3>
              <Col span={24}><DemoColumn reportData = {avehourht}/></Col>
              </Row>   
              </>
              )}
              {type === 'day' && typereport==='ht'&& (
              <>
              <Row>
              <Col span={11}><h3>Total Heavy Traffic incident happened for the period of time for different day:</h3></Col>
              <Col span={2}></Col>
              <Col span={11}><h3>Average Heavy Traffic incident happened for the period of time for different day:</h3></Col>
              </Row>
              <Row>
              <Col span={11}><DemoColumn reportData = {sumdayht}/></Col>
              <Col span={2}></Col>
              <Col span={11}><DemoColumn reportData = {avedayht}/></Col>
              </Row>    
              </>
              )}
              {type === 'summary' && typereport==='ht'&& (
              <>
              <h2>The report is for Heavy Traffic the select period:</h2>
              <br></br>
              <h3>Average daily Heavy Traffic happend is: {avedailyht} </h3><br></br>
              <h3>Highest daily Heavy Traffic is heppend on {summaryht[0].type}: {summaryht[0].value} cases</h3><br></br>
              <h3>Highest average daily Heavy Traffic is happend at {summaryht[1].type}: {summaryht[1].value} cases</h3><br></br>
              <h3>Highest average daily Heavy Traffic is happend at {summaryht[2].type}:00 everyday: {summaryht[2].value} cases</h3><br></br>
              <h3>Highest average Heavy Traffic is happend is on {summaryht[3].type} every week: {summaryht[3].value} cases</h3><br></br>
              </>
              )}
        <Row>
        <Col span={20}></Col>
        <Col span={4}><h3>Last update: {lastupdate} </h3></Col>
        </Row>
       </Card>

      </PageHeaderWrapper>
      
  
    );
  };
  
  export default reporting;