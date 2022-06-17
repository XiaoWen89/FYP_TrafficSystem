import time
import requests
from flask import Flask
from dotenv import load_dotenv
import os
import json

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

if __name__ == '__main__':
    app.run(debug=True)