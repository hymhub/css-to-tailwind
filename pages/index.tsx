import Editor from '@monaco-editor/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import FlipMove from 'react-flip-move'
import SimpleBar from 'simplebar-react'
import { v4 as uuidv4 } from 'uuid'
import SvgDark from '@/assets/svg/dark.svg'
import SvgLight from '@/assets/svg/light.svg'
import {
  CssToTailwindTranslator,
  specialAttribute
} from '@/hooks/CssToTailwindTranslator'
import { copyText, toast } from '@/utils/index'

let windowClick: (() => void) | null
const ePreventDefault = (e: KeyboardEvent) => {
  e.preventDefault()
}

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>()
  const [resultVals, setResultVals] = useState<ResultCode[]>([])
  const [demoEnded, setDemoEnded] = useState<boolean>(true)

  const demoStringKey = useRef<string[]>(
    'body {\nmargin: 0;\nbackground-color: #252526;↓\n\n.my-style {\ndisplay: flex;\njustify-content: space-between;\nwidth: 100%;\nheight: 50%;\nbackdrop-filter: blur(5px) contrast(1.2);\nmargin: 8px 16px 12px;↓\n\n@media (min-width: 1536px) {\n.my-media{\ndisplay: grid;\ngrid-auto-flow: row dense;'.split(
      ''
    )
  )

  const [computedResultVals, setComputedResultVals] = useState<
    ComputedResultCode[]
  >([])

  useEffect(() => {
    const resVals: ComputedResultCode[] = []
    resultVals.forEach((it, index) => {
      const t = computedResultVals.find(
        (v) =>
          v.selectorName + v.resultVal.map((v) => v.val).join(' ') ===
          it.selectorName + it.resultVal
      )

      if (t != null && resVals.findIndex((v) => v.id === t.id) === -1) {
        resVals.push(t)
      } else {
        resVals.push({
          id:
            resultVals.length === computedResultVals.length
              ? computedResultVals[index].id
              : uuidv4(),
          selectorName: it.selectorName,
          resultVal: it.resultVal.split(' ').map((v, idx) => {
            const oldId = computedResultVals[index]?.resultVal.find((c) => {
              const findRes = resVals[index]?.resultVal.findIndex(
                (v) => v.id === c.id
              )
              return c.val === v && (findRes === -1 || findRes === undefined)
            })?.id
            return {
              id:
                resultVals.length === computedResultVals.length && !!oldId
                  ? oldId
                  : uuidv4(),
              val: v
            }
          })
        })
      }
    })
    setComputedResultVals(resVals)
  }, [resultVals])

  // 采用节流缓解 flip 动画问题
  // const handleChangeHrottleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // const handleChange = (val: string | undefined, event: any) => {
  //   if (!handleChangeHrottleTimerRef.current) {
  //     handleChangeHrottleTimerRef.current = setTimeout(() => {
  //       const result = CssToTailwindTranslator(val ?? '')
  //       if (result.code === 'SyntaxError') {
  //         toast.error(
  //           `[${specialAttribute.join(', ')}] syntax does not support conversion`,
  //           {
  //             toastId: 'SyntaxError'
  //           }
  //         )
  //       }
  //       setResultVals(result.data)
  //       handleChangeHrottleTimerRef.current = null
  //     }, 200)
  //   }
  // }

  // 不采用节流，自定义值 flip 动画问题，用节流也只能缓解，目前无解
  const handleChange = (val: string | undefined, event: any) => {
    const result = CssToTailwindTranslator(val ?? '')
    if (result.code === 'SyntaxError') {
      toast.error(
        `[${specialAttribute.join(', ')}] syntax does not support conversion`,
        {
          toastId: 'SyntaxError'
        }
      )
    }
    setResultVals(result.data)
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
      if (Date.now() - startTimeRef.current >= 16) {
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
      <section className='font-[Consolas,_"Courier_New",_monospace] 2xl:col-start-2 relative 2xl:h-full max-2xl:h-1/2 overflow-y-auto text-[#111827] dark:text-[#abb2bf]'>
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
        <SimpleBar className="h-[calc(100%-64px)] overflow-y-auto px-[16px]">
          <FlipMove
            typeName="div"
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
            duration={200}
          >
            {computedResultVals.map((it) => (
              <div key={it.id}>
                <button
                  className="dark:bg-[#41454e] bg-[#eeeeee] [border:2px_solid_#e7e7e7] dark:[border:2px_solid_#1e1e1e] p-[8px_16px] font-bold text-[18px] cursor-pointer filter hover:brightness-105 active:enabled:brightness-95"
                  onClick={() => {
                    copyText(it.resultVal.map(v => v.val).join(' '))
                  }}
                >
                  Copy {it.selectorName} Result Code
                </button>
                <p className="text-[18px] leading-[30px] my-[16px]">
                  <span className="font-bold block mb-[8px]">
                    {it.selectorName} Result Code:{' '}
                  </span>
                  <FlipMove
                    className="dark:bg-[#1e1e1e] bg-[#e8e8e8] dark:text-[#b5cea8] text-[#098658] pt-[6px] pr-[10px] pl-[2px] inline-flex flex-wrap"
                    typeName="span"
                    enterAnimation="accordionHorizontal"
                    leaveAnimation="accordionHorizontal"
                    duration={200}
                  >
                    {it.resultVal.map((v) => (
                      <span
                        className="ml-[8px] h-[22px] inline-block overflow-hidden leading-[22px] mb-[6px]"
                        key={v.id}
                      >
                        {v.val}
                      </span>
                    ))}
                  </FlipMove>
                </p>
              </div>
            ))}
          </FlipMove>
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
