import '../time-picker.css'

const TimePicker_Dummy = ({availability}) => {

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
    <div>
      <TimePickerDay 
        day={'Δευτέρα'}
        availability={availability}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Τρίτη'}
        availability={availability}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Τετάρτη'}
        availability={availability}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Πέμπτη'}
        availability={availability}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Παρασκευή'}
        availability={availability}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Σάββατο'}
        availability={availability}
        />
    </div>
    <div>
      <TimePickerDay 
        day={'Κυριακή'}
        availability={availability}
      />
    </div>
  </div>
  )
}


const TimePickerDay = ({day, availability}) => {
  let start, end
  let extraStyle= {}
  switch (day) {
    case 'Δευτέρα':
      start = availability["monday-start"]
      end = availability["monday-end"]
      extraStyle= {height:'56px', backgroundColor:'white'}
      break
    case 'Τρίτη':
      start = availability["tuesday-start"]
      end = availability["tuesday-end"]
      extraStyle= {height:'56px', backgroundColor:'white'}
      break
    case 'Τετάρτη':
      start = availability["wednesday-start"]
      end = availability["wednesday-end"]
      extraStyle= {height:'56px', backgroundColor:'white'}
      break
    case 'Πέμπτη':
      start = availability["thursday-start"]
      end = availability["thursday-end"]
      extraStyle= {height:'56px', backgroundColor:'white'}
      break
    case 'Παρασκευή':
      start = availability["friday-start"]
      end = availability["friday-end"]
      extraStyle= {height:'56px', backgroundColor:'white'}
      break
    case 'Σάββατο':
      start = availability["saturday-start"]
      end = availability["saturday-end"]
      extraStyle= {height:'56px', backgroundColor:'white'}
      break
    case 'Κυριακή':
      start = availability["sunday-start"]
      end = availability["sunday-end"]
      extraStyle= {height:'56px', backgroundColor:'white'}
      break
  }

  return (
    <div>
        {start !== -1 && end !== -1 ?
        <div className="time-picker" style={extraStyle}>
          <label className="lab profile-key" for="from-hours" style={{marginTop:'10px', float:'left', fontWeight:'700', marginLeft:'10px'}}>{day} </label>
            <div className="time-range">
              <label className="lab profile-key" for="from-hours" style={{float:'left', marginTop:'10px'}}>Από: </label>
                { start <= 12 ?
                <span style={{fontSize:'25px'}}>
                  {start}{' πμ'}
                </span>
                :
                <span style={{fontSize:'25px'}}>
                  {start-12}{' μμ'}
                </span>
                }
            </div>

            <div className="time-range">
              <label className="lab profile-key" for="from-hours" style={{float:'left', marginTop:'10px', marginLeft:'20px'}}>Μέχρι: </label>
                { end <= 12 ?
                <span style={{fontSize:'25px'}}>
                  {end}{' πμ'}
                </span>
                :
                <span style={{fontSize:'25px'}}>
                  {end-12}{' μμ'}
                </span>
                }
            </div>
        </div>
        :
        <div className="time-picker" style={extraStyle}>
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

export default TimePicker_Dummy