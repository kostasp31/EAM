import { useState } from "react"

const ScrollButton = () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      if (scrolled > 300) {
          setVisible(true)
      } else if (scrolled <= 300) {
          setVisible(false)
      }
  }

  const scrollToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: "smooth"
          /* you can also use 'auto' behaviour
       in place of 'smooth' */
      })
  }

  window.addEventListener("scroll", toggleVisible)

  return (
      <button className='scrollButton' onClick={scrollToTop} style={{visibility: visible ? "visible" : "hidden"}}>
        <img width="30px" src='/icons/uparrow.svg' />
      </button>
  )
}

export default ScrollButton