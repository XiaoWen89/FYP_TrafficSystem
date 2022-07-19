#combine location and forecast info together, return in dict structure
def processWeatherData(data:dict):
    processed_data = []
    forecasts=data['items'][0]['forecasts'] #list

    locations=data['area_metadata'] #list

    for i in range(len(forecasts)):
        element=dict()

        element['name'] = locations[i]['name']
        element['location'] = locations[i]['label_location']

        element['forecast'] =forecasts[i]['forecast']

        processed_data.append(element)

    return {"data": processed_data}

#combine location and temp info together, return in dict structure
def processTempData(data:dict):
    processed_data = []
    readings=data['items'][0]['readings'] #list

    stations=data['metadata']['stations'] #list

    for i in range(len(readings)):
        element=dict()

        element['name'] = stations[i]['name']
        element['location'] = stations[i]['location']

        element['temp'] =readings[i]['value']

        processed_data.append(element)

    return {"data": processed_data}

#combine location and wind info together, return in dict structure
def processWindData(data:dict):
    processed_data = []
    readings=data['items'][0]['readings'] #list

    stations=data['metadata']['stations'] #list

    for i in range(len(readings)):
        element=dict()

        element['name'] = stations[i]['name']
        element['location'] = stations[i]['location']

        element['speed'] =readings[i]['value']

        processed_data.append(element)

    return {"data": processed_data}

#combine location and wind info together, return in dict structure
def processWindDirData(data:dict):
    processed_data = []
    readings=data['items'][0]['readings'] #list

    stations=data['metadata']['stations'] #list

    for i in range(len(readings)):
        element=dict()

        element['name'] = stations[i]['name']
        element['location'] = stations[i]['location']

        element['direction'] =readings[i]['value']

        processed_data.append(element)

    return {"data": processed_data}

#combine location and wind info together, return in dict structure
def processHumidityData(data:dict):
    processed_data = []
    readings=data['items'][0]['readings'] #list

    stations=data['metadata']['stations'] #list

    for i in range(len(readings)):
        element=dict()

        element['name'] = stations[i]['name']
        element['location'] = stations[i]['location']

        element['humidity'] =readings[i]['value']

        processed_data.append(element)

    return {"data": processed_data}