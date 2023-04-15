import Clipboard from 'clipboard'
import { cssTransition, toast as toastify, ToastOptions } from 'react-toastify'

export const toast = {
  success: (msg: string, opts?: ToastOptions) => {
    toastify.success(msg, {
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
      }),
      ...opts
    })
  },
  warn: (msg: string, opts?: ToastOptions) => {
    toastify.warn(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: localStorage.theme === 'dark' ? 'dark' : 'light',
      ...opts
    })
  },
  error: (msg: string, opts?: ToastOptions) => {
    toastify.error(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: localStorage.theme === 'dark' ? 'dark' : 'light',
      ...opts
    })
  }
}

export const copyText = (str: string) => {
  if (str == '') {
    toast.warn('No Result')
    return
  }
  const fakeElement = document.createElement('button')
  const clipboard = new Clipboard(fakeElement, {
    text: () => str || '',
    action: () => 'copy'
  })
  clipboard.on('success', () => {
    clipboard.destroy()
    toast.success('Copy Success!')
  })
  clipboard.on('error', () => {
    clipboard.destroy()
    toast.error('Copy Error!')
  })
  document.body.appendChild(fakeElement)
  fakeElement.click()
  document.body.removeChild(fakeElement)
}
