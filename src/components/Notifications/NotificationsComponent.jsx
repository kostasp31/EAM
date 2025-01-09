import BellSVG from "./BellSVG";
import "./NotificationsComponent.css";

const FormattedTimestamp = ({timestamp}) => {
  const date = new Date(timestamp*1000)
  console.log(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return (
  <>
    {`${day}-${month}-${year}`}
  </>
  )
}

export default function NotificationsComponent({user_data}) {

  return (
    <>
      <div className="notifications__container">
        {/* <div className="notifications-topbar">
          <span>
            <b>Ειδοποιήσεις (1) </b>
          </span>
          <span id="bell-icon">
            <BellSVG />
          </span>
        </div> */}
        <div className="notifications-content">
          <ul>
            { user_data.notifications.sort((a, b) => b.time - a.time).map((el) => {
              let initials = el.ref_user.split(" ")
              return (
                <li>
                  <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}} ><span id="circle-name">{initials[0][0]}{initials[1][0]}</span>{" "}</div>
                  <div className="content-container">
                    <span id="content-description">
                      Ο χρήστης <b>{el.ref_user}</b> {el.content}
                    </span>
                    <span id="time-elapsed"><FormattedTimestamp timestamp={el.time} /></span>
                  </div>
                </li>
              )
            })}
            {/* <li>
              <span id="circle-name">ΙΧ</span>{" "}
              <div className="content-container">
                <span id="content-description">
                  H <b>Ιωάννα Χατζή</b> υπέγραψε το συμφωνητικό
                </span>
                <span id="time-elapsed">1 μήνας πριν</span>
              </div>
            </li>
            <li>
              <span id="circle-name">ΙΧ</span>{" "}
              <div className="content-container">
                <span id="content-description">
                  H <b>Ιωάννα Χατζή</b> αποδέχτηκε το ραντεβού σας
                </span>
                <span id="time-elapsed">1 μήνας πριν</span>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
}
