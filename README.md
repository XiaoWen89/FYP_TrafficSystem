
# About the Project

This project aims to develop a data-driven system to forecast traffic situations based on existing traffic incidents. Traffic incidents, special events and construction have dramatic impacts on the transportation network. It is a high priority for transport agencies to understand the network response to these events, such as predicting the affected road segments and the resulting travel times on those segments.

The system will be largely powered by a monitor unit for traffic incidents driven by daily traffic data, e.g., Opal trips, train station entries and exists data, NSW speed cameras, etc. The above multiple sources of data (not limited to) should be preprocessed (e.g., fusion) first. Then, irregular traffic records aim to be reported in dashboards, natural languages, and UI frontend.

The system will also be able to forecast the possible traffic impact to end-users. For each accident, the influencing area, 
influencing grades, and suggestions to travellers should be provided accordingly

# System Structure

Frontend -> React (UI credit to Ant Design Pro, can refer its [Github](https://github.com/ant-design/ant-design-pro) for more information)

Backend -> Flask (python)

Database -> Mongo

# Environment Prepare

## Clone the git repository

Please refer to the [here](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#Cloning%20an%20Existing%20Repository)

## Frontend Part

### Instll NodeJS

version prefer 16.15.0 (or later), here is the [offical download link](https://nodejs.org/en/download/)

### Open command/terminal, cd to the project directory

```bash
cd /directory/the/project/folder/located
```

### Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

### Start project

```bash
npm start
```

## Backand Part

### Install Python 

Version prefer latest

### Open <b>another</b> command and change directory to the api folder in the project

```bash
cd /directory/the/project/folder/located/and/cd/to/api/folder
```

### Create Virtual Environment (Optional)

You can choose [venv](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project) or [conda](https://docs.conda.io/en/latest/miniconda.html#:~:text=Miniconda%20is%20a%20free%20minimal,zlib%20and%20a%20few%20others.)

### Install the python library

```bash
cd pip install -r requirements.txt
```

### Start the Backend

```bash
flask run
```

## More

Credict to [Ant Design Pro](https://pro.ant.design) -> Frontend UI

Creadict to [miguelgrinberg](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project) -> The overall idea abour combining React + Flask together
