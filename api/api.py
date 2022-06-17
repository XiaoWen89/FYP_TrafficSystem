import time
import requests
import os
import json
from flask import Flask
from dotenv import load_dotenv
from preWeather import getWeatherfromAPI,predictionforAcc,loadModel


load_dotenv()
app = Flask(__name__)

@app.route('/test')
def get_current_time():
    return {
        'time': time.time(),
        'data': "this is test ~"
        }

#get all accident data
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

#get incident data only
@app.route('/apis/incidentShow')
def incidentShow():
    
    data = getIncidentData()
    i = len(data["value"])-1
    while i>=0:
        if data["value"][i]["Type"] != 'Accident':
            del data["value"][i]
        i=i-1
    return data 

@app.route('/apis/roadWork')
def roadWork():
    
    data = getIncidentData()
    i = len(data["value"])-1
    while i>=0:
        if data["value"][i]["Type"] != 'RoadWork':
            del data["value"][i]
        i=i-1
    return data 

@app.route('/apis/prediction')
def prediction():
    modelSe, modelDur,modelDis=loadModel()
    accident=getWeatherfromAPI()
    result=predictionforAcc(modelSe, modelDur,modelDis,accident)  
    return {"Result":result}


if __name__ == '__main__':
    app.run(debug=True)