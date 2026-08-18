import { useState } from 'react'

function App(){
  const[address, setAddress] = useState('')
  const [orientation, setOrientation] = useState('')
  const [submitted, setSubmitted] = useState(false)

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
      <button onClick = {() => setSubmitted(true)}> check sun-sim </button>
      
      {submitted && (
        <div>
          <p>your inputting address is : {address}</p>
          <p>your orientation selection is :{orientation}</p>
        </div>
      )
    }

    </div>
  )
}

export default App 