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
 const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&countrycodes=us`
  const response = await fetch(url)
  const data = await response.json()
  return data
}

function App(){
  const[address, setAddress] = useState('')
  const [orientation, setOrientation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const[candidates,setCandidates] = useState([])
  const[coords, setCoords] = useState(null)

   async function handleSearch() {
    const data = await getCoordinates(address)
    setCandidates(data)
    console.log('candidates:', data)
  }

  function pickCandidate(c) {
    setCoords({
      lat: parseFloat(c.lat),
      lng: parseFloat(c.lon),
    })
    console.log('picked coords:', c.lat, c.lon)
  }
 
  let status = null
  if (coords) {
    const sunPos = SunCalc.getPosition(new Date(), coords.lat, coords.lng)
    console.log('real sunPos:', sunPos)
    const windowDegrees = orientationToDegrees(orientation)
    const angle = getSunAngle(windowDegrees, sunPos.azimuth)
    status = getLightStatus(sunPos.altitude, angle)
  }

  return(
    <div>
      <h1>公寓日照模拟器</h1>
      <input 
      type="text"
      placeholder="input address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}/>
      
      <button onClick={handleSearch}>search address</button>
     
     {candidates.map((c) => (
         <button key={c.place_id} onClick={() => pickCandidate(c)}>
          {c.display_name}
        </button>
      ))}

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