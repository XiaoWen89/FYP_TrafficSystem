import React from 'react'

const Marker = ({text}) => {
    return(
        <div style={{
            color: 'white',
            background: text === "Accident" ? "red" : (text === "Diversion" ? "orange" : (text === "Roadwork" ? "yellow" :(text === "Vehicle breakdown" ? "blue" : (text === "Heavy traffic" ? "green" : "'grey'")))),
            padding: '5px 5px',
            display: 'inline-flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.7,
            fontSize: '10px',
        }}>
            {text === "Accident" ? "!" : (text === "Diversion" ? "X" : (text === "Roadwork" ? "W" : (text === "Vehicle breakdown" ? "V" : (text === "Heavy traffic" ? "H" : "?"))))}
        </div>
    )
}

export default Marker;