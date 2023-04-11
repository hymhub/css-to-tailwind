import Head from 'next/head'
import Image from 'next/image'
import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { copyText } from '@/utils/index'
import clsx from 'clsx'

let windowClick: (() => void) | null

export default function Home() {
  const [sourceVal, setSourceVal] = useState<string>('')
  const [resultVals, setResultVals] = useState<{ className: string; resultVal: string; }[]>([
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    }
  ])
  const [demoEnded, setDemoEnded] = useState<boolean>(true)

  const demoStringKey = useRef<string[]>('.my-style {\n\twidth: 100%;\n\theight: 50%;\n\tpadding: 16px;\n\tmargin: 8px 16px 12px;\n\tdisplay: flex;\n\tjustify-content: space-between;\n\tbackground-color: #252526;'.split(''))

  const handleChange = (val: string | undefined, event: any) => {
    setSourceVal(val ?? '')
  }

  const editorElement = useRef<HTMLTextAreaElement>()

  const tmpStringRef = useRef<string>('')

  const startTimeRef = useRef<number>(0)

  const run = () => {
    if (demoStringKey.current.length === 0) {
      tmpStringRef.current = ''
      window.removeEventListener('click', windowClick!)
      document.documentElement.style.pointerEvents = ''
      windowClick = null
      setDemoEnded(true)
      return
    }

    window.requestAnimationFrame(() => {
      if (Date.now() - startTimeRef.current >= 30 && editorElement.current) {
        startTimeRef.current = Date.now()
        editorElement.current.value = tmpStringRef.current += demoStringKey.current.shift()
        const e = new Event('input', { bubbles: true })
        editorElement.current.dispatchEvent(e)
      }
      run()
    })
  }


  const handleEditorDidMount = (editor: any, monaco: any) => {
    setDemoEnded(false)
    editor.focus()
    startTimeRef.current = Date.now()
    editorElement.current = document.getElementsByClassName('inputarea')[0] as HTMLTextAreaElement
    document.documentElement.style.pointerEvents = 'none'
    windowClick = () => {
      editor.focus()
    }
    window.addEventListener('click', windowClick)
    run()
  }

  return (
    <div>
      <div className='p-[16px] font-[Consolas,_"Courier_New",_monospace]'>
        {
          resultVals.map((it, key) => (
            <div key={key}>
              <button
                className={clsx('bg-[#41454e] text-[#abb2bf] border-none [border:2px_solid_#1e1e1e] p-[8px_16px] font-bold text-[18px] cursor-pointer filter hover:brightness-110 active:enabled:brightness-90 transition-all duration-300', { 'opacity-50': !demoEnded })}
                onClick={() => copyText(it.resultVal)}
                disabled={!demoEnded}
              >
                Copy {it.className} Result Code
              </button>
              <p className='text-[#b5cea8] text-[18px] leading-[30px] mt-[16px]'>
                <span className='text-[#abb2bf] font-bold'>{it.className} Result Code: </span>
                <span className='bg-[#1e1e1e] p-[6px_10px]'>{it.resultVal}</span>
              </p>
            </div>
          ))
        }
      </div>
      <Editor
        language='css'
        theme='vs-dark'
        height='80vh'
        onChange={handleChange}
        value={''}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 18,
        }}
      />
    </div>
  )
}
