import { useEffect, useState } from 'react'
// ['@media', ''],
// JSON.stringify(Array.from(document.getElementsByTagName('tbody')[0].children).map(el => ({
//   [el.children[1].innerHTML.split(':')[1].trim().slice(0, -1)]: el.children[0].innerHTML
// })).reduce((pre, cur) => {
//   pre[Object.keys(cur)[0]] = Object.values(cur)[0]
//   return pre
// }, {})).slice(1, -1)

export const specialAttribute = [
  '@charset',
  '@font-face',
  '@import',
  '@keyframes'
]

const hasNegative = (val: string): ['-' | '', string] => [val[0] === '-' ? '-' : '', val[0] === '-' ? val.slice(1) : val]
const getCustomVal = (val: string) => {
  val = val.replace(/\s/g, '_')
  for (let index = 1; index < val.length; index) {
    const char = val[index]
    if (char === '_' && char === val[index - 1]) {
      val = val.slice(0, index) + val.slice(index + 1)
    } else {
      index++
    }
  }
  return val
}
const propertyMap = new Map<string, Record<string, string> | ((val: string) => string)>([
  [
    'align-content',
    {
      'center': 'content-center',
      'flex-start': 'content-start',
      'flex-end': 'content-end',
      'space-between': 'content-between',
      'space-around': 'content-around',
      'space-evenly': 'content-evenly'
    }
  ],
  [
    'align-items',
    {
      'flex-start': 'items-start', 'flex-end': 'items-end', 'center': 'items-center', 'baseline': 'items-baseline', 'stretch': 'items-stretch'
    }
  ],
  [
    'align-self',
    {
      'auto': 'self-auto', 'flex-start': 'self-start', 'flex-end': 'self-end', 'center': 'self-center', 'stretch': 'self-stretch', 'baseline': 'self-baseline'
    }
  ],
  [
    'all',
    {
      'initial': '[all:initial]',
      'inherit': '[all:inherit]',
      'unset': '[all:unset]'
    }
  ],
  [
    'animation',
    val => ({ 'none': 'animate-none' }[val] ?? `animate-[${getCustomVal(val)}]`)
  ],
  [
    'animation-delay',
    val => (`[animation-delay:${getCustomVal(val)}]`)
  ],
  [
    'animation-direction',
    val => (`[animation-direction:${getCustomVal(val)}]`)
  ],
  [
    'animation-duration',
    val => (`[animation-duration:${getCustomVal(val)}]`)
  ],
  [
    'animation-fill-mode',
    val => (`[animation-fill-mode:${getCustomVal(val)}]`)
  ],
  [
    'animation-iteration-count',
    val => (`[animation-iteration-count:${getCustomVal(val)}]`)
  ],
  [
    'animation-name',
    val => (`[animation-name:${getCustomVal(val)}]`)
  ],
  [
    'animation-play-state',
    val => (`[animation-play-state:${getCustomVal(val)}]`)
  ],
  [
    'animation-timing-function',
    val => (`[animation-timing-function:${getCustomVal(val)}]`)
  ],
  [
    'appearance',
    val => ({ 'none': 'appearance-none' }[val] ?? `[appearance:${getCustomVal(val)}]`)
  ],
  [
    'aspect-ratio',
    val => (`[aspect-ratio:${getCustomVal(val)}]`)
  ],
  [
    'backdrop-filter',
    val => {
      const defaultVal = { 'none': 'backdrop-filter-none' }[val]
      if (defaultVal) {
        return defaultVal
      }

      const backdropFilterValConfig: Record<string, ((v: string) => string)> = {
        blur: (v: string) => `backdrop-blur-[${v}]`,
        brightness: (v: string) => `backdrop-brightness-[${v}]`,
        contrast: (v: string) => `contrast-[${v}]`,
        grayscale: (v: string) => `backdrop-grayscale-[${v}]`,
        'hue-rotate': (v: string) => {
          const t = hasNegative(v)
          return `${t[0]}backdrop-hue-rotate-[${t[1]}]`
        },
        invert: (v: string) => `backdrop-invert-[${v}]`,
        opacity: (v: string) => `backdrop-opacity-[${v}]`,
        saturate: (v: string) => `backdrop-saturate-[${v}]`,
        sepia: (v: string) => `backdrop-sepia-[${v}]`
      }
      const vals = getCustomVal(val).replace(/\(.+?\)/g, v => v.replace(/_/g, '')).split(')_').map(v => `${v})`)
      vals[vals.length - 1] = vals[vals.length - 1].slice(0, -1)

      return `backdrop-filter ${vals.map(v => v.replace(/^([a-z-]+)\((.+?)\)$/, (r, k: string, v) => backdropFilterValConfig[k](v))).join(' ')}`
    }
  ],
  [
    'backface-visibility',
    {

    }
  ],
  [
    'background',
    {

    }
  ],
  [
    'background-attachment',
    {

    }
  ],
  [
    'background-blend-mode',
    {

    }
  ],
  [
    'background-clip',
    {

    }
  ],
  [
    'background-color',
    {

    }
  ],
  [
    'background-image',
    {

    }
  ],
  [
    'background-origin',
    {

    }
  ],
  [
    'background-position',
    {

    }
  ],
  [
    'background-repeat',
    {

    }
  ],
  [
    'background-size',
    {

    }
  ],
  [
    'border',
    {

    }
  ],
  [
    'border-bottom',
    {

    }
  ],
  [
    'border-bottom-color',
    {

    }
  ],
  [
    'border-bottom-left-radius',
    {

    }
  ],
  [
    'border-bottom-right-radius',
    {

    }
  ],
  [
    'border-bottom-style',
    {

    }
  ],
  [
    'border-bottom-width',
    {

    }
  ],
  [
    'border-collapse',
    {

    }
  ],
  [
    'border-color',
    {

    }
  ],
  [
    'border-image',
    {

    }
  ],
  [
    'border-image-outset',
    {

    }
  ],
  [
    'border-image-repeat',
    {

    }
  ],
  [
    'border-image-slice',
    {

    }
  ],
  [
    'border-image-source',
    {

    }
  ],
  [
    'border-image-width',
    {

    }
  ],
  [
    'border-left',
    {

    }
  ],
  [
    'border-left-color',
    {

    }
  ],
  [
    'border-left-style',
    {

    }
  ],
  [
    'border-left-width',
    {

    }
  ],
  [
    'border-radius',
    {

    }
  ],
  [
    'border-right',
    {

    }
  ],
  [
    'border-right-color',
    {

    }
  ],
  [
    'border-right-style',
    {

    }
  ],
  [
    'border-right-width',
    {

    }
  ],
  [
    'border-spacing',
    {

    }
  ],
  [
    'border-style',
    {

    }
  ],
  [
    'border-top',
    {

    }
  ],
  [
    'border-top-color',
    {

    }
  ],
  [
    'border-top-left-radius',
    {

    }
  ],
  [
    'border-top-right-radius',
    {

    }
  ],
  [
    'border-top-style',
    {

    }
  ],
  [
    'border-top-width',
    {

    }
  ],
  [
    'border-width',
    {

    }
  ],
  [
    'bottom',
    {

    }
  ],
  [
    'box-align',
    {

    }
  ],
  [
    'box-direction',
    {

    }
  ],
  [
    'box-flex',
    {

    }
  ],
  [
    'box-flex-group',
    {

    }
  ],
  [
    'box-lines',
    {

    }
  ],
  [
    'box-ordinal-group',
    {

    }
  ],
  [
    'box-orient',
    {

    }
  ],
  [
    'box-pack',
    {

    }
  ],
  [
    'box-shadow',
    {

    }
  ],
  [
    'box-sizing',
    {

    }
  ],
  [
    'caption-side',
    {

    }
  ],
  [
    'clear',
    {

    }
  ],
  [
    'clip',
    {

    }
  ],
  [
    'clip-path',
    {

    }
  ],
  [
    'color',
    {

    }
  ],
  [
    'color-scheme',
    {

    }
  ],
  [
    'column-count',
    {

    }
  ],
  [
    'column-fill',
    {

    }
  ],
  [
    'column-gap',
    {

    }
  ],
  [
    'column-rule',
    {

    }
  ],
  [
    'column-rule-color',
    {

    }
  ],
  [
    'column-rule-style',
    {

    }
  ],
  [
    'column-rule-width',
    {

    }
  ],
  [
    'column-span',
    {

    }
  ],
  [
    'column-width',
    {

    }
  ],
  [
    'columns',
    {

    }
  ],
  [
    'contain-intrinsic-size',
    {

    }
  ],
  [
    'content',
    {

    }
  ],
  [
    'content-visibility',
    {

    }
  ],
  [
    'counter-increment',
    {

    }
  ],
  [
    'counter-reset',
    {

    }
  ],
  [
    'counter-set',
    {

    }
  ],
  [
    'cursor',
    {

    }
  ],
  [
    'direction',
    {

    }
  ],
  [
    'display',
    {

    }
  ],
  [
    'empty-cells',
    {

    }
  ],
  [
    'fill',
    {

    }
  ],
  [
    'filter',
    {

    }
  ],
  [
    'flex',
    {

    }
  ],
  [
    'flex-basis',
    {

    }
  ],
  [
    'flex-direction',
    {

    }
  ],
  [
    'flex-flow',
    {

    }
  ],
  [
    'flex-grow',
    {

    }
  ],
  [
    'flex-shrink',
    {

    }
  ],
  [
    'flex-wrap',
    {

    }
  ],
  [
    'float',
    {

    }
  ],
  [
    'font',
    {

    }
  ],
  [
    'font-family',
    {

    }
  ],
  [
    'font-size',
    {

    }
  ],
  [
    'font-size-adjust',
    {

    }
  ],
  [
    'font-stretch',
    {

    }
  ],
  [
    'font-style',
    {

    }
  ],
  [
    'font-variant',
    {

    }
  ],
  [
    'font-variant-numeric',
    {

    }
  ],
  [
    'font-variation-settings',
    {

    }
  ],
  [
    'font-weight',
    {

    }
  ],
  [
    'gap',
    {

    }
  ],
  [
    'grid',
    {

    }
  ],
  [
    'grid-area',
    {

    }
  ],
  [
    'grid-auto-columns',
    {

    }
  ],
  [
    'grid-auto-flow',
    {

    }
  ],
  [
    'grid-auto-rows',
    {

    }
  ],
  [
    'grid-column',
    {

    }
  ],
  [
    'grid-column-end',
    {

    }
  ],
  [
    'grid-column-gap',
    {

    }
  ],
  [
    'grid-column-start',
    {

    }
  ],
  [
    'grid-gap',
    {

    }
  ],
  [
    'grid-row',
    {

    }
  ],
  [
    'grid-row-end',
    {

    }
  ],
  [
    'grid-row-gap',
    {

    }
  ],
  [
    'grid-row-start',
    {

    }
  ],
  [
    'grid-rows',
    {

    }
  ],
  [
    'grid-template',
    {

    }
  ],
  [
    'grid-template-areas',
    {

    }
  ],
  [
    'grid-template-columns',
    {

    }
  ],
  [
    'grid-template-rows',
    {

    }
  ],
  [
    'hanging-punctuation',
    {

    }
  ],
  [
    'height',
    {

    }
  ],
  [
    'icon',
    {

    }
  ],
  [
    'image-orientation',
    {

    }
  ],
  [
    'justify-content',
    {

    }
  ],
  [
    'justify-items',
    {

    }
  ],
  [
    'justify-self',
    {

    }
  ],
  [
    'left',
    {

    }
  ],
  [
    'letter-spacing',
    {

    }
  ],
  [
    'line-height',
    {

    }
  ],
  [
    'list-style',
    {

    }
  ],
  [
    'list-style-image',
    {

    }
  ],
  [
    'list-style-position',
    {

    }
  ],
  [
    'list-style-type',
    {

    }
  ],
  [
    'logical-height',
    {

    }
  ],
  [
    'logical-width',
    {

    }
  ],
  [
    'margin',
    {

    }
  ],
  [
    'margin-bottom',
    {

    }
  ],
  [
    'margin-left',
    {

    }
  ],
  [
    'margin-right',
    {

    }
  ],
  [
    'margin-top',
    {

    }
  ],
  [
    'mask',
    {

    }
  ],
  [
    'mask-clip',
    {

    }
  ],
  [
    'mask-composite',
    {

    }
  ],
  [
    'mask-image',
    {

    }
  ],
  [
    'mask-origin',
    {

    }
  ],
  [
    'mask-position',
    {

    }
  ],
  [
    'mask-repeat',
    {

    }
  ],
  [
    'mask-size',
    {

    }
  ],
  [
    'max-height',
    {

    }
  ],
  [
    'max-width',
    {

    }
  ],
  [
    'min-height',
    {

    }
  ],
  [
    'min-width',
    {

    }
  ],
  [
    'mix-blend-mode',
    {

    }
  ],
  [
    'nav-down',
    {

    }
  ],
  [
    'nav-index',
    {

    }
  ],
  [
    'nav-left',
    {

    }
  ],
  [
    'nav-right',
    {

    }
  ],
  [
    'nav-up',
    {

    }
  ],
  [
    'object-fit',
    {

    }
  ],
  [
    'object-position',
    {

    }
  ],
  [
    'opacity',
    {

    }
  ],
  [
    'order',
    {

    }
  ],
  [
    'outline',
    {

    }
  ],
  [
    'outline-color',
    {

    }
  ],
  [
    'outline-offset',
    {

    }
  ],
  [
    'outline-style',
    {

    }
  ],
  [
    'outline-width',
    {

    }
  ],
  [
    'overflow',
    {

    }
  ],
  [
    'overflow-anchor',
    {

    }
  ],
  [
    'overflow-wrap',
    {

    }
  ],
  [
    'overflow-x',
    {

    }
  ],
  [
    'overflow-y',
    {

    }
  ],
  [
    'overscroll-behavior',
    {

    }
  ],
  [
    'overscroll-behavior-x',
    {

    }
  ],
  [
    'overscroll-behavior-y',
    {

    }
  ],
  [
    'padding',
    {

    }
  ],
  [
    'padding-bottom',
    {

    }
  ],
  [
    'padding-left',
    {

    }
  ],
  [
    'padding-right',
    {

    }
  ],
  [
    'padding-top',
    {

    }
  ],
  [
    'page-break-after',
    {

    }
  ],
  [
    'page-break-before',
    {

    }
  ],
  [
    'page-break-inside',
    {

    }
  ],
  [
    'perspective',
    {

    }
  ],
  [
    'perspective-origin',
    {

    }
  ],
  [
    'place-content',
    {

    }
  ],
  [
    'place-items',
    {

    }
  ],
  [
    'place-self',
    {

    }
  ],
  [
    'pointer-events',
    {

    }
  ],
  [
    'position',
    {

    }
  ],
  [
    'punctuation-trim',
    {

    }
  ],
  [
    'quotes',
    {

    }
  ],
  [
    'resize',
    {

    }
  ],
  [
    'right',
    {

    }
  ],
  [
    'rotation',
    {

    }
  ],
  [
    'row-gap',
    {

    }
  ],
  [
    'scroll-snap-align',
    {

    }
  ],
  [
    'scroll-snap-stop',
    {

    }
  ],
  [
    'scroll-snap-type',
    {

    }
  ],
  [
    'scrollbar-width',
    {

    }
  ],
  [
    'shape-image-threshold',
    {

    }
  ],
  [
    'shape-margin',
    {

    }
  ],
  [
    'shape-outside',
    {

    }
  ],
  [
    'stroke',
    {

    }
  ],
  [
    'stroke-width',
    {

    }
  ],
  [
    'tab-size',
    {

    }
  ],
  [
    'table-layout',
    {

    }
  ],
  [
    'target',
    {

    }
  ],
  [
    'target-name',
    {

    }
  ],
  [
    'target-new',
    {

    }
  ],
  [
    'target-position',
    {

    }
  ],
  [
    'text-align',
    {

    }
  ],
  [
    'text-align-last',
    {

    }
  ],
  [
    'text-decoration',
    {

    }
  ],
  [
    'text-decoration-color',
    {

    }
  ],
  [
    'text-decoration-line',
    {

    }
  ],
  [
    'text-decoration-skip-ink',
    {

    }
  ],
  [
    'text-decoration-style',
    {

    }
  ],
  [
    'text-emphasis-color',
    {

    }
  ],
  [
    'text-emphasis-position',
    {

    }
  ],
  [
    'text-emphasis-style',
    {

    }
  ],
  [
    'text-indent',
    {

    }
  ],
  [
    'text-justify',
    {

    }
  ],
  [
    'text-orientation',
    {

    }
  ],
  [
    'text-outline',
    {

    }
  ],
  [
    'text-overflow',
    {

    }
  ],
  [
    'text-shadow',
    {

    }
  ],
  [
    'text-transform',
    {

    }
  ],
  [
    'text-underline-offset',
    {

    }
  ],
  [
    'text-underline-position',
    {

    }
  ],
  [
    'text-wrap',
    {

    }
  ],
  [
    'top',
    {

    }
  ],
  [
    'transform',
    {

    }
  ],
  [
    'transform-origin',
    {

    }
  ],
  [
    'transform-style',
    {

    }
  ],
  [
    'transition',
    {

    }
  ],
  [
    'transition-delay',
    {

    }
  ],
  [
    'transition-duration',
    {

    }
  ],
  [
    'transition-property',
    {

    }
  ],
  [
    'transition-timing-function',
    {

    }
  ],
  [
    'unicode-bidi',
    {

    }
  ],
  [
    'user-select',
    {

    }
  ],
  [
    'vertical-align',
    {

    }
  ],
  [
    'visibility',
    {

    }
  ],
  [
    'white-space',
    {

    }
  ],
  [
    'width',
    {

    }
  ],
  [
    'word-break',
    {

    }
  ],
  [
    'word-spacing',
    {

    }
  ],
  [
    'word-wrap',
    {

    }
  ],
  [
    'writing-mode',
    {

    }
  ],
  [
    'z-index',
    {

    }
  ]
])

