import React from 'react'
import './Image.css'

export default function Image() {
    return (
        <div  >
            <div  >
                <div className='LogoContainer'>
                    <div>
                        <p>Trainify</p>
                    </div>
                    <img src="../image.png" alt="HEJSAN" height={'120px'} width={'200px'} />
                </div>
            </div>
            <div className="ImageContainer" >
                <img src='https://images.unsplash.com/reserve/OQx70jjBSLOMI5ackhxm_urbex-ppc-030.jpg?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYWlufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60' width={'100%'} height={'800px'}></img>
            </div>
         
        </div>
    )
}
