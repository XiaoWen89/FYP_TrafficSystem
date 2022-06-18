import React from 'react'

import { WiDaySunny as Sunny, WiCloud as Cloudy, WiHail as Rain } from "react-icons/wi";

const WeatherIcon = ({forecast}) =>{
    if (forecast.includes('sunny')){
        return (
            <div>
                <Sunny size={50} />
            </div>
        )
    }else if(forecast.includes('Cloudy')){
        return (
            <div>
                <Cloudy size={50}/>
            </div>
        )
    }else if(forecast.includes('Showers' || "Rain")){
        return (
            <div>
               <Rain size={50} />
            </div>

        )
    }else{
        return(
            <div>
            </div>
        )
    }

}

export default WeatherIcon;