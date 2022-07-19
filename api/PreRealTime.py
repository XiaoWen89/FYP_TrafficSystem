import pymongo
import pandas as pd
import requests
import os
import utils

from pymongo import MongoClient
from math import dist
import datetime
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.tree import DecisionTreeClassifier
from sklearn import metrics
from sklearn.metrics import classification_report

from sklearn.datasets import make_classification
from sklearn import tree
from sklearn.model_selection import train_test_split

from joblib import dump, load

from dotenv import load_dotenv

client = MongoClient()
client = MongoClient('172.16.10.129',27017)

db = client.data
collection = db.area_geo_loc
collectionData = db.accident_data
##https://pymongo.readthedocs.io/en/stable/tutorial.html

accident={
            "Type": "Roadwork",
            "Latitude": 1.2780135743523675,
            "Longitude": 103.82390919555351,
            "Message": "(19/6)00:56 Roadworks on AYE (towards Tuas) at Lower Delta Rd Exit."
        }

load_dotenv()
def getAreaPre(accident):
    point1 = (accident["Latitude"],accident["Longitude"])
    data = collection.find()
    smallDis=10
    location=''
    for area in data:
     
        point2= (area["label_location"]['latitude'],area["label_location"]['longitude'])
        dis_math = dist(point1,point2)
       
        if smallDis>dis_math:
           smallDis=dis_math
           location=area["name"]
    
    return location

def getAllArea():
    areaList=[]
    data=collection.find()
    for area in data:
        areaList.append(area["name"])
    
    return areaList
    
    
def loadDataFromDB(typeOfincident):
    data=collectionData.find({"Type":typeOfincident})
    df = pd.DataFrame(list(data))
    
    df.drop(['_id'], axis= 1, inplace= True)
    df.drop_duplicates(subset="Message",inplace = True,ignore_index=True)
    #df.to_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\accidentdata0707.csv", index=False)
    return df

def getWeatherCon(request_datetime):
    data_api = os.environ.get('WEATHER_FORECAST_2H_API')
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
            data = utils.processWeatherData(reponse_data)

    return data

