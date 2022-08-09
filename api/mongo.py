from pymongo import MongoClient


MONGO_CLIENT = MongoClient("mongodb://localhost:27017/")
db = MONGO_CLIENT['data']

area_geo_loc = db['area_geo_loc']
accident_data = db['accident_data']
user = db['user']

######
#user#
######
def findUser(username:str, hashed:str):
    result=None
    try:
        result = user.find_one({"username":username, "hashed":hashed})
    except:
        print("Got exception whie trying to find user ...")
    else:
        if result:
            return result
        else:
            print("There is no such user {}, please check ....".format(username))

            return result


def checkUserExisting(username:str):
    try:
        result = user.find_one({"username":username})
    except:
        print("There is exception while check wheteher user exists by username .....")
    else:
        if result:
            return "0"
        else:
            return "1"

#by default, the role will be user 
def createNewUser(user_object:dict):
    try:
        result=user.insert_one(user_object)
    except:
        print("there is exception while trying to insert user {}, please check .....".format(user_object['username']))
    else:
        if result:
            return {
                "username":user_object['username'],
                "access":user_object['access']
                }
        else:
            return None
