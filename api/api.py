import time
import requests
import os
import json
import utils
from math import dist
from flask import Flask
from flask import request
from dotenv import load_dotenv
from preWeather import getWeatherfromAPI,predictionforAcc,loadModel,timesplit
from preRealTime import loadModelF, nextXhour, possibility


load_dotenv()
app = Flask(__name__)

@app.route('/test')
def get_current_time():
    return {
        'time': time.time(),
        'data': "this is test ~"
        }

#get all accident data, the data here retuen includes accidents and incidents
@app.route('/apis/getAccidentData')
def getIncidentData():
    
    datamall_key = os.environ.get('DATAMALL_KEY')
    data_api = os.environ.get('GET_INCIDENT_API')

    HEADERS = {'AccountKey':datamall_key,}

    data = None
    try:
        response=requests.get(data_api, headers=HEADERS)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    else:
        data = response.json()
    return data

#get acccident data only
@app.route('/apis/incidentShow')
def incidentShow():
    
    data = getIncidentData()
    i = len(data["value"])-1
    while i>=0:
        if data["value"][i]["Type"] != 'Accident':
            del data["value"][i]
        i=i-1
    return data 

@app.route('/apis/roadWorkAdv')
def roadWorkAdv():
    data = getIncidentData()
    i = len(data["value"])-1
    while i>=0:
        if data["value"][i]["Type"] != 'Roadwork':
            del data["value"][i]
        i=i-1   
    leftlane=[]
    rightlane=[]
    for j in data["value"]:
        
        advice=j["Message"].split(". ")
        
        if len(advice)==2:     
            if advice[1] == "Avoid left lane.":
                leftlane.append(j)
            elif advice[1] == "Avoid right lane.":
                rightlane.append(j)         
    return  {"left":leftlane,"right":rightlane}

@app.route('/apis/prediction')
def prediction():
    accidentlist=incidentShow()["value"]
    resultList=[]
    if len(accidentlist)==0:
        resultList=[{"id":None,"accMsg":None,"accInfo":"Currently no Accident, this is test data."}]
        accidentlist=[{
            "Type": "Accident",
            "Latitude": 1.2780135743523675,
            "Longitude": 103.82390919555351,
            "Message": "(5/7)23:50 Accident on AYE (towards Tuas) at Lower Delta Rd Exit."
        }]
        
    count=1
    for accident in accidentlist:
        modelSe, modelDur,modelDis=loadModel()
        time=timesplit(accident).strftime('%Y-%m-%dT%H:%M:%S')
        temp=getAirTemp(time,accident)
        weatherCondition=get2HourWeatherCon(time,accident)
        windDirection=getWindDirection(time,accident)  
        humidity=gethumidity(time,accident)
        weather=getWeatherfromAPI(humidity,temp,weatherCondition,windDirection)
        #print(weather)
        resultInfor="Prediction-: "+predictionforAcc(modelSe, modelDur,modelDis,weather,accident)
        accInfo="Accident-: "+ accident["Message"].split(".")[0]
        result={"id":count,"accMsg":accInfo,"accInfo":resultInfor}
        resultList.append(result)
    return {"Result":resultList}