def dataForForcasting(typeOfincident):
    df = loadDataFromDB(typeOfincident)
    df.drop(columns=['Type','Latitude','Longitude','weather_forecast'], axis= 1, inplace= True)
    
    df["datetime"]=pd.to_datetime(df['datetime_ios'])
    #df["datetime"] = datetime.datetime.strptime(df['datetime_ios'], format)
    df["hour"]=df["datetime"].dt.hour
    #df.set_index('datetime', inplace=True)
    
    areaList=getAllArea()
    
    startDateTime=datetime.datetime(2022,7,6,0,0,0)
    
    currentDateTime=startDateTime
    dfForforcast1=[{"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Fair","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Cloudy","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Rain","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Sunny","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"unknown","hour":None,"Accident":None,"count":None}]
    dfForforcast2=[{"dateTime":None,"day":None,"big_area":None,"weather_forecast_type":"Fair","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"big_area":None,"weather_forecast_type":"Cloudy","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"big_area":None,"weather_forecast_type":"Rain","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"big_area":None,"weather_forecast_type":"Sunny","hour":None,"Accident":None,"count":None},
                    {"dateTime":None,"day":None,"big_area":None,"weather_forecast_type":"unknown","hour":None,"Accident":None,"count":None}]
    while currentDateTime<= datetime.datetime.now():
          print(currentDateTime)
          todaydf=df[df.datetime.dt.date==currentDateTime.date()]
          #print(todaydf)
          
          for i in range(0,24):
              #print(i)
              currentDatetimeStr = currentDateTime.strftime('%Y-%m-%dT%H:%M:%S')
              #print(currentDatetimeStr)
              weatherCon=getWeatherCon(currentDatetimeStr)
              #print(currentDatetime)
              for j in range(0,len(areaList)):
                 areaName=areaList[j]
                 currentLocTimedf=todaydf[(todaydf.hour==i)&(todaydf.small_area==areaName)]
                 length=len(currentLocTimedf.axes[0])
                 if length>1:
                    currentLocTime={"dateTime":currentDateTime,"day":currentDateTime.weekday(),"small_area":areaName,"weather_forecast_type":currentLocTimedf["weather_forecast_type"].loc[currentLocTimedf.index[0]],"hour":i,"Accident":"H","count":length} 
                 elif length==1:
                     currentLocTime={"dateTime":currentDateTime,"day":currentDateTime.weekday(),"small_area":areaName,"weather_forecast_type":currentLocTimedf["weather_forecast_type"].loc[currentLocTimedf.index[0]],"hour":i,"Accident":"M","count":length} 
                 else:
                     if "Fair" in weatherCon["data"][j]["forecast"]:
                         weaCon="Fair"
                     elif "Cloudy" in weatherCon["data"][j]["forecast"]:
                         weaCon="Cloudy"
                     elif "Rain" or "Showers" in weatherCon["data"][j]["forecast"]:
                         weaCon="Rain"
                     elif "Sunny" in weatherCon["data"][j]["forecast"]:
                         weaCon="Sunny"
                     else:
                         weaCon="unknown"
                
                         
                     currentLocTime={"dateTime":currentDateTime,"day":currentDateTime.weekday(),"small_area":areaName,"weather_forecast_type":weaCon,"hour":i,"Accident":"L","count":0}
                 dfForforcast1.append(currentLocTime)
          
              currentDateTime=currentDateTime+datetime.timedelta(minutes=60)
          
          processeddata=pd.DataFrame(dfForforcast1)
          
    return processeddata

def oneHot(df):
    onehot_df_sA = pd.get_dummies(df['small_area'], prefix='sA')
    onehot_df_wF = pd.get_dummies(df['weather_forecast_type'], prefix='wF')
    #onehot_df_lC = pd.get_dummies(df['small_area'], prefix='lC')
    df_Other1=df.iloc[:,1:2]
    df_Other2=df.iloc[:,4:6]
    df = pd.concat([onehot_df_sA,onehot_df_wF,df_Other1,df_Other2], axis=1)
    df=df.iloc[5:, :]
    print(df)
    return df

def dataSplitForecast(df):
    #df=pd.read_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\processeddata0707.csv")
    
    df=oneHot(df)
    print(df.shape)
    
    X = df.iloc[: , 0:54]
    Y = df.iloc[: , 54:55]
    
    sss = StratifiedShuffleSplit(n_splits=10, test_size=0.2, random_state=42)
    sss.get_n_splits(X,Y)
    
    for train_index, test_index in sss.split(X, Y):
        x_train, x_test = X.iloc[train_index], X.iloc[test_index]
        y_train, y_test = Y.iloc[train_index], Y.iloc[test_index]
    
    #print(x_train)
    #print(y_train)
    #print(x_train.shape , x_test.shape)
    #print(y_train.shape , y_test.shape)
    
    
    return x_train,y_train, x_test, y_test



def DT(x_train,y_train, x_test, y_test):
    
    #df=pd.read_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\processeddata0707.csv")
    #print(df.shape)
    
           
    print("DT")
    dt=DecisionTreeClassifier()
    dt=dt.fit(x_train, y_train)
    
    y_pred = dt.predict(x_test)
    
    scoreTesting = metrics.accuracy_score(y_test, y_pred)
    print("Score for Testing:", scoreTesting)
    report = classification_report(y_test, y_pred)
    
    # check for overfitting
    # using X_train to do predict and compare with X_test result
    y_pred = dt.predict(x_train)
    scoreTraining= metrics.accuracy_score(y_train, y_pred)
    print("Score for Training:",scoreTraining)

    return dt

def saveModel(modle,modelname):
    dump(modle,modelname)
    return None

def loadModelF():
    modelAcc = load(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\modelAcc.joblib')
    
    return modelAcc

def accidentData():
    a=r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\processedAccdata0712.csv"
    return a

def nextHour(minute,modelInc):
    
    forcastingTime=datetime.datetime.now()+datetime.timedelta(minutes=minute)
    areaList=getAllArea()
    forcastingDatetimeStr = forcastingTime.strftime('%Y-%m-%dT%H:%M:%S')
    #print(currentDatetimeStr)
    weatherCon=getWeatherCon(forcastingDatetimeStr)
    #print(areaList)
    forcastingList=[{"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Fair","hour":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Cloudy","hour":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Rain","hour":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"Sunny","hour":None},
                    {"dateTime":None,"day":None,"small_area":None,"weather_forecast_type":"unknown","hour":None}]
    for j in range(0,len(areaList)):
        areaName=areaList[j]
        if "Fair" in weatherCon["data"][j]["forecast"]:
                weaCon="Fair"
        elif "Cloudy" in weatherCon["data"][j]["forecast"]:
                weaCon="Cloudy"
        elif "Rain" or "Showers" in weatherCon["data"][j]["forecast"]:
                weaCon="Rain"
        elif "Sunny" in weatherCon["data"][j]["forecast"]:
                weaCon="Sunny"
        else:
                weaCon="unknown"
                
        forcastingData={"dateTime":forcastingTime,"day":forcastingTime.weekday(),"small_area":areaName,"weather_forecast_type":weaCon,"hour":forcastingTime.hour}
        forcastingList.append(forcastingData)
    
    processedforcastingdata=pd.DataFrame(forcastingList)
    resultforcastingdata=forcastingList[5:52]
    #print(processedforcastingdata)
    #print(resultforcastingdata)
    
    onehot_df_sA = pd.get_dummies(processedforcastingdata['small_area'], prefix='sA')
    onehot_df_wF = pd.get_dummies(processedforcastingdata['weather_forecast_type'], prefix='wF')
    
    df_Other1=processedforcastingdata.iloc[:,1:2]
    df_Other2=processedforcastingdata.iloc[:,4:6]
    df = pd.concat([onehot_df_sA,onehot_df_wF,df_Other1,df_Other2], axis=1)
    df=df.iloc[5: , :]
    #print(df)
    y_pred=modelInc.predict(df)
    #print(y_pred)
    #y_preddf = pd.DataFrame(y_pred, columns = ['Result'])
   
    #resultdf = pd.concat([resultforcastingdata,y_preddf], axis=1)
    
    #print(resultdf)
    
    
    return y_pred,resultforcastingdata

def possibilityofLow(resultforcastingdata,df):
    possibilityofLowlist=[]
    for i in range(0,len(resultforcastingdata)):
        currentLocTimedf=df[(df.hour==resultforcastingdata[i]["hour"])&(df.small_area==resultforcastingdata[i]["small_area"])&(df.day==resultforcastingdata[i]["day"])&(df.day==resultforcastingdata[i]["weather_forecast_type"])]
        numberOfI=sum(df['Accident'] == 1)
        if len(currentLocTimedf)==0:
            possibilityofLow=0
        else:
            possibilityofLow=numberOfI/len(currentLocTimedf)
        possibilityofLowlist.append(possibilityofLow)
    return possibilityofLowlist

def nextXhour(modelInc,xhour):
    file=accidentData()
    df=pd.read_csv(file)
    areaList=getAllArea()
    forcastingResult=[]
    
    for i in range(0,len(areaList)):
        
        forcastingResult.append({"name":areaList[i],"result":[],"possibleOfLow":[]})
    #print(forcastingResult)
    
    for j in range(1,xhour+1):
        
        minutes=60*j
        #print(minutes)
        forcastingResultCurrentHour,resultforcastingdata=nextHour(minutes,modelInc)
        possibilityofLowlist=possibilityofLow(resultforcastingdata,df)
        
        for k in range(0,len(forcastingResult)):
            forcastingResult[k]["result"].append(forcastingResultCurrentHour[k])
            forcastingResult[k]["possibleOfLow"].append(possibilityofLowlist[k])
    #print("forcastingResult",forcastingResult)
    
    return forcastingResult



def possibility(forcastingResult):
    forcastingResultPoss=[]
    location=getWeatherCon(datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))
    #print(location)
    for i in range(0,len(forcastingResult)):
        forcastingResultAdv=''''''
        possTotal=0
        for j in range(0,len(forcastingResult[i]["result"])):
            if forcastingResult[i]["result"][j]=="L":
                poss=forcastingResult[i]["possibleOfLow"][j]
            elif forcastingResult[i]["result"][j]=="M":
                poss=50
                forcastingResultAdv=forcastingResultAdv+'/*       ;' +str(j)+" to "+str(j+1) +" hour later */"
            elif forcastingResult[i]["result"][j]=="H":
                poss=100
                forcastingResultAdv=forcastingResultAdv+"        ;"+str(j)+" to "+str(j+1) +" hour,"
            possTotal=possTotal+poss
        possibility=possTotal/len(forcastingResult[i]["result"])/100
        if (possibility!=0):
           forcastingResultAdv="   "+forcastingResult[i]["name"]+": ;      Please avoid travell to here:" + forcastingResultAdv 
        forcastingResultPoss.append({"name":forcastingResult[i]["name"],"latitude":location["data"][i]["location"]["latitude"],"longitude":location["data"][i]["location"]["longitude"],"result":str(round(possibility*100,1))+"%", "advice":forcastingResultAdv})    
    for i in forcastingResultPoss:
        print(i)
    return forcastingResultPoss



#print("start")
#processeddata1=dataForForcasting("Accident")
#processeddata1.to_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\processedAccdata0712.csv", index=False)
#processeddata2=dataForForcasting("Heavy Traffic")
#processeddata2.to_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\processedHTdata0712.csv", index=False)

#df=pd.read_csv(a)
#df=pd.read_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\processedAccdata0712.csv")
#x_train,y_train, x_test, y_test = dataSplitForecast(df)
#modelAcc=DT(x_train,y_train, x_test, y_test)

#saveModel(modelAcc,"api\modelAcc.joblib")
#modelAcc =loadModelF()
#forcastingResult=nextXhour(modelAcc,4)
#possibility(forcastingResult)