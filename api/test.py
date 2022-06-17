import requests
import os
import json
from dotenv import load_dotenv
from preWeather import getWeatherfromAPI,predictionforAcc,loadModel

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
    modelSe, modelDur,modelDis=loadModel()
    accident=getWeatherfromAPI()
    result=predictionforAcc(modelSe, modelDur,modelDis,accident)
   
    return {"Result":result}


#data = getIncidentData()
#print(data)
#incidentShow(data)
#print(incidentShow())
print(prediction())