interface CssCodeParse {
  selectorName: string
  cssCode: string | CssCodeParse[]
}

const parsingCode = (code: string): CssCodeParse[] => {
  code = code.replace(/[\n\r]/g, '').trim()
  const tmpCodes: CssCodeParse[] = []
  let index = 0
  let isSelectorName = true
  let bracketsCount = 0
  for (let i = 0; i < code.length; i++) {
    const char = code[i]
    if (['{', '}'].includes(char)) {
      if (char === '{') {
        if (bracketsCount++ === 0) {
          isSelectorName = false
        } else {
          tmpCodes[index][isSelectorName ? 'selectorName' : 'cssCode'] += char
        }
      } else {
        if (--bracketsCount === 0) {
          const cssCode = tmpCodes[index].cssCode
          if (typeof cssCode === 'string' && cssCode.includes('{')) {
            tmpCodes[index].cssCode = parsingCode(cssCode)
          }
          index++
          isSelectorName = true
        } else {
          tmpCodes[index][isSelectorName ? 'selectorName' : 'cssCode'] += char
        }
      }
    } else {
      if (!tmpCodes[index]) {
        tmpCodes[index] = {
          selectorName: '',
          cssCode: ''
        }
      }
      tmpCodes[index][isSelectorName ? 'selectorName' : 'cssCode'] += char
    }
  }
  return tmpCodes.map(v => ({
    selectorName: v.selectorName.trim(),
    cssCode: typeof v.cssCode === 'string' ? v.cssCode.trim() : v.cssCode
  }))
}

