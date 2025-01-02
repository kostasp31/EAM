import '../time-picker.css'
import Switch from "react-switch"

import { useState, useEffect } from 'react'


const TimePicker = ({hours, setHours}) => {
  const [mondayStart, setMondayStart] = useState('8')
  const [mondayStartPM, setMondayStartPM] = useState('πμ')
  const [mondayEnd, setMondayEnd] = useState('4')
  const [mondayEndPM, setMondayEndPM] = useState('μμ')

  const [tuesdayStart, setTuesdayStart] = useState('8')
  const [tuesdayStartPM, setTuesdayStartPM] = useState('πμ')
  const [tuesdayEnd, setTuesdayEnd] = useState('4')
  const [tuesdayEndPM, setTuesdayEndPM] = useState('μμ')

  const [wednesdayStart, setWednesdayStart] = useState('8')
  const [wednesdayStartPM, setWednesdayStartPM] = useState('πμ')
  const [wednesdayEnd, setWednesdayEnd] = useState('4')
  const [wednesdayEndPM, setWednesdayEndPM] = useState('μμ')

  const [thursdayStart, setThursdayStart] = useState('8')
  const [thursdayStartPM, setThursdayStartPM] = useState('πμ')
  const [thursdayEnd, setThursdayEnd] = useState('4')
  const [thursdayEndPM, setThursdayEndPM] = useState('μμ')

  const [fridayStart, setFridayStart] = useState('8')
  const [fridayStartPM, setFridayStartPM] = useState('πμ')
  const [fridayEnd, setFridayEnd] = useState('4')
  const [fridayEndPM, setFridayEndPM] = useState('μμ')

  const [saturdayStart, setSaturdayStart] = useState('8')
  const [saturdayStartPM, setSaturdayStartPM] = useState('πμ')
  const [saturdayEnd, setSaturdayEnd] = useState('4')
  const [saturdayEndPM, setSaturdayEndPM] = useState('μμ')

  const [sundayStart, setSundayStart] = useState('8')
  const [sundayStartPM, setSundayStartPM] = useState('πμ')
  const [sundayEnd, setSundayEnd] = useState('4')
  const [sundayEndPM, setSundayEndPM] = useState('μμ')

  useEffect(() => {
    let newHours = {
      "monday-start": mondayStart === -1 ? -1 : (mondayStartPM === 'πμ' ? Number(mondayStart) : Number(mondayStart) + 12), 
      "monday-end": mondayEnd === -1 ? -1 : (mondayEndPM === 'πμ' ? Number(mondayEnd) : Number(mondayEnd) + 12), 

      "tuesday-start": tuesdayStart === -1 ? -1 : (tuesdayStartPM === 'πμ' ? Number(tuesdayStart) : Number(tuesdayStart) + 12), 
      "tuesday-end": tuesdayEnd === -1 ? -1 : (tuesdayEndPM === 'πμ' ? Number(tuesdayEnd) : Number(tuesdayEnd) + 12), 

      "wednesday-start": wednesdayStart === -1 ? -1 : (wednesdayStartPM === 'πμ' ? Number(wednesdayStart) : Number(wednesdayStart) + 12), 
      "wednesday-end": wednesdayEnd === -1 ? -1 : (wednesdayEndPM === 'πμ' ? Number(wednesdayEnd) : Number(wednesdayEnd) + 12), 

      "thursday-start": thursdayStart === -1 ? -1 : (thursdayStartPM ==='πμ' ? Number(thursdayStart) : Number(thursdayStart) + 12), 
      "thursday-end": thursdayEnd === -1 ? -1 : (thursdayEndPM === 'πμ' ? Number(thursdayEnd) : Number(thursdayEnd) + 12), 

      "friday-start": fridayStart === -1 ? -1 : (fridayStartPM === 'πμ' ? Number(fridayStart) : Number(fridayStart) + 12), 
      "friday-end": fridayEnd === -1 ? -1 : (fridayEndPM === 'πμ' ? Number(fridayEnd) : Number(fridayEnd) + 12), 

      "saturday-start": saturdayStart === -1 ? -1 : (saturdayStartPM === 'πμ' ? Number(saturdayStart) : Number(saturdayStart) + 12), 
      "saturday-end": saturdayEnd === -1 ? -1 : (saturdayEndPM === 'πμ' ? Number(saturdayEnd) : Number(saturdayEnd) + 12), 

      "sunday-start": sundayStart === -1 ? -1 : (sundayStartPM === 'πμ' ? Number(sundayStart) : Number(sundayStart) + 12), 
      "sunday-end": sundayEnd === -1 ? -1 : (sundayEndPM === 'πμ' ? Number(sundayEnd) : Number(sundayEnd) + 12), 
    }
    setHours(newHours)
  }, 
  [
    mondayStart,
    mondayStartPM,
    mondayEnd,
    mondayEndPM,
    tuesdayStart,
    tuesdayStartPM,
    tuesdayEnd,
    tuesdayEndPM,
    wednesdayStart,
    wednesdayStartPM,
    wednesdayEnd,
    wednesdayEndPM,
    thursdayStart,
    thursdayStartPM,
    thursdayEnd,
    thursdayEndPM,
    fridayStart,
    fridayStartPM,
    fridayEnd,
    fridayEndPM,
    saturdayStart,
    saturdayStartPM,
    saturdayEnd,
    saturdayEndPM,
    sundayStart,
    sundayStartPM,
    sundayEnd,
    sundayEndPM
  ])


  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
    <div>
      <TimePickerDay 
        day={'Δευτέρα'}
        dayStart={mondayStart}
        setDayStart={setMondayStart}
        dayStartPM={mondayStartPM}
        setDayStartPM={setMondayStartPM}
        dayEnd={mondayEnd}
        setDayEnd={setMondayEnd}
        dayEndPM={mondayEndPM}
        setDayEndPM={setMondayEndPM}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Τρίτη'}
        dayStart={tuesdayStart}
        setDayStart={setTuesdayStart}
        dayStartPM={tuesdayStartPM}
        setDayStartPM={setTuesdayStartPM}
        dayEnd={tuesdayEnd}
        setDayEnd={setTuesdayEnd}
        dayEndPM={tuesdayEndPM}
        setDayEndPM={setTuesdayEndPM}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Τετάρτη'}
        dayStart={wednesdayStart}
        setDayStart={setWednesdayStart}
        dayStartPM={wednesdayStartPM}
        setDayStartPM={setWednesdayStartPM}
        dayEnd={wednesdayEnd}
        setDayEnd={setWednesdayEnd}
        dayEndPM={wednesdayEndPM}
        setDayEndPM={setWednesdayEndPM}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Πέμπτη'}
        dayStart={thursdayStart}
        setDayStart={setThursdayStart}
        dayStartPM={thursdayStartPM}
        setDayStartPM={setThursdayStartPM}
        dayEnd={thursdayEnd}
        setDayEnd={setThursdayEnd}
        dayEndPM={thursdayEndPM}
        setDayEndPM={setThursdayEndPM}
      />
    </div>
    <div>
      <TimePickerDay 
        day={'Παρασκευή'}
        dayStart={fridayStart}
        setDayStart={setFridayStart}
        dayStartPM={fridayStartPM}
        setDayStartPM={setFridayStartPM}
        dayEnd={fridayEnd}
        setDayEnd={setFridayEnd}
        dayEndPM={fridayEndPM}
        setDayEndPM={setFridayEndPM}
      />
    </div>
    <div>
      <TimePickerDay 
        day={'Σάββατο'}
        dayStart={saturdayStart}
        setDayStart={setSaturdayStart}
        dayStartPM={saturdayStartPM}
        setDayStartPM={setSaturdayStartPM}
        dayEnd={saturdayEnd}
        setDayEnd={setSaturdayEnd}
        dayEndPM={saturdayEndPM}
        setDayEndPM={setSaturdayEndPM}
      />
    </div>
    <div>
      <TimePickerDay 
        day={'Κυριακή'}
        dayStart={sundayStart}
        setDayStart={setSundayStart}
        dayStartPM={sundayStartPM}
        setDayStartPM={setSundayStartPM}
        dayEnd={sundayEnd}
        setDayEnd={setSundayEnd}
        dayEndPM={sundayEndPM}
        setDayEndPM={setSundayEndPM}
      />
    </div>
  </div>
  )
}


