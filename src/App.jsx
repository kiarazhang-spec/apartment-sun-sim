import { useState } from 'react'
import * as SunCalc from 'suncalc'

function getSunAngle(windowDir, sunAzimuth){
  let diff = Math.abs(windowDir - sunAzimuth)
  if(diff > 180){
    diff = 360 - diff
  }
  return diff
}

function getLightStatus(altitude, angle){
  if (altitude <= 0){
    return 'now is after sunset time, not direct sunlight'
  }else if (angle < 45){
    return 'now sun location is facing the window, strong direct sunlight'
  }else if (angle < 90){
    return 'sunlight with angle'
  }else{
    return 'sun is locating behind the building, not direct sunlight'
  }
}

function orientationToDegrees(orientation){
  const map = {
    N: 0,
    E: 90,
    S: 180,
    W: 270,
  }
  return map[orientation]
}

async function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
  const response = await fetch(url)
  const data = await response.json()
  return data
}

function App(){
  const[address, setAddress] = useState('')
  const [orientation, setOrientation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const times = SunCalc.getTimes(new Date(), 37.7749, -122.4194)
  const sunPos = SunCalc.getPosition(new Date(), 37.7749, -122.4194)
  console.log('sunrise', times.sunrise)
  console.log('sunset',times.sunset)
  console.log('azimuth:', sunPos.azimuth)
  console.log('altitude:', sunPos.altitude)
  console.log('angletest', getSunAngle(180,165))
  console.log('angletest', getSunAngle(10,350))
  console.log('angletest', getSunAngle(0,180))
  const windowDegrees = orientationToDegrees(orientation)
  const angle = getSunAngle(windowDegrees, sunPos.azimuth)
  const status = getLightStatus(sunPos.altitude, angle)
  console.log('sunlight test', status)

  getCoordinates('San Francisco').then((data) => console.log(data))
 
  return(
    <div>
      <h1>公寓日照模拟器</h1>
      <input 
      type="text"
      placeholder="input address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}/>
      
      <select 
      value={orientation} 
      onChange={(e) => setOrientation(e.target.value)}>
        <option value=""> please select orientation</option>
        <option value="N">Facing North N</option>
        <option value="E">Facing East E</option>
        <option value="S">Facing South S</option>
        <option value="W">Facing West W</option>
      </select>
      
      <button onClick = {() => {
        if (orientation === ''){
          alert('please select orientation')
          return
        }
            setSubmitted(true)
       }}> check sun-sim </button>
      
      {submitted && (
        <div>
          <p>your inputting address is : {address}</p>
          <p>your orientation selection is :{orientation}</p>
          <p>sunlight: {status}</p>
        </div>
      )
    }

    </div>
  )
}

export default App 