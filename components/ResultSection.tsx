import Editor from '@monaco-editor/react'
import clsx from 'clsx'
import { useState } from 'react'
import FlipMove from 'react-flip-move'
import SimpleBar from 'simplebar-react'
import SvgDark from '@/assets/svg/dark.svg'
import SvgGitHub from '@/assets/svg/github.svg'
import SvgLight from '@/assets/svg/light.svg'
import { copyText } from '@/utils/index'

function ResultSection(props: {
  themeChange: () => void
  isDarkTheme?: boolean
  config: TranslatorConfigCopy
  setConfig: (v: TranslatorConfigCopy) => void
  computedResultVals: ComputedResultCode[]
}) {
  const { themeChange, isDarkTheme, computedResultVals, config, setConfig } = props
  const [configShow, setConfigShow] = useState<boolean>(false)
  return (
    <section className='font-[Consolas,_"Courier_New",_monospace] lgx:col-start-2 relative lgx:h-full max-lgx:h-1/2 overflow-y-auto text-[#111827] dark:text-[#abb2bf]'>
      <div className="absolute right-[16px] top-[16px] flex items-center">
        <div className="mr-[16px] relative z-10">
          <button onClick={() => setConfigShow(v => !v)} className="h-[32px] rounded-[16px] px-[12px] text-[16px] font-bold border-solid border-[1px] dark:border-[rgba(82,82,89,.68)] dark:bg-[#313136] border-[rgba(60,60,67,.29)] bg-[#eeeeee] filter hover:brightness-105 active:enabled:brightness-95">
            SetConfig
          </button>
          <ul className={clsx('absolute left-1/2 -bottom-[16px] transform translate-y-full -translate-x-1/2 dark:border-[#454545] border-[#c8c8c8] border-solid border-[1px] dark:bg-[#1e1e1e] bg-[#f3f3f3] rounded-[8px] pt-[16px] px-[16px] pb-[8px] before:content-[""] before:w-[8px] before:h-[8px] before:bg-inherit before:block before:absolute before:-top-[4px] before:[border:inherit] before:!border-b-transparent before:!border-r-transparent before:left-1/2 before:transform before:-translate-x-1/2 before:rotate-45 [&>li]:mb-[8px]', configShow ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
            <li className="flex items-center w-[300px]">
              <span>prefix:</span>
              <input value={config.prefix} onChange={e => setConfig({ ...config, prefix: e.target.value })} type="text" className="w-[220px] ml-[8px] py-[2px] px-[4px] dark:bg-[#0f0f0f] bg-[#ffffff] rounded-[4px] text-inherit outline-none border-[1px] border-solid border-transparent dark:focus:border-[#f3f3f3] focus:border-[#454545]" />
            </li>
            <li className="flex items-center">
              <span>useAllDefaultValues:</span>
              <input checked={config.useAllDefaultValues} onChange={e => setConfig({ ...config, useAllDefaultValues: e.target.checked })} type="checkbox" className="w-[20px] h-[20px] ml-[8px]" />
            </li>
            <li className="flex flex-col">
              <span>customTheme:</span>
              <div>
                <Editor
                  className="text-inherit outline-none border-[1px] border-solid dark:border-[#454545] border-[#c8c8c8]"
                  width={'100%'}
                  height={300}
                  language="json"
                  theme={isDarkTheme ? 'vs-dark' : 'light'}
                  onChange={v => setConfig({ ...config, customTheme: v ?? '' })}
                  defaultValue={config.customTheme}
                  options={{
                    fontSize: 18,
                    lineNumbers: 'off',
                    minimap: {
                      enabled: false
                    }
                  }}
                />
              </div>
            </li>
          </ul>
        </div>
        <button
          onClick={themeChange}
          className="mr-[16px] w-[60px] h-[32px] relative rounded-[16px] border-solid border-[1px] dark:border-[rgba(82,82,89,.68)] dark:bg-[#313136] border-[rgba(60,60,67,.29)] bg-[#eeeeee]"
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
        <a target="_blank" href="https://github.com/hymhub/css-to-tailwind" rel="noreferrer">
          <SvgGitHub width="32px" height="32px" color={isDarkTheme ? 'rgba(235, 235, 245, .6)' : 'rgba(60, 60, 67, .7)'} />
        </a>
      </div>
      <h2 className="m-[16px] lgx:text-center text-[22px] font-bold h-[32px]">
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
                className="dark:bg-[#41454e] bg-[#f6f6f7] [border:1px_solid_rgba(60,60,67,.29)] dark:[border:1px_solid_#1e1e1e] p-[8px_16px] font-bold text-[18px] cursor-pointer filter hover:brightness-105 active:enabled:brightness-95 rounded-[4px]"
                onClick={() => {
                  copyText(it.resultVal.map(v => v.val).join(' '))
                }}
              >
                Copy {it.selectorName} Result Code
              </button>
              <p className="text-[18px] leading-[30px] mb-[16px] mt-[8px]">
                <span className="font-bold block mb-[8px]">
                  {it.selectorName} Result Code:{' '}
                </span>
                <FlipMove
                  className="dark:bg-[#1e1e1e] bg-[#e8e8e8] dark:text-[#b5cea8] text-[#098658] rounded-[2px] pt-[6px] pr-[10px] pl-[2px] inline-flex flex-wrap"
                  typeName="span"
                  enterAnimation="accordionHorizontal"
                  leaveAnimation="accordionHorizontal"
                  duration={200}
                >
                  {it.resultVal.map((v) => (
                    <span
                      className="ml-[8px] h-[22px] max-w-[90vw] lgx:max-w-[40vw] inline-block overflow-hidden text-ellipsis leading-[22px] mb-[6px] whitespace-nowrap"
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
  )
}

export default ResultSection
