import React from 'react'

const MarkerFor = ({text,textName}) => {
    return(
        
        <div style={{
            width: 80, 
            height: 40,
            color: 'white',
            background: text === "0.0%" ? "blue" : 'red',
            padding: '7px 7px',
            display: 'inline-flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.7,
            fontSize: '10px',
        }}>
            {textName+": "+text}
        </div>
    )
}

export default MarkerFor;