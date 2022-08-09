from datetime import datetime
import time
import requests
import os
import json
import utils
import tools
import mongo as mg
from math import dist
from flask import Flask
from flask import request, jsonify
from dotenv import load_dotenv
from preWeather import getWeatherfromAPI,predictionforAcc,loadModel,timesplit
from preRealTime import loadModelFAcc,loadModelFHT, nextXhour, possibility,reportAdmin, laccidentData, lheavyTrafficData,readFile,reportSummary,update,lastupdet


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
    dataLength = len(accidentlist)
    
    if len(accidentlist)==0:
        #resultList=[{"id":None,"accMsg":None,"accInfo":"Currently no Accident, this is test data."}]
        
        accidentlist=[{
            "Type": "Accident",
            "Latitude": 1.2780135743523675,
            "Longitude": 103.82390919555351,
            "Message": "(6/8)12:00 Accident on AYE (towards Tuas) at Lower Delta Rd Exit."
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
        resultInfor=predictionforAcc(modelSe, modelDur,modelDis,weather,accident)
        if (dataLength==0):
            accInfo="Test Display-: "+ accident["Message"].split(".")[0]
        else:
            accInfo="Accident-: "+ accident["Message"].split(".")[0]
        result={"id":count,"accMsg":accInfo,"accInfo":resultInfor}
        resultList.append(result)
        count=count+1
    return {"Result":resultList,"dataLength":dataLength}

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
    #print(WeatherConditionS)
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
    Accidentfile = laccidentData()
    HeavyTrafficfile= lheavyTrafficData()
    modelAcc =loadModelFAcc()
    modelHT =loadModelFHT()
    forcastingResultAcc=nextXhour(modelAcc,hour,Accidentfile)
    dataAcc=possibility(forcastingResultAcc)
    forcastingResultHT=nextXhour(modelHT,hour,HeavyTrafficfile)
    dataHT=possibility(forcastingResultHT)
    #print(dataAcc)
    #print(dataHT)
    return {"dataAcc":dataAcc, "dataHT":dataHT}

@app.route('/apis/reporting', methods=["GET","POST"])
def reportingAdmin():
    #print(request.data)
    data=json.loads(request.data)
    startDateCur = data['start_date']
    endDateCur = data['end_date']
    file = laccidentData()
    accData = readFile(file)
    file = lheavyTrafficData()
    htData = readFile(file)
    report1 = reportAdmin(startDateCur,endDateCur,accData)
    reportSummary1 = reportSummary(report1)
    report2 = reportAdmin(startDateCur,endDateCur,htData)
    reportSummary2 = reportSummary(report2)
    return {"acc":report1, "ht":report2,"accr":reportSummary1,"htr":reportSummary2}

@app.route('/apis/lastUpdate', methods=["GET","POST"])
def lastUpdate():
    strDate = lastupdet()
    print(strDate)
    return {"update":strDate}

@app.route('/apis/updateData', methods=["GET","POST"])
def updateData():
    a=update()
    return {"update":a}

@app.route('/apis/user/registration', methods=["POST"])
def userRegistration():
    data = json.loads(request.data.decode('UTF-8'))
    response = {}
    if data is None or data == {}:
        response['code'] = "-1"
        response['message'] = "It seem the data is None or empty, please check...."

        return jsonify(response)
    
    print("Pass in data is {}".format(str(data)))
    username = data['username']
    password = data['password']
    confirm = data['confirm']

    #check whether account already exists
    check_result = mg.checkUserExisting(username)

    if check_result == "0":
        response['code']="-2"
        response['message']="The account username has been registered, please check ...."

        return jsonify(response)
    
    hashed = tools.hash(password)

    user_object = {
        "username": username,
        "hashed": hashed,
        "access": "User"
    }

    #create user in mongo
    create_result = mg.createNewUser(user_object)

    if not create_result:
        response['code'] = "-3"
        response['message']="The user creation is not successful, please check ...."

        return jsonify(response)

    response['code']="0"
    response['message']="User registration is successful~"
    response['data']=create_result

    return jsonify(response)


@app.route('/apis/user/login', methods=['POST'])
def login():
    data = json.loads(request.data.decode('UTF-8'))
    response = {}
    if data is None or data == {}:
        response['code'] = "-1"
        response['message'] = "It seem the data is None or empty, please check...."

        return jsonify(response)

    print("Pass in data is {}".format(str(data)))
    username = data['username']
    password = data['password']

    hashed = tools.hash(password)

    result = mg.findUser(username, hashed)
    print(username)
    print(hashed)

    if result:
        response['code'] = "0"
        response['message'] = "Login successful!"
        response['data'] = {}
        response['data']['username'] = result['username']
        response['data']['access'] = result['access']

        return jsonify(response)
    else:
        response['code'] = "-1"
        response['message'] = "Login failed！"

        return jsonify(response)



if __name__ == '__main__':
    app.run(debug=True)