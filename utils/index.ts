import Clipboard from 'clipboard'
import { cssTransition, Id, toast as toastify, ToastOptions } from 'react-toastify'

const toastQueue: Id[] = []

toastify.onChange(t => {
  if (t.status === 'added') {
    toastQueue.push(t.id)
    if (toastQueue.length > 3) {
      toastify.dismiss(toastQueue.shift())
    }
  }
  if (t.status === 'removed') {
    const idIdx = toastQueue.findIndex(v => v === t.id)
    if (idIdx !== -1) {
      toastQueue.splice(idIdx, 1)
    }
  }
})

export const toast = {
  success: (msg: string, opts?: ToastOptions) => {
    toastify.success(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      pauseOnFocusLoss: false,
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
      pauseOnFocusLoss: false,
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
      pauseOnFocusLoss: false,
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

export const getDemoArray = (str: string) => {
  const attributeVals: string[] = []
  str = str.replace(/:\s*(([^\s^;^{]+\s*)+);/g, (v, $1: string) => {
    attributeVals.push($1)
    return v.replace($1, '---')
  })
  const demoArray: string[] = []
  str.split('---').map(v => v.split('')).forEach(it => {
    demoArray.push(...it)
    const val = attributeVals.shift()
    !!val && demoArray.push(val)
  })
  return demoArray
}
