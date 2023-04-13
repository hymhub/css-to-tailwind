import Clipboard from 'clipboard'
import { cssTransition, toast } from 'react-toastify'

export const copyText = (str: string) => {
  if (str == '') {
    toast.warn('No Result', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: localStorage.theme === 'dark' ? 'dark' : 'light'
    })
    return
  }

  const fakeElement = document.createElement('button')
  const clipboard = new Clipboard(fakeElement, {
    text: () => str || '',
    action: () => 'copy'
  })
  clipboard.on('success', () => {
    clipboard.destroy()
    toast.success('Copy Success!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: localStorage.theme === 'dark' ? 'dark' : 'light',
      transition: cssTransition({
        enter: 'Toastify--animate Toastify__slide-enter',
        exit: 'Toastify--animate Toastify__slide-exit',
        appendPosition: true
      })
    })
  })
  clipboard.on('error', () => {
    clipboard.destroy()
    toast.error('Copy Error!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: localStorage.theme === 'dark' ? 'dark' : 'light'
    })
  })
  document.body.appendChild(fakeElement)
  fakeElement.click()
  document.body.removeChild(fakeElement)
}
