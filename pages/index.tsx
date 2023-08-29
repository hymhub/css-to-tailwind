import Editor from '@monaco-editor/react'
import {
  CssToTailwindTranslator,
  specialAttribute,
  defaultTranslatorConfig
} from 'css-to-tailwind-translator'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ResultSection from '@/components/ResultSection'
import { getDemoArray, toast } from '@/utils/index'

let windowClick: (() => void) | null
const ePreventDefault = (e: KeyboardEvent) => {
  e.preventDefault()
}

const demoArray = getDemoArray(
  'body {\nwidth: 100%;\nheight: 50%;\nmargin: 0 !important;\nbackground-color: transparent;\ntransform: translate(10px, -20px) scale(.5);↓\n\n.my-hover:hover {\nbottom: -33.3333%;\nbox-shadow: 10px 10px 5px #888888;↓\n\n.my-style {\nmargin: 0.25rem 0.5rem 0.75rem;\ndisplay: flex;\njustify-content: space-between;\nbackdrop-filter: blur(4px) contrast(1.5);↓\n\n@media (min-width: 1536px) {\n.my-media{\ndisplay: grid;\ngrid-auto-flow: row dense;'
)

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>()
  const [cssCode, setCssCode] = useState<string>('')
  const [resultVals, setResultVals] = useState<ResultCode[]>([])
  const [demoEnded, setDemoEnded] = useState<boolean>(true)
  const [config, setConfig] = useState<TranslatorConfigCopy>(
    { ...defaultTranslatorConfig, customTheme: '{\n  "box-shadow": {\n    "10px 10px 5px #888888": "box-shadow-custom"\n  }\n}' }
  )
  const demoStringKey = useRef<string[]>(demoArray)

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
          resultVal: it.resultVal.split(' ').map((v) => {
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

  const handleChange = (val: string | undefined, event: any) => {
    setCssCode(val ?? '')
  }

  useEffect(() => {
    let customTheme
    try {
      customTheme = JSON.parse(config.customTheme.trim())
    } catch (error) { /* empty */ }
    const result = CssToTailwindTranslator(cssCode, { ...config, customTheme })
    if (result.code === 'SyntaxError') {
      toast.error(
        `[${specialAttribute.join(', ')}] syntax does not support conversion`,
        {
          toastId: 'SyntaxError'
        }
      )
    }
    setResultVals(result.data)
  }, [cssCode, config])

  const handleConfigChange = (v: TranslatorConfigCopy) => {
    localStorage.setItem('translator-config', JSON.stringify(v))
    setConfig(v)
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
      if (Date.now() - startTimeRef.current >= 32) {
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

  const themeChange = useCallback(() => {
    setIsDarkTheme((v) => !v)
  }, [])

  const setTheme = () => {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    setIsDarkTheme((localStorage.theme ?? 'dark') === 'dark')
    const c = localStorage.getItem('translator-config')
    c && setConfig(JSON.parse(c))
  }, [])

  useEffect(() => {
    if (isDarkTheme !== undefined) {
      localStorage.theme = isDarkTheme ? 'dark' : 'light'
    }
    setTheme()
  }, [isDarkTheme])

  return (
    <div className="lgx:grid lgx:grid-cols-2 lgx:grid-flow-row-dense h-dom-height max-lgx:overflow-y-auto">
      <ResultSection themeChange={themeChange} isDarkTheme={isDarkTheme} computedResultVals={computedResultVals} config={config} setConfig={handleConfigChange} />
      <section
        ref={editorContainerRef}
        className="lgx:h-full h-1/2 border-t-[1px] border-solid border-[#d9dce1] dark:border-transparent"
      >
        <Editor
          language="css"
          theme={isDarkTheme ? 'vs-dark' : 'light'}
          onChange={handleChange}
          value={''}
          onMount={handleEditorDidMount}
          loading={
            <div className="text-[#111827] dark:text-[#abb2bf] text-[37px]">Loading...</div>
          }
          options={{
            fontSize: 18
          }}
        />
      </section>
    </div>
  )
}
