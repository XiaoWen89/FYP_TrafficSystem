import requests
import os
from dotenv import load_dotenv

load_dotenv()

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
        print(data)
