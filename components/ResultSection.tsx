import clsx from 'clsx'
import FlipMove from 'react-flip-move'
import SimpleBar from 'simplebar-react'
import SvgDark from '@/assets/svg/dark.svg'
import SvgGitHub from '@/assets/svg/github.svg'
import SvgLight from '@/assets/svg/light.svg'
import { copyText } from '@/utils/index'

function ResultSection(props: {
  themeChange: () => void
  isDarkTheme?: boolean
  computedResultVals: ComputedResultCode[]
}) {
  const { themeChange, isDarkTheme, computedResultVals } = props
  return (
    <section className='font-[Consolas,_"Courier_New",_monospace] lgx:col-start-2 relative lgx:h-full max-lgx:h-1/2 overflow-y-auto text-[#111827] dark:text-[#abb2bf]'>
      <button
        onClick={themeChange}
        className="w-[60px] h-[32px] absolute right-[142px] top-[16px] rounded-[16px] border-solid border-[1px] dark:border-[rgba(82,82,89,.68)] dark:bg-[#313136] border-[rgba(60,60,67,.29)] bg-[#eeeeee]"
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
        <SvgGitHub className="absolute right-[88px] top-[16px]" width="32px" height="32px" color={isDarkTheme ? 'rgba(235, 235, 245, .6)' : 'rgba(60, 60, 67, .7)'} />
      </a>
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
  )
}

export default ResultSection
