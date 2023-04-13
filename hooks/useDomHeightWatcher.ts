import { useEffect } from 'react'

const domHeightChange = () => {
  document.documentElement.style.setProperty('--dom-height', `${window.innerHeight}px`)
}
function useDomHeightWatcher() {
  useEffect(() => {
    window.addEventListener('resize', domHeightChange)
    domHeightChange()
    return () => {
      window.removeEventListener('resize', domHeightChange)
    }
  }, [])
}

export default useDomHeightWatcher
