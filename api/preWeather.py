from distutils.log import info
import numpy as np
import pandas as pd
import seaborn as sns
import datetime
import matplotlib.pyplot as plt
from seaborn import displot

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, StratifiedShuffleSplit,GridSearchCV
from sklearn.base import BaseEstimator

from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn import metrics
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report

from joblib import dump, load



def preprocess():
    
    #Load data
    ad = pd.read_csv(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\accident_NY.csv')
    
    #Data Preprocessing
    
    #1) Drop irrelevant columns
    data_preprocessed_ad = ad.drop(columns=['ID','Start_Lat','End_Lat','Start_Lng','End_Lng','Street','City','County', 'Country','State','Zipcode','Timezone','Airport_Code','Number','Weather_Timestamp'])
    
    #Change data type
    data_preprocessed_ad['Start_Time'] = pd.to_datetime(data_preprocessed_ad['Start_Time'],errors='coerce')
    data_preprocessed_ad['End_Time'] = pd.to_datetime(data_preprocessed_ad['End_Time'],errors='coerce')
    
    #2) Drop the column with Missing Value(>40%)
    data_preprocessed_ad.replace("", float("NaN"), inplace=True)
    data_preprocessed_ad.replace(" ", float("NaN"), inplace=True)
    
    # Count missing value(NaN, na, null, None) of each columns, Then transform the result to a pandas dataframe. 
    count_missing_value = data_preprocessed_ad.isna().sum() / data_preprocessed_ad.shape[0] * 100
    count_missing_value_df = pd.DataFrame(count_missing_value.sort_values(ascending=False), columns=['Missing%'])
    missing_value_df = count_missing_value_df[count_missing_value_df['Missing%'] > 0]
    missing_value_40_df = count_missing_value_df[count_missing_value_df['Missing%'] > 40]
    data_preprocessed_ad.drop(missing_value_40_df.index, axis=1, inplace=True)
    #print(missing_value_df)
    #print(missing_value_40_df)
    
    #3)Replace other missing value with mean value
    numerical_missing = ['Wind_Chill(F)','Wind_Speed(mph)', 'Visibility(mi)','Humidity(%)', 'Temperature(F)', 'Pressure(in)','Precipitation(in)']
    categorical_missing = ['Weather_Condition','Wind_Direction']
        
    # For numerical columns
    for column_name in numerical_missing:
        data_preprocessed_ad[column_name] = data_preprocessed_ad.groupby('Severity')[column_name].transform(lambda x:x.fillna(x.mean()))

    # For categorical columns(Majority value imputation)
    for column_name in categorical_missing:
        data_preprocessed_ad[column_name] = data_preprocessed_ad.groupby('Severity')[column_name].transform(lambda x:x.fillna(x.fillna(x.mode().iloc[0])))
    
    #print(data_preprocessed_ad.columns)
    # Drop NaN 
    adProcessed=data_preprocessed_ad.dropna()
    adProcessed.reset_index(drop=True, inplace=True)
    
        
    #3) Or Drop all the instance with NaN/NA/null
    #adProcessed = data_preprocessed_ad.dropna()
    #adProcessed.reset_index(drop=True, inplace=True)
    
    
    #4) Create new a features
    # Duration for accdient
    adProcessed['Duration'] = adProcessed.End_Time - adProcessed.Start_Time
    adProcessed['Duration'] = adProcessed['Duration'].apply(lambda x:round(x.total_seconds() / 60) )
    #drop the no reasonal Duration (Noisy-> Duration<=0)
    index_names1 = adProcessed[adProcessed['Duration'] <= 0 ].index
    index_names2 = adProcessed[adProcessed['Duration'] > 2000 ].index
    adProcessed.drop(index_names1, inplace = True)
    adProcessed.drop(index_names2, inplace = True)
    
    # Type of accdient
    adProcessed['Description_Acc'] = np.where(adProcessed['Description'].str.contains('- Accident', case=False, na = False), 1, 0)
    adProcessed['Description_Clo'] = np.where(adProcessed['Description'].str.contains('- Road closed', case=False, na = False), 1, 0)
    
    # Transform Month/week/Hour to different features
    adProcessed["Month"] = adProcessed["Start_Time"].dt.month
    adProcessed['Day'] = adProcessed["Start_Time"].dt.weekday
    adProcessed["Hour"] = adProcessed["Start_Time"].dt.hour
    
    # Transfer unit
    adProcessed["Temperature(C)"] = round((adProcessed["Temperature(F)"]-32)*5/9,2)
    adProcessed["Wind_Chill(C)"] = round((adProcessed["Wind_Chill(F)"]-32)*5/9,2)
    adProcessed["Visibility(km)"] = round(adProcessed["Visibility(mi)"]*1.61,2)
    adProcessed["Wind_Speed(knots)"] = round(adProcessed["Wind_Speed(mph)"]/1.15,2)
    adProcessed["Distance_km"] = round(adProcessed["Distance(mi)"]*1.61,2)
    
    # Drop the original features    
    #adProcessed=adProcessed.drop(columns=["Temperature(F)","Wind_Chill(F)","Visibility(mi)","Wind_Speed(mph)","Distance(mi)","Civil_Twilight", "Nautical_Twilight","Astronomical_Twilight"])
    adProcessed=adProcessed.drop(columns=["Temperature(F)","Wind_Chill(F)","Visibility(mi)","Wind_Speed(mph)","Distance(mi)","Civil_Twilight","Description", "Nautical_Twilight","Astronomical_Twilight"])   
    # print(adProcessed.shape)
    # Save the processed data
    adProcessed.to_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adProcessed.csv", index=False)

    return None

def analysisWeather():
    # Load the Data    
    ad = pd.read_csv(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adProcessed.csv')
    # relationship of weather with Severity
    f, axes = plt.subplots(5, 2, figsize=(20, 30))
    sns.histplot(ad['Temperature(C)'], ax=axes[0, 0]).set_title('Temperature(C) Distribution')
    ad["Severity"].groupby(pd.cut(ad['Temperature(C)'], 10)).mean().plot(ylabel='Mean Severity', title='Mean Severity of Temperature(C)', ax=axes[0, 1])
    
    sns.histplot(ad['Humidity(%)'], ax=axes[1, 0]).set_title('Humidity(%) Distribution')
    ad["Severity"].groupby(pd.cut(ad['Humidity(%)'], 10)).mean().plot(ylabel='Mean Severity', title='Mean Severity of Humidity(%)', ax=axes[1, 1])

    sns.histplot(ad['Pressure(in)'], ax=axes[2, 0]).set_title('Pressure(in) Distribution')
    ad["Severity"].groupby(pd.cut(ad['Pressure(in)'], 10)).mean().plot(ylabel='Mean Severity', title='Mean Severity of Pressure(in)', ax=axes[2, 1])

    sns.histplot(ad['Visibility(km)'], ax=axes[3, 0]).set_title('Visibility(km) Distribution')
    ad["Severity"].groupby(pd.cut(ad['Visibility(km)'], 10)).mean().plot(ylabel='Mean Severity', title='Mean Severity of Visibility(km)', ax=axes[3, 1])
    
    sns.histplot(ad['Wind_Speed(knots)'], ax=axes[4, 0]).set_title('Wind_Speed(knots) Distribution')
    ad["Severity"].groupby(pd.cut(ad['Wind_Speed(knots)'], 10)).mean().plot( ylabel='Mean Severity', title='Mean Severity of Wind_Speed(knots)', ax=axes[4, 1])
    
    plt.suptitle("Temperature, Humidity, Pressure, Visibility and Wind Speed - Distribution && Mean Severity", y=0.95, fontsize=20)
    
    plt.plot()
    plt.show()
    #plt.savefig("Weather_vs_Severity.png")
    return None

def analysisDuration():
     # Load the Data    
    ad = pd.read_csv(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adProcessed.csv')
    # relationship of weather with Duration
    f, axes = plt.subplots(5, 2, figsize=(20, 30))
    sns.histplot(ad['Temperature(C)'], ax=axes[0, 0]).set_title('Temperature(C) Distribution')
    ad["Duration"].groupby(pd.cut(ad['Temperature(C)'], 10)).mean().plot(ylabel='Mean Duration', title='Mean Duration of Temperature(C)', ax=axes[0, 1])
    
    sns.histplot(ad['Humidity(%)'], ax=axes[1, 0]).set_title('Humidity(%) Distribution')
    ad["Duration"].groupby(pd.cut(ad['Humidity(%)'], 10)).mean().plot(ylabel='Mean Duration', title='Mean Duration of Humidity(%)', ax=axes[1, 1])

    sns.histplot(ad['Pressure(in)'], ax=axes[2, 0]).set_title('Pressure(in) Distribution')
    ad["Duration"].groupby(pd.cut(ad['Pressure(in)'], 10)).mean().plot(ylabel='Mean Duration', title='Mean Duration of Pressure(in)', ax=axes[2, 1])

    sns.histplot(ad['Visibility(km)'], ax=axes[3, 0]).set_title('Visibility(km) Distribution')
    ad["Duration"].groupby(pd.cut(ad['Visibility(km)'], 10)).mean().plot(ylabel='Mean Duration', title='Mean Duration of Visibility(mi)', ax=axes[3, 1])
    
    sns.histplot(ad['Wind_Speed(knots)'], ax=axes[4, 0]).set_title('Wind_Speed(knots) Distribution')
    ad["Duration"].groupby(pd.cut(ad['Wind_Speed(knots)'], 10)).mean().plot( ylabel='Mean Duration', title='Mean Duration of Wind_Speed(knots)', ax=axes[4, 1])
    
    plt.suptitle("Temperature, Humidity, Pressure, Visibility and Wind Speed - Distribution && Mean Duration", y=0.95, fontsize=20)
    
    f=plt.plot()
    #plt.show()
    return None



def analysisDistance():
     # Load the Data    
    ad = pd.read_csv(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adProcessed.csv')
    # relationship of weather with Duration
    f, axes = plt.subplots(5, 2, figsize=(20, 30))
    sns.histplot(ad['Temperature(C)'], ax=axes[0, 0]).set_title('Temperature(C) Distribution')
    ad["Distance_km"].groupby(pd.cut(ad['Temperature(C)'], 10)).mean().plot(ylabel='Mean Distance', title='Mean Distance of Temperature(C)', ax=axes[0, 1])
    
    sns.histplot(ad['Humidity(%)'], ax=axes[1, 0]).set_title('Humidity(%) Distribution')
    ad["Distance_km"].groupby(pd.cut(ad['Humidity(%)'], 10)).mean().plot(ylabel='Mean Distance', title='Mean Distance of Humidity(%)', ax=axes[1, 1])

    sns.histplot(ad['Pressure(in)'], ax=axes[2, 0]).set_title('Pressure(in) Distribution')
    ad["Distance_km"].groupby(pd.cut(ad['Pressure(in)'], 10)).mean().plot(ylabel='Mean Distance', title='Mean Distance of Pressure(in)', ax=axes[2, 1])

    sns.histplot(ad['Visibility(km)'], ax=axes[3, 0]).set_title('Visibility(km) Distribution')
    ad["Distance_km"].groupby(pd.cut(ad['Visibility(km)'], 10)).mean().plot(ylabel='Mean Distance', title='Mean Distance of Visibility(mi)', ax=axes[3, 1])
    
    sns.histplot(ad['Wind_Speed(knots)'], ax=axes[4, 0]).set_title('Wind_Speed(m/s) Distribution')
    ad["Distance_km"].groupby(pd.cut(ad['Wind_Speed(knots)'], 10)).mean().plot( ylabel='Mean Distance', title='Mean Distance of Wind_Speed(knots)', ax=axes[4, 1])
    
    plt.suptitle("Temperature, Humidity, Pressure, Visibility and Wind Speed - Distribution && Mean Distance", y=0.95, fontsize=20)
    
    f=plt.plot()
    plt.show()
    return None
    
def ecoding():
    
    # Load the Data    
    ad = pd.read_csv(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adProcessed.csv')
        
    # One Hot Encoding    
    # Weather_Condition Categorizing
    #print(ad['Weather_Condition'].value_counts())
    index_names1 = ad[ad['Weather_Condition'] =='Light Snow'].index
    index_names2 = ad[ad['Weather_Condition'] =='Snow'].index
    ad.drop(index_names1, inplace = True)
    ad.drop(index_names2, inplace = True)
    #print(ad['Weather_Condition'].value_counts())
    # Fair, Cloudy, Clear, Overcast, Haze, Rain
    ad['Weather_Fair'] = np.where(ad['Weather_Condition'].str.contains('Fair', case=False, na = False), 1, 0)
    ad['Weather_Clear'] = np.where(ad['Weather_Condition'].str.contains('Clear', case=False, na = False), 1, 0)
    ad['Weather_Cloudy'] = np.where(ad['Weather_Condition'].str.contains('Cloud', case=False, na = False), 1, 0)
    ad['Weather_Overcast'] = np.where(ad['Weather_Condition'].str.contains('Overcast', case=False, na = False), 1, 0)
    ad['Weather_Haze'] = np.where(ad['Weather_Condition'].str.contains('Fog|Haze', case=False, na = False), 1, 0)
    ad['Weather_Rain'] = np.where(ad['Weather_Condition'].str.contains('Rain', case=False, na = False), 1, 0)
    '''
    ad['Weather_Thunderstorm'] = np.where(ad['Weather_Condition'].str.contains('Thunderstorms|T-Storm', case=False, na = False), 1, 0)
    ad['Weather_Windy'] = np.where(ad['Weather_Condition'].str.contains('Windy|Squalls', case=False, na = False), 1, 0)
    ad['Weather_Hail'] = np.where(ad['Weather_Condition'].str.contains('Hail|Ice Pellets', case=False, na = False), 1, 0)
    ad['Weather_Thunder'] = np.where(ad['Weather_Condition'].str.contains('Thunder', case=False, na = False), 1, 0)
    ad['Weather_Dust'] = np.where(ad['Weather_Condition'].str.contains('Dust', case=False, na = False), 1, 0)
    ad['Weather_Tornado'] = np.where(ad['Weather_Condition'].str.contains('Tornado', case=False, na = False), 1, 0)
    '''
    #print(ad['Wind_Direction'].value_counts())
    # Wind_Direction Categorizing
    ad.loc[ad['Wind_Direction'].str.startswith('C'), 'Wind_Direction'] = 'C' #Calm
    ad.loc[ad['Wind_Direction'].str.startswith('E'), 'Wind_Direction'] = 'E' #East, ESE, ENE
    ad.loc[ad['Wind_Direction'].str.startswith('W'), 'Wind_Direction'] = 'W' #West, WSW, WNW
    ad.loc[ad['Wind_Direction'].str.startswith('S'), 'Wind_Direction'] = 'S' #South, SSW, SSE
    ad.loc[ad['Wind_Direction'].str.startswith('N'), 'Wind_Direction'] = 'N' #North, NNW, NNE
    ad.loc[ad['Wind_Direction'].str.startswith('V'), 'Wind_Direction'] = 'V' #Variable
      
    
    # Transform the one-hot features, then delete them
    onehot_df = pd.get_dummies(ad['Wind_Direction'], prefix='Wind')
    ad = pd.concat([ad, onehot_df], axis=1)
    ad=ad.drop(columns=['Weather_Condition','Wind_Direction'])
    '''
    #Label Encoding
    label_encoding_features = ['Side', 'Amenity','Bump', 'Crossing', 'Give_Way', 'Junction', 'No_Exit', 'Railway','Roundabout', 'Station', 'Stop', 'Traffic_Calming', 'Traffic_Signal','Turning_Loop', 'Sunrise_Sunset']

    for feature in label_encoding_features:
        ad[feature] = LabelEncoder().fit_transform(ad[feature])
    '''
    ad=ad.drop(columns=['Side', 'Amenity','Bump', 'Crossing', 'Give_Way', 'Junction', 'No_Exit', 'Railway','Roundabout', 'Station', 'Stop', 'Traffic_Calming', 'Traffic_Signal','Turning_Loop', 'Sunrise_Sunset'])
    
    corr_matrix = ad.corr()
    relationshipS =corr_matrix["Severity"].sort_values(ascending=False)
    relationshipD =corr_matrix["Duration"].sort_values(ascending=False)
    relationshipDis =corr_matrix["Distance_km"].sort_values(ascending=False)
      
    relationship = pd.concat([relationshipS, relationshipD,relationshipDis], axis=1)
    
    
    relationship.to_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\relationship.csv",index=True)
    
    #drop no relevant features
    adrelated=ad.drop(columns=['Start_Time','End_Time'])
        
    adrelated.to_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adrelated.csv",index=False)
    return None

def datasplit():
    
    ad = pd.read_csv(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adrelated.csv')
    '''
    bin_dur= pd.qcut(x=ad['Duration'], q=4).unique()
    ad['Duration_d'] = pd.qcut(x=ad['Duration'], q=5, labels=[1,2,3,4,5])
    bin_dis= pd.qcut(x=ad['Distance(km)'], q=5).unique()
    ad['Distance(km)_d'] = pd.qcut(x=ad['Distance(km)'], q=5, labels=[1,2,3,4,5])
    #print(bin_dur)
    #print(bin_dis)
    '''
    bins1 =[0,30,60,180,360,2000]
    labels1=[0,1,2,3,4]
    ad['DurationBin'] = pd.cut(ad.Duration, bins=bins1, labels=labels1)
    bins2 =[-0.01,0.5,1.0,2.0,10.0]
    labels2=[0,1,2,3]
    ad['Distance_kmBin'] = pd.cut(ad.Distance_km, bins=bins2, labels=labels2)
    #print(bin_dis)
    #print(ad.info())
    ad.to_csv(r"C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\inputData\adfinal.csv",index=False)
    
    # Train/Test Split
    X_reg = ad.drop(["Duration","Distance_km","Severity","DurationBin","Distance_kmBin"], axis=1)
    
    #Data for prediction of Severity
    Y_reg_Se = ad["Severity"]
    x_train_Se, x_test_Se, y_train_Se, y_test_Se = train_test_split(X_reg, Y_reg_Se, test_size = 0.3, random_state=0)
    
    #Data for prediction of Duration
    Y_reg_Du = ad["DurationBin"]
    x_train_Du, x_test_Du, y_train_Du, y_test_Du = train_test_split(X_reg, Y_reg_Du, test_size = 0.3, random_state=0)
    
    #Data for prediction of Distance
    Y_reg_Dis = ad["Distance_kmBin"]
    x_train_Dis, x_test_Dis, y_train_Dis, y_test_Dis = train_test_split(X_reg, Y_reg_Dis, test_size = 0.3, random_state=0)
    
    #sc = StandardScaler()
    #X_train = sc.fit_transform(X_train)
    #X_test = sc.transform(X_test)
    
    return x_train_Se, x_test_Se, y_train_Se, y_test_Se,x_train_Du, x_test_Du, y_train_Du, y_test_Du,x_train_Dis, x_test_Dis, y_train_Dis, y_test_Dis

def Knn(x_train, x_test, y_train, y_test):
    print("Knn")
    #Create KNN Object.
    knn1 = KNeighborsClassifier()

    #Training the model.
    knn1 = knn1.fit(x_train, y_train)
    
    #Predict test data set.
    y_pred = knn1.predict(x_test)
    
    #Checking performance our model with classification report.
    score = metrics.accuracy_score(y_test, y_pred)
    print(score)
    #report = classification_report(y_test, y_pred)
    
    # check for overfitting
    # using X_train to do predict and compare with X_test result
    y_pred = knn1.predict(x_train)

    # check our models performance
    print(metrics.accuracy_score(y_train, y_pred))
    
    return score,knn1

def DT(x_train, x_test, y_train, y_test):
    
    print("DT")
    dt=DecisionTreeClassifier()
    dt=dt.fit(x_train, y_train)
    
    y_pred = dt.predict(x_test)
    
    score = metrics.accuracy_score(y_test, y_pred)
    print(score)
    report = classification_report(y_test, y_pred)
    
    # check for overfitting
    # using X_train to do predict and compare with X_test result
    y_pred = dt.predict(x_train)

    # check our models performance
    print(metrics.accuracy_score(y_train, y_pred))
    
    '''
    print('max_depth:', dtc_best.best_estimator_.get_params()['max_depth'])
    print('min_samples_leaf:', dtc_best.best_estimator_.get_params()['min_samples_leaf'])
    print('criterion:', dtc_best.best_estimator_.get_params()['criterion'])
    '''
    return score,dt

def RF(x_train, x_test, y_train, y_test):
    print("RF")
    rf=RandomForestClassifier()
    rf=rf.fit(x_train, y_train)
    
    y_pred = rf.predict(x_test)
    
    score = metrics.accuracy_score(y_test, y_pred)
    print(score)
    report = classification_report(y_test, y_pred)

    # check for overfitting
    # using X_train to do predict and compare with X_test result
    y_pred = rf.predict(x_train)

    # check our models performance
    print(metrics.accuracy_score(y_train, y_pred))
    return score,rf

def compare(x_train, x_test, y_train, y_test):
    scoreknn, modelknn = Knn(x_train, x_test, y_train, y_test)
    scorekdt,modeldt = DT(x_train, x_test, y_train, y_test)
    scorerf,modelrf = DT(x_train, x_test, y_train, y_test)

    bestScore=scoreknn
    modelName = "knn"
    model=modelknn
    if scorekdt> bestScore:
        bestScore =scorekdt
        modelName = "DT"
        model=modeldt
    if scorerf> bestScore:
        bestScore =scorerf
        modelName = "RF"
        model=modelrf
    print(modelName," :",bestScore)
    return model

def bestModel(x_train_Se, x_test_Se, y_train_Se, y_test_Se,x_train_Du, x_test_Du, y_train_Du, y_test_Du,x_train_Dis, x_test_Dis, y_train_Dis, y_test_Dis):
    #   1. Severity
    modelSe =compare(x_train_Se, x_test_Se, y_train_Se, y_test_Se)
    #   2. Duration
    modelDur =compare(x_train_Du, x_test_Du, y_train_Du, y_test_Du)
    #   3. Distance
    modelDis=compare(x_train_Dis, x_test_Dis, y_train_Dis, y_test_Dis)
    return modelSe, modelDur,modelDis

def saveModel(modle,modelname):
    dump(modle,modelname)
    return None

def loadModel():
    modelSe = load(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\modelSe.joblib')
    modelDur = load(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\modelDur.joblib')
    modelDur = load(r'C:\Users\Sun Xiao Wen\Desktop\SIM BD\FYP\FYP-22-S2-18P\FYP_TrafficSystem\api\modelDis.joblib')
    return modelSe,modelDur,modelDur
#pending weather API
def getWeatherfromAPI():
    weather=pd.DataFrame({'Humidity(%)':[100.0], 'Pressure(in)':[29.79],'Precipitation(in)':[0.00], 'Description_Acc':[1], 'Description_Clo':[0], 'Month':[6], 'Day':[6], 'Hour':[20], 'Temperature(C)':[30], 'Wind_Chill(C)':[30], 'Visibility(km)':[3], 'Wind_Speed(knots)':[3.6], 'Weather_Fair':[0], 'Weather_Clear':[0], 'Weather_Cloudy':[1],'Weather_Overcast':[0], 'Weather_Haze':[0], 'Weather_Rain':[0],'Wind_C':[0], 'Wind_E':[0],'Wind_N':[0], 'Wind_S':[1],'Wind_V':[0],'Wind_W':[0]})
    return weather

def timesplit(accident):
    
    date = datetime.date.today()
    year = date.strftime("%Y") 
    timeInfo=str(year)+accident["Message"].split(" ")[0]
    
    
    format = "%Y(%d/%m)%H:%M"
    dt_object = datetime.datetime.strptime(timeInfo, format)
       
    return dt_object

def endTime(dt_object,resultDur):
    if resultDur==0:
        estEarly=dt_object
        estLate=dt_object+datetime.timedelta(minutes=30)
    elif resultDur==1:
        estEarly=dt_object+datetime.timedelta(minutes=30)
        estLate=dt_object+datetime.timedelta(minutes=60)
    elif resultDur==2:
        estEarly=dt_object+datetime.timedelta(minutes=60)
        estLate=dt_object+datetime.timedelta(minutes=180)
    elif resultDur==3:
        estEarly=dt_object+datetime.timedelta(minutes=180)
        estLate=dt_object+datetime.timedelta(minutes=360)
    elif resultDur==4:
        estEarly=dt_object+datetime.timedelta(minutes=360)
        estLate=dt_object+datetime.timedelta(minutes=720)
    
    return estEarly, estLate   

def predictionforAcc(modelSe, modelDur,modelDis,weather,accident):
    
    resultSe=modelSe.predict(weather)[0]
    resultDur=modelDur.predict(weather)[0]
    resultDis=modelDis.predict(weather)[0]
    
    accTimeInfo=timesplit(accident)
    estEarly, estLate=endTime(accTimeInfo,resultDur)

    Durationbin=["0-30 min","30-60 min", "1-3 hour","3-6 hour","more than 6 hour"]
    Distancebin=["0-500m","500-1000m","1k-2km","more than 2km"]
    
    result= "The Severity level of the accident is "+str(resultSe)+ " the accident will last for "+str(Durationbin[resultDur])+ " and will effect area will be "+ str(Distancebin[resultDis])+". The estimate end time will be "+str(estEarly)+" to "+str(estLate) +"."
    return result

#1)preprocess
#preprocess()

#2)Analysis
#   1. Weather with Severity
#analysisWeather()
#   2. Weather with Durtion
#analysisDuration()
#   3. Weather with distance
#analysisDistance()

#3) Ecoding
#ecoding()

#4)Datasplit()
#x_train_Se, x_test_Se, y_train_Se, y_test_Se,x_train_Du, x_test_Du, y_train_Du, y_test_Du,x_train_Dis, x_test_Dis, y_train_Dis, y_test_Dis=datasplit()
#print(x_train.columns)

#5)prediction
#   1. KNN
#score,knn=knn(x_train, x_test, y_train, y_test)
#print(dt)
#   2. DT
#score, dt=DT(x_train, x_test, y_train, y_test)
#   3. RF
#score, rf=RF(x_train, x_test, y_train, y_test)

#5)Compare
#modelSe,modelDur,modelDis =bestModel(x_train_Se, x_test_Se, y_train_Se, y_test_Se,x_train_Du, x_test_Du, y_train_Du, y_test_Du,x_train_Dis, x_test_Dis, y_train_Dis, y_test_Dis)

#6)save best model
#saveModel(modelSe,"api\modelSe.joblib")
##saveModel(modelDur,"api\modelDur.joblib")
#saveModel(modelDis,"api\modelDis.joblib")

#7)load Model
#modelSe, modelDur,modelDis=loadModel()

#8)get weather from API(Pending API)
#weather=pd.DataFrame({'Humidity(%)':[100.0], 'Pressure(in)':[30.06],'Precipitation(in)':[0.01], 'Description_Acc':[1], 'Description_Clo':[0], 'Month':[6], 'Day':[4], 'Hour':[14], 'Temperature(C)':[24], 'Wind_Chill(C)':[24], 'Visibility(km)':[16], 'Wind_Speed(m/s)':[5.56], 'Weather_Fair':[0], 'Weather_Clear':[0], 'Weather_Cloudy':[1],'Weather_Overcast':[0], 'Weather_Haze':[0], 'Weather_Rain':[0],'Wind_C':[1], 'Wind_E':[0],'Wind_N':[0], 'Wind_S':[0],'Wind_V':[0],'Wind_W':[0]})

#10)get Accident time information
'''
accident= {
            "Type": "Roadwork",
            "Latitude": 1.3016764960424563,
            "Longitude": 103.86281863886131,
            "Message": "(17/6)13:59 Roadworks on Java Road (towards Nicoll Highway) after Beach Road. Avoid left lane."
        }
'''
#timesplit(accident)
#print(result)

#11)prediction
#result=predictionforAcc(modelSe, modelDur,modelDis,weather,accident)
#print(result)