const TimePickerDay = ({day, dayStart, setDayStart, dayStartPM, setDayStartPM, dayEnd, setDayEnd, dayEndPM, setDayEndPM}) => {
  const [checked, setChecked] = useState(true)

  const handleChange = (nextChecked) => {
    setChecked(nextChecked)
    if (!nextChecked) {
      setDayStart(-1)
      setDayEnd(-1)
    }
    else {
      setDayStart('8')
      setDayEnd('4')
      setDayStartPM('πμ')
      setDayEndPM('μμ')
    }
  }

  return (
    <div>
      {checked ?
        <div className="time-picker">
          <Switch 
            onChange={handleChange}
            checked={checked}
            onColor='#00ff00'
            offColor='#ff0000'
            onHandleColor='#5eaff2'
            offHandleColor='#c4c4c4'
            handleDiameter={30}
            height={20}
            width={48}
            className='switch'
          />
          <label className="lab profile-key" for="from-hours" style={{marginTop:'10px', float:'left', fontWeight:'700', marginLeft:'10px'}}>{day} </label>
            <div className="time-range">
              <label className="lab profile-key" for="from-hours" style={{float:'left', marginTop:'10px'}}>Από: </label>
                <select id="from-hours"
                    value={dayStart}
                    onChange={e => setDayStart(e.target.value)}
                    >
                    <option value="1">01</option>
                    <option value="2">02</option>
                    <option value="3">03</option>
                    <option value="4">04</option>
                    <option value="5">05</option>
                    <option value="6">06</option>
                    <option value="7">07</option>
                    <option value="8">08</option>
                    <option value="9">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>

                <select id="from-ampm"
                    value={dayStartPM}
                    onChange={e => setDayStartPM(e.target.value)}
                >
                  <option value="πμ">πμ</option>
                  <option value="μμ">μμ</option>
                </select>
            </div>

            <div className="time-range">
              <label className="lab profile-key" for="from-hours" style={{float:'left', marginTop:'10px', marginLeft:'20px'}}>Μέχρι: </label>
                <select id="to-hours"
                  value={dayEnd}
                  onChange={e => setDayEnd(e.target.value)}
                  >
                    <option value="1">01</option>
                    <option value="2">02</option>
                    <option value="3">03</option>
                    <option value="4">04</option>
                    <option value="5">05</option>
                    <option value="6">06</option>
                    <option value="7">07</option>
                    <option value="8">08</option>
                    <option value="9">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>

                <select id="to-ampm"
                  value={dayEndPM}
                  onChange={e => setDayEndPM(e.target.value)}
                  >
                    <option value="πμ">πμ</option>
                    <option value="μμ">μμ</option>
                </select>
            </div>
        </div>
        :
        <div className="time-picker">
          <Switch 
            onChange={handleChange}
            checked={checked}
            onColor='#00ff00'
            offColor='#ff0000'
            onHandleColor='#5eaff2'
            offHandleColor='#c4c4c4'
            handleDiameter={30}
            height={20}
            width={48}
            className='switch'
          />
          <label className="lab profile-key" for="from-hours" style={{marginTop:'10px', float:'left', fontWeight:'700', marginLeft:'10px', color:'#c4c4c4'}}>{day} </label>
          <div className="time-range"  style={{float:'left'}}>
            <img src='icons/moon.svg' width="37" />
            <label className="lab profile-key" for="from-hours" style={{float:'left', marginTop:'10px', color:'#c4c4c4'}}>Μη διαθέσιμος/η </label>
          </div>
        </div>
      }
    </div>
    )
}

export default TimePicker