@app.route('/apis/timeCount')
def timeCountAcc():
    accidentlist=incidentShow()["value"]
    accHourDir={"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,
             "16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}
    for accident in accidentlist:
        hour=str(timesplit(accident).strftime("%H"))
        for i in accHourDir.keys():
            if hour==i:
                accHourDir[hour]=accHourDir[hour]+1
    return accHourDir
          
@app.route('/apis/timeCount')
def timeCountinc():
    iccidentlist=getIncidentData()["value"]   
    incHourDir={"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,
             "16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}
    for incident in iccidentlist:
        hour=str(timesplit(incident).strftime("%H"))
        for i in incHourDir.keys():
            if hour==i:
                incHourDir[hour]=incHourDir[hour]+1
    return incHourDir

@app.route("/apis/get2HourWeatherPred", methods=["GET", "POST"])
def get2HourWeatherPred():
    data_api = os.environ.get('WEATHER_FORECAST_2H_API')
    request_datetime = request.data.decode('UTF-8') #eg. 2022-06-18T08:13:21
    params={"date_time":request_datetime}

    data = None
    try:
        response=requests.get(data_api, params=params)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    else:
        reponse_data = response.json()
        
        if reponse_data['api_info']['status'] == "healthy":
            data = utils.processWeatherData(reponse_data)

    return data

@app.route("/apis/get2HourWeatherCon", methods=["GET", "POST"])
def get2HourWeatherCon(request_datetime,accident):
    data_api_c = os.environ.get('WEATHER_FORECAST_2H_API')
    #request_datetime = request.data.decode('UTF-8') #eg. 2022-06-18T08:13:21
    params={"date_time":request_datetime}

    data = None
    try:
        response=requests.get(data_api_c, params=params)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    else:
        reponse_data = response.json()
        
        if reponse_data['api_info']['status'] == "healthy":
            data = utils.processWeatherData(reponse_data)

    point1 = (accident["Latitude"],accident["Longitude"])
    smallDis=10
    WeatherConditionS=''
    for area in data['data']:
        print(area)
        point2= (area['location']['latitude'],area['location']['longitude'])
        dis_math = dist(point1,point2)
        
        if smallDis>dis_math:
           smallDis=dis_math
           WeatherConditionS=area["forecast"]   
    print(WeatherConditionS)
    return WeatherConditionS

@app.route('/apis/getAirTemp', methods=["GET","POST"])
def getAirTemp(request_datetime,accident):
    data_api = os.environ.get('AIR_TEMP_API')
    #request_datetime = request.data.decode('UTF-8') #eg. 2022-06-18T08:13:21
    params={"date_time":request_datetime}
    data = None
    try:
        response=requests.get(data_api, params=params)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    else:
        reponse_data = response.json()
        
        if reponse_data['api_info']['status'] == "healthy":
            data = utils.processTempData(reponse_data)
    
    point1 = (accident["Latitude"],accident["Longitude"])
    smallDis=10
    temp=0 
    for area in data['data']:
        point2= (area['location']['latitude'],area['location']['longitude'])
        dis_math = dist(point1,point2)
        
        if smallDis>dis_math:
           smallDis=dis_math
           temp=area["temp"] 
    return temp

@app.route('/apis/getWindDirection', methods=["GET","POST"])
def getWindDirection(request_datetime,accident):
    data_api = os.environ.get('WIND_DIRECTION_API')
    #request_datetime = request.data.decode('UTF-8') #eg. 2022-06-18T08:13:21
    params={"date_time":request_datetime}
    data = None
    try:
        response=requests.get(data_api, params=params)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    else:
        reponse_data = response.json()
        
        if reponse_data['api_info']['status'] == "healthy":
            data = utils.processWindDirData(reponse_data)
    
    point1 = (accident["Latitude"],accident["Longitude"])
    smallDis=10
    windDirection=0 
    for area in data['data']:
        point2= (area['location']['latitude'],area['location']['longitude'])
        dis_math = dist(point1,point2)
        
        if smallDis>dis_math:
           smallDis=dis_math
           windDirection=area["direction"] 
    return windDirection

@app.route('/apis/gethumidity', methods=["GET","POST"])
def gethumidity(request_datetime,accident):
    data_api = os.environ.get('HUMIDITY_API')
    #request_datetime = request.data.decode('UTF-8') #eg. 2022-06-18T08:13:21
    params={"date_time":request_datetime}
    data = None
    try:
        response=requests.get(data_api, params=params)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    else:
        reponse_data = response.json()
        
        if reponse_data['api_info']['status'] == "healthy":
            data = utils.processHumidityData(reponse_data)
    
    point1 = (accident["Latitude"],accident["Longitude"])
    smallDis=10
    humidity=0 
    for area in data['data']:
        point2= (area['location']['latitude'],area['location']['longitude'])
        dis_math = dist(point1,point2)
        
        if smallDis>dis_math:
           smallDis=dis_math
           humidity=area["humidity"] 
           
    return humidity

@app.route('/apis/getWindSpeed', methods=['POST'])
def getWindSpeed():
    data_api = os.environ.get('WIND_SPEED_API')

    request_datetime = request.data.decode('UTF-8') #eg. 2022-06-18T08:13:21
    params={"date_time":request_datetime}

    data= None
    try:
        response=requests.get(data_api, params=params)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    else:
        reponse_data = response.json()
        
        if reponse_data['api_info']['status'] == "healthy":
            data = utils.processWindData(reponse_data)

    return data

@app.route('/apis/forcasting', methods=["GET","POST"])
def forcasting():
    hour = int(request.data.decode('UTF-8'))
    print(hour)
    modelAcc =loadModelF()
    forcastingResult=nextXhour(modelAcc,hour)
    data=possibility(forcastingResult)
    print(data)
    return {"data":data}

if __name__ == '__main__':
    app.run(debug=True)