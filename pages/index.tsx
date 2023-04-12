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

  const demoStringKey = useRef<string[]>('body {\nmargin: 0;\nbackground-color: #252526;↓\n\n.my-style {\nwidth: 100%;\nheight: 50%;\npadding: 16px;\nmargin: 8px 16px 12px;\ndisplay: flex;\njustify-content: space-between;'.split(''))

  const handleChange = (val: string | undefined, event: any) => {
    setSourceVal(val ?? '')
  }

  const tmpStringRef = useRef<string>('')

  const startTimeRef = useRef<number>(0)

  const run = (editor: any) => {
    if (demoStringKey.current.length === 0) {
      tmpStringRef.current = ''
      window.removeEventListener('click', windowClick!)
      document.documentElement.style.pointerEvents = ''
      windowClick = null
      setDemoEnded(true)
      return
    }

    window.requestAnimationFrame(() => {
      if (Date.now() - startTimeRef.current >= 30) {
        startTimeRef.current = Date.now()
        const nextStr = demoStringKey.current.shift()
        if (nextStr === '↓') {
          const currentPosition = editor.getPosition();
          const nextLine = currentPosition.lineNumber + 1;
          const nextColumn = currentPosition.column;
          editor.setPosition({ lineNumber: nextLine, column: nextColumn });
        } else {
          editor.trigger("keyboard", "type", { text: nextStr });
        }
      }
      run(editor)
    })
  }


  const handleEditorDidMount = (editor: any, monaco: any) => {
    setDemoEnded(false)
    editor.focus()
    startTimeRef.current = Date.now()
    document.documentElement.style.pointerEvents = 'none'
    windowClick = () => {
      editor.focus()
    }
    window.addEventListener('click', windowClick)
    run(editor)
  }

  return (
    <div className='2xl:grid 2xl:grid-cols-2 2xl:grid-flow-row-dense'>
      <div className='p-[16px] font-[Consolas,_"Courier_New",_monospace] 2xl:col-start-2'>
        <h2 className='text-[#abb2bf] mb-[16px] 2xl:text-center text-[20px] font-bold'>Out Code</h2>
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
