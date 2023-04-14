import Editor from '@monaco-editor/react'
import clsx from 'clsx'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'
import SvgDark from '@/assets/svg/dark.svg'
import SvgLight from '@/assets/svg/light.svg'
import { copyText } from '@/utils/index'

let windowClick: (() => void) | null
const ePreventDefault = (e: KeyboardEvent) => {
  e.preventDefault()
}

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>()
  const [sourceVal, setSourceVal] = useState<string>('')
  const [resultVals, setResultVals] = useState<ResultCode[]>([
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    },
    {
      className: '.my-style',
      resultVal: 'bg-[#41454e] text-[#abb2bf] border-none'
    }
  ])
  const [demoEnded, setDemoEnded] = useState<boolean>(true)

  const demoStringKey = useRef<string[]>(
    'body {\nmargin: 0;\nbackground-color: #252526;↓\n\n.my-style {\nwidth: 100%;\nheight: 50%;\npadding: 16px;\nmargin: 8px 16px 12px;\ndisplay: flex;\njustify-content: space-between;'.split(
      ''
    )
  )

  const handleChange = (val: string | undefined, event: any) => {
    setSourceVal(val ?? '')
  }

  const tmpStringRef = useRef<string>('')
  const startTimeRef = useRef<number>(0)
  const editorContainerRef = useRef<HTMLElement>(null)

  const run = (editor: any) => {
    if (demoStringKey.current.length === 0) {
      tmpStringRef.current = ''
      windowClick && window.removeEventListener('click', windowClick)
      if (editorContainerRef.current) {
        editorContainerRef.current.style.pointerEvents = ''
        document.removeEventListener('keydown', ePreventDefault)
      }
      windowClick = null
      setDemoEnded(true)
      return
    }

    window.requestAnimationFrame(() => {
      if (Date.now() - startTimeRef.current >= 30) {
        startTimeRef.current = Date.now()
        const nextStr = demoStringKey.current.shift()
        if (nextStr === '↓') {
          const currentPosition = editor.getPosition()
          const nextLine = currentPosition.lineNumber + 1
          const nextColumn = currentPosition.column
          editor.setPosition({ lineNumber: nextLine, column: nextColumn })
        } else {
          editor.trigger('keyboard', 'type', { text: nextStr })
        }
      }
      run(editor)
    })
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setDemoEnded(false)
    editor.focus()
    startTimeRef.current = Date.now()
    if (editorContainerRef.current) {
      editorContainerRef.current.style.pointerEvents = 'none'
      document.addEventListener('keydown', ePreventDefault)
    }
    windowClick = () => {
      editor.focus()
    }
    window.addEventListener('click', windowClick)
    run(editor)
  }

  const themeChange = () => {
    setIsDarkTheme((v) => !v)
  }

  const setTheme = () => {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    setIsDarkTheme((localStorage.theme ?? 'dark') === 'dark')
  }, [])

  useEffect(() => {
    if (isDarkTheme !== undefined) {
      localStorage.theme = isDarkTheme ? 'dark' : 'light'
    }
    setTheme()
  }, [isDarkTheme])

  return (
    <div className="2xl:grid 2xl:grid-cols-2 2xl:grid-flow-row-dense h-dom-height max-2xl:overflow-y-auto">
      <section className='font-[Consolas,_"Courier_New",_monospace] 2xl:col-start-2 relative 2xl:h-full max-2xl:max-h-[50%] overflow-y-auto text-[#111827] dark:text-[#abb2bf]'>
        <button
          onClick={themeChange}
          className="w-[60px] h-[32px] absolute right-[16px] top-[16px] rounded-[16px] border-solid border-[1px] dark:border-[rgba(82,82,89,.68)] dark:bg-[#313136] border-[rgba(60,60,67,.29)] bg-[#eeeeee]"
        >
          <span
            className={clsx(
              'bg-[#ffffff] dark:bg-[#000000] flex justify-center items-center w-[30px] h-[30px] rounded-[50%] absolute top-0',
              isDarkTheme ? 'left-0' : 'left-[calc(100%-30px)]'
            )}
          >
            {isDarkTheme ? (
              <SvgDark fill="#abb2bf" />
            ) : (
              <SvgLight fill="rgba(60,60,67,.7)" />
            )}
          </span>
        </button>
        <h2 className="m-[16px] 2xl:text-center text-[22px] font-bold h-[32px]">
          Out Code
        </h2>
        <SimpleBar className="2xl:h-[calc(100%-64px)] max-2xl:max-h-[calc(var(--dom-height)/2-64px)] overflow-y-auto px-[16px]">
          {resultVals.map((it, key) => (
            <div key={key}>
              <button
                className={clsx(
                  'dark:bg-[#41454e] bg-[#eeeeee] [border:2px_solid_#e7e7e7] dark:[border:2px_solid_#1e1e1e] p-[8px_16px] font-bold text-[18px] cursor-pointer filter hover:brightness-105 active:enabled:brightness-95',
                  { 'opacity-50': !demoEnded }
                )}
                onClick={() => {
                  copyText(it.resultVal)
                }}
                disabled={!demoEnded}
              >
                Copy {it.className} Result Code
              </button>
              <p className="text-[18px] leading-[30px] my-[16px]">
                <span className="font-bold">{it.className} Result Code: </span>
                <span className="dark:bg-[#1e1e1e] bg-[#e8e8e8] dark:text-[#b5cea8] text-[#098658] p-[6px_10px]">
                  {it.resultVal}
                </span>
              </p>
            </div>
          ))}
        </SimpleBar>
      </section>
      <section
        ref={editorContainerRef}
        className="2xl:h-full h-1/2 border-t-[1px] border-solid border-[#d9dce1] dark:border-transparent"
      >
        <Editor
          language="css"
          theme={isDarkTheme ? 'vs-dark' : 'light'}
          onChange={handleChange}
          value={''}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 18
          }}
        />
      </section>
    </div>
  )
}