export const CssToTailwindTranslator = (code: string): {
  code: 'SyntaxError' | 'OK'
  data: ResultCode[]
} => {
  if (specialAttribute.map(v => code.includes(v)).filter(v => v).length > 0) {
    return {
      code: 'SyntaxError',
      data: []
    }
  }
  return {
    code: 'OK',
    data: parsingCode(code).map(it => {
      if (typeof it.cssCode === 'string') {
        const cssCodeList = it.cssCode.split(';')
        cssCodeList[cssCodeList.length - 1] = cssCodeList[cssCodeList.length - 1].slice(0, -1)
        console.log('====================================')
        console.log(cssCodeList)
        console.log('====================================')
        const resultVals = cssCodeList.map(v => {
          let key = ''
          let val = ''
          for (let i = 0; i < v.length; i++) {
            const c = v[i]
            if (c !== ':') {
              key += c
            } else {
              val = v.slice(i + 1, v.length).trim()
              break
            }
          }
          const pipe = propertyMap.get(key.trim())
          console.log('===val=====')
          console.log(val)
          console.log('val========')
          return typeof pipe === 'function' ? pipe(val) : (pipe?.[val] ?? '')
        }).filter(v => v !== '')
        return {
          selectorName: it.selectorName,
          resultVal: [...new Set(resultVals)].join(' ')
        }
      } else if (it.selectorName.includes('@media')) {
        // media developing...
        return {
          selectorName: it.selectorName,
          resultVal: 'media developing...'
        }
      } else {
        return null
      }
    }).filter(v => v !== null) as ResultCode[]
  }
}
