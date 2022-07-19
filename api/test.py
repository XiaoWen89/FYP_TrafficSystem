import time
import requests
import os
import json
import utils
from flask import Flask
#from flask import request
from dotenv import load_dotenv
from preWeather import getWeatherfromAPI,predictionforAcc,loadModel,timesplit
from preRealTime import getAreaPre

load_dotenv()

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

def incidentShow():
    '''
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
    '''
    data = getIncidentData()
    i = len(data["value"])-1
    while i>=0:
        if data["value"][i]["Type"] != 'Accident':
            del data["value"][i]
        i=i-1
    return data

def prediction():
    accidentlist=incidentShow()["value"]
    resultList=[]
    for accident in accidentlist:
        modelSe, modelDur,modelDis=loadModel()
        weather=getWeatherfromAPI()
        result=predictionforAcc(modelSe, modelDur,modelDis,weather,accident) 
        resultList.append(result)
    return {"Result":resultList}

def roadWork():
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
          
def getAirTemp():
    data_api = os.environ.get('AIR_TEMP_API')

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
            data = utils.processTempData(reponse_data)
    temp=0
    for i in data["items"]["readings"]:
        if i["value"]>0:
           temp=temp+i["value"]
    temp=temp/3
    print(data)
    return temp

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

#data = getIncidentData()
#print(data)
#incidentShow(data)
#print(incidentShow())
#print(prediction())
#lane=roadWork()
#print(lane)

#print(timeCountAcc())
#temp=getAirTemp()
#print(temp)
hour=get2HourWeatherPred()
print(hour)