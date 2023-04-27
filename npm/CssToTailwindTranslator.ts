export interface ResultCode {
  selectorName: string
  resultVal: string
}

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
const isColor = (str: string, joinLinearGradient = false) => {
  const namedColors = [
    'initial',
    'inherit',
    'currentColor',
    'currentcolor',
    'transparent',
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'black',
    'blanchedalmond',
    'blue',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgrey',
    'darkgreen',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'fuchsia',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'gray',
    'grey',
    'green',
    'greenyellow',
    'honeydew',
    'hotpink',
    'indianred',
    'indigo',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgrey',
    'lightgreen',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
    'lightsteelblue',
    'lightyellow',
    'lime',
    'limegreen',
    'linen',
    'magenta',
    'maroon',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'navy',
    'oldlace',
    'olive',
    'olivedrab',
    'orange',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'purple',
    'rebeccapurple',
    'red',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'silver',
    'skyblue',
    'slateblue',
    'slategray',
    'slategrey',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'teal',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'wheat',
    'white',
    'whitesmoke',
    'yellow',
    'yellowgreen'
  ]
  const regexp = /^\s*#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\s*$|^\s*rgb\(\s*(\d{1,3}|[a-z]+)\s*,\s*(\d{1,3}|[a-z]+)\s*,\s*(\d{1,3}|[a-z]+)\s*\)\s*$|^\s*rgba\(\s*(\d{1,3}|[a-z]+)\s*,\s*(\d{1,3}|[a-z]+)\s*,\s*(\d{1,3}|[a-z]+)\s*,\s*(\d*(\.\d+)?)\s*\)\s*$|^\s*hsl\(\s*(\d+)\s*,\s*(\d*(\.\d+)?%)\s*,\s*(\d*(\.\d+)?%)\)\s*$|^\s*hsla\((\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*(\d*(\.\d+)?)\)\s*$/i
  return regexp.test(str) || namedColors.includes(str) || (joinLinearGradient && /^\s*linear-gradient\([\w\W]+?\)\s*$/.test(str))
}

const isUnit = (str: string) => {
  return [
    'em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax',
    'cm', 'mm', 'in', 'pt', 'pc', 'px',
    'deg', 'grad', 'rad', 'turn', 'ms', 's', 'Hz', 'kHz',
    '%', 'length', 'inherit', 'thick', 'medium', 'thin', 'initial', 'auto'
  ].includes(str.replace(/[.\d\s-]/g, '')) || /^[-.\d]+$/.test(str.trim())
}

enum CustomSelect {
  auto = 'auto',
  vh = '100vh',
  vw = '100vw',
}

const getUnitMetacharactersVal = (val: string, excludes: CustomSelect[] = []): string | undefined => {
  if (/^\d+\.\d+%$/.test(val)) {
    val = `${Number(val.slice(0, -1)).toFixed(6).replace(/(\.\d{2})\d+/, '$1')}%`
  }
  const config: Record<string, string> = {
    'auto': 'auto',
    '50%': '1/2',
    '33.33%': '1/3',
    '66.66%': '2/3',
    '25%': '1/4',
    '75%': '3/4',
    '20%': '1/5',
    '40%': '2/5',
    '60%': '3/5',
    '80%': '4/5',
    '16.66%': '1/6',
    '83.33%': '5/6',
    '8.33%': '1/12',
    '41.66%': '5/12',
    '58.33%': '7/12',
    '91.66%': '11/12',
    '100%': 'full',
    '100vw': 'screen',
    '100vh': 'screen',
    'min-content': 'min',
    'max-content': 'max'
  }
  excludes.forEach(key => {
    delete config[key]
  })
  return config[val]
}

const propertyMap: Map<string, Record<string, string> | ((val: string) => string)> = new Map<string, Record<string, string> | ((val: string) => string)>([
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

      let canUse = true
      const res = vals.map(v => {
        let canUsePipeV = false
        const pipeV = v.replace(/^([a-zA-Z0-9_-]+)\((.+?)\)$/, (r, k: string, v) => {
          canUsePipeV = true
          return backdropFilterValConfig[k]?.(v) ?? (canUse = false)
        })
        return canUsePipeV ? pipeV : ''
      })
      return canUse ? `backdrop-filter ${[...new Set(res)].join(' ')}` : `[backdrop-filter:${getCustomVal(val)}]`
    }
  ],
  [
    'backface-visibility',
    {
      'visible': '[backface-visibility:visible]',
      'hidden': '[backface-visibility:hidden]'
    }
  ],
  [
    'background',
    val => {
      const legalConfig: Record<string, string> = {
        ...propertyMap.get('background-attachment'),
        ...propertyMap.get('background-repeat'),
        'transparent': 'bg-transparent', 'currentColor': 'bg-current', 'currentcolor': 'bg-current', 'none': 'bg-none',
        'bottom': 'bg-bottom', 'center': 'bg-center', 'left': 'bg-left', 'left bottom': 'bg-left-bottom', 'left top': 'bg-left-top', 'right': 'bg-right', 'right bottom': 'bg-right-bottom', 'right top': 'bg-right-top', 'top': 'bg-top', 'auto': 'bg-auto', 'cover': 'bg-cover', 'contain': 'bg-contain'
      }
      return legalConfig[val] ?? `bg-[${getCustomVal(val)}]`
    }
  ],
  [
    'background-attachment',
    {
      'fixed': 'bg-fixed', 'local': 'bg-local', 'scroll': 'bg-scroll'
    }
  ],
  [
    'background-blend-mode',
    {
      'normal': 'bg-blend-normal', 'multiply': 'bg-blend-multiply', 'screen': 'bg-blend-screen', 'overlay': 'bg-blend-overlay', 'darken': 'bg-blend-darken', 'lighten': 'bg-blend-lighten', 'color-dodge': 'bg-blend-color-dodge', 'color-burn': 'bg-blend-color-burn', 'hard-light': 'bg-blend-hard-light', 'soft-light': 'bg-blend-soft-light', 'difference': 'bg-blend-difference', 'exclusion': 'bg-blend-exclusion', 'hue': 'bg-blend-hue', 'saturation': 'bg-blend-saturation', 'color': 'bg-blend-color', 'luminosity': 'bg-blend-luminosity'
    }
  ],
  [
    'background-clip',
    {
      'border-box': 'bg-clip-border', 'padding-box': 'bg-clip-padding', 'content-box': 'bg-clip-content', 'text': 'bg-clip-text'
    }
  ],
  [
    'background-color',
    val => ({ 'transparent': 'bg-transparent', 'currentColor': 'bg-current', 'currentcolor': 'bg-current' }[val] ?? (isColor(val, true) ? `bg-[${getCustomVal(val)}]` : ''))
  ],
  [
    'background-image',
    val => ({ 'none': 'bg-none' }[val] ?? `bg-[${getCustomVal(val)}]`)
  ],
  [
    'background-origin',
    {
      'border-box': 'bg-origin-border', 'padding-box': 'bg-origin-padding', 'content-box': 'bg-origin-content'
    }
  ],
  [
    'background-position',
    val => ({
      'bottom': 'bg-bottom', 'center': 'bg-center', 'left': 'bg-left', 'left bottom': 'bg-left-bottom', 'left top': 'bg-left-top', 'right': 'bg-right', 'right bottom': 'bg-right-bottom', 'right top': 'bg-right-top', 'top': 'bg-top'
    }[val] ?? `bg-[${getCustomVal(val)}]`)
  ],
  [
    'background-repeat',
    {
      'repeat': 'bg-repeat', 'no-repeat': 'bg-no-repeat', 'repeat-x': 'bg-repeat-x', 'repeat-y': 'bg-repeat-y', 'round': 'bg-repeat-round', 'space': 'bg-repeat-space'
    }
  ],
  [
    'background-size',
    val => ({
      'auto': 'bg-auto', 'cover': 'bg-cover', 'contain': 'bg-contain'
    }[val] ?? `[background-size:${getCustomVal(val)}]`)
  ],
  [
    'border',
    val => {
      val = val.replace(/\(.+?\)/, v => v.replace(/\s/g, ''))
      const vals: string = val.split(' ').filter(v => v !== '').map(v => (isUnit(v) || isColor(v)) ? ({ 'transparent': 'border-transparent', 'currentColor': 'border-current', 'currentcolor': 'border-current' }[val] ?? `border-[${v}]`) : ((propertyMap.get('border-style') as Record<string, string>)[v] ?? '')).filter(v => v !== '').join(' ')
      return vals
    }
  ],
  [
    'border-bottom',
    val => {
      if (isUnit(val)) {
        return `border-b-[${getCustomVal(val)}]`
      } else {
        return `[border-bottom:${getCustomVal(val)}]`
      }
    }
  ],
  [
    'border-bottom-color',
    val => (isColor(val, true) ? `[border-bottom-color:${getCustomVal(val)}]` : '')
  ],
  [
    'border-bottom-left-radius',
    val => ({ '0': 'rounded-bl-none', '0px': 'rounded-bl-none' }[val] ?? (isUnit(val) ? `rounded-bl-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-bottom-right-radius',
    val => ({ '0': 'rounded-br-none', '0px': 'rounded-br-none' }[val] ?? (isUnit(val) ? `rounded-br-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-bottom-style',
    val => ((propertyMap.get('border-style') as Record<string, string>)[val] ? `[border-bottom-style:${val}]` : '')
  ],
  [
    'border-bottom-width',
    val => ((isUnit(val) ? `border-b-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-collapse',
    {
      'collapse': 'border-collapse', 'separate': 'border-separate'
    }
  ],
  [
    'border-color',
    val => ({
      'transparent': 'border-transparent', 'currentColor': 'border-current', 'currentcolor': 'border-current'
    }[val] ?? (isColor(val) ? `border-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-image',
    val => (`[border-image:${getCustomVal(val)}]`)
  ],
  [
    'border-image-outset',
    val => (`[border-image-outset:${getCustomVal(val)}]`)
  ],
  [
    'border-image-repeat',
    val => (`[border-image-repeat:${getCustomVal(val)}]`)
  ],
  [
    'border-image-slice',
    val => (`[border-image-slice:${getCustomVal(val)}]`)
  ],
  [
    'border-image-source',
    val => (`[border-image-source:${getCustomVal(val)}]`)
  ],
  [
    'border-image-width',
    val => (isUnit(val) ? `[border-image-width:${getCustomVal(val)}]` : '')
  ],
  [
    'border-left',
    val => {
      if (isUnit(val)) {
        return `border-l-[${getCustomVal(val)}]`
      } else {
        return `[border-left:${getCustomVal(val)}]`
      }
    }
  ],
  [
    'border-left-color',
    val => (isColor(val, true) ? `[border-left-color:${getCustomVal(val)}]` : '')
  ],
  [
    'border-left-style',
    val => ((propertyMap.get('border-style') as Record<string, string>)[val] ? `[border-left-style:${val}]` : '')
  ],
  [
    'border-left-width',
    val => ((isUnit(val) ? `border-l-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-radius',
    val => {
      const r = ({ '0': 'rounded-none', '0px': 'rounded-none' }[val])
      if (r) {
        return r
      }
      if (val.includes('/')) {
        return `rounded-[${getCustomVal(val)}]`
      }
      const vals = val.split(' ').filter(v => v !== '')
      if (vals.filter(v => !isUnit(v)).length > 0) {
        return ''
      }
      if (vals.length === 1) {
        return `rounded-[${vals[0]}]`
      } else if (vals.length === 2) {
        return `rounded-tl-[${vals[0]}] rounded-br-[${vals[0]}] rounded-tr-[${vals[1]}] rounded-bl-[${vals[1]}]`
      } else if (vals.length === 3) {
        return `rounded-tl-[${vals[0]}] rounded-br-[${vals[2]}] rounded-tr-[${vals[1]}] rounded-bl-[${vals[1]}]`
      } else if (vals.length === 4) {
        return `rounded-tl-[${vals[0]}] rounded-br-[${vals[2]}] rounded-tr-[${vals[1]}] rounded-bl-[${vals[3]}]`
      }
      return ''
    }
  ],
  [
    'border-right',
    val => {
      if (isUnit(val)) {
        return `border-r-[${getCustomVal(val)}]`
      } else {
        return `[border-right:${getCustomVal(val)}]`
      }
    }
  ],
  [
    'border-right-color',
    val => (isColor(val, true) ? `[border-right-color:${getCustomVal(val)}]` : '')
  ],
  [
    'border-right-style',
    val => ((propertyMap.get('border-style') as Record<string, string>)[val] ? `[border-right-style:${val}]` : '')
  ],
  [
    'border-right-width',
    val => ((isUnit(val) ? `border-r-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-spacing',
    val => ((isUnit(val) ? `[border-spacing:${getCustomVal(val)}]` : ''))
  ],
  [
    'border-style',
    {
      'solid': 'border-solid', 'dashed': 'border-dashed', 'dotted': 'border-dotted', 'double': 'border-double', 'none': 'border-none'
    }
  ],
  [
    'border-top',
    val => {
      if (isUnit(val)) {
        return `border-t-[${getCustomVal(val)}]`
      } else {
        return `[border-top:${getCustomVal(val)}]`
      }
    }
  ],
  [
    'border-top-color',
    val => (isColor(val, true) ? `[border-top-color:${getCustomVal(val)}]` : '')
  ],
  [
    'border-top-left-radius',
    val => ({ '0': 'rounded-tl-none', '0px': 'rounded-tl-none' }[val] ?? (isUnit(val) ? `rounded-tl-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-top-right-radius',
    val => ({ '0': 'rounded-tr-none', '0px': 'rounded-tr-none' }[val] ?? (isUnit(val) ? `rounded-tr-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-top-style',
    val => ((propertyMap.get('border-style') as Record<string, string>)[val] ? `[border-top-style:${val}]` : '')
  ],
  [
    'border-top-width',
    val => ((isUnit(val) ? `border-t-[${getCustomVal(val)}]` : ''))
  ],
  [
    'border-width',
    val => ((isUnit(val) ? `border-[${getCustomVal(val)}]` : ''))
  ],
  [
    'bottom',
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}bottom-${getUnitMetacharactersVal(t[1], [CustomSelect.vw, CustomSelect.vh]) || `[${t[1]}]`}` : '')
    }
  ],
  [
    'box-align',
    {
      'initial': '[box-align:initial]',
      'start': '[box-align:inherit]',
      'end': '[box-align:unset]',
      'center': '[box-align:unset]',
      'baseline': '[box-align:unset]',
      'stretch': '[box-align:unset]'
    }
  ],
  [
    'box-direction',
    {
      'initial': '[box-direction:initial]',
      'normal': '[box-direction:normal]',
      'reverse': '[box-direction:reverse]',
      'inherit': '[box-direction:inherit]'
    }
  ],
  [
    'box-flex',
    val => (`[box-flex:${getCustomVal(val)}]`)
  ],
  [
    'box-flex-group',
    val => (`[box-flex-group:${getCustomVal(val)}]`)
  ],
  [
    'box-lines',
    {
      'single': '[box-lines:single]', 'multiple': '[box-lines:multiple]', 'initial': '[box-lines:initial]'
    }
  ],
  [
    'box-ordinal-group',
    val => (`[box-ordinal-group:${getCustomVal(val)}]`)
  ],
  [
    'box-orient',
    {
      'horizontal': '[box-orient:horizontal]', 'vertical': '[box-orient:vertical]', 'inline-axis': '[box-orient:inline-axis]', 'block-axis': '[box-orient:block-axis]', 'inherit': '[box-orient:inherit]', 'initial': '[box-orient:initial]'
    }
  ],
  [
    'box-pack',
    {
      'start': '[box-pack:start]', 'end': '[box-pack:end]', 'center': '[box-pack:center]', 'justify': '[box-pack:justify]', 'initial': '[box-pack:initial]'
    }
  ],
  [
    'box-shadow',
    val => (`[box-shadow:${getCustomVal(val)}]`)
  ],
  [
    'box-sizing',
    {
      'border-box': 'box-border', 'content-box': 'box-content'
    }
  ],
  [
    'caption-side',
    {
      'top': '[caption-side:top]', 'bottom': '[caption-side:bottom]', 'inherit': '[caption-side:inherit]', 'initial': '[caption-side:initial]'
    }
  ],
  [
    'clear',
    {
      'left': 'clear-left', 'right': 'clear-right', 'both': 'clear-both', 'none': 'clear-none'
    }
  ],
  [
    'clip',
    val => (`[clip:${getCustomVal(val)}]`)
  ],
  [
    'clip-path',
    val => (`[clip-path:${getCustomVal(val)}]`)
  ],
  [
    'color',
    val => ({ 'transparent': 'text-transparent', 'currentColor': 'text-current', 'currentcolor': 'text-current' }[val] ?? (isColor(val, true) ? `text-[${getCustomVal(val)}]` : ''))
  ],
  [
    'color-scheme',
    val => (`[color-scheme:${getCustomVal(val)}]`)
  ],
  [
    'column-count',
    val => (`[column-count:${getCustomVal(val)}]`)
  ],
  [
    'column-fill',
    {
      'balance': '[column-fill:balance]', 'auto': '[column-fill:auto]', 'initial': '[column-fill:initial]'
    }
  ],
  [
    'column-gap',
    val => ({ '0': 'gap-x-0' }[val] ?? (isUnit(val) ? `gap-x-[${val}]` : ''))
  ],
  [
    'column-rule',
    val => (`[column-rule:${getCustomVal(val)}]`)
  ],
  [
    'column-rule-color',
    val => (isColor(val, true) ? `[column-rule-color:${getCustomVal(val)}]` : '')
  ],
  [
    'column-rule-style',
    {
      'none': '[column-rule-style:none]', 'hidden': '[column-rule-style:hidden]', 'dotted': '[column-rule-style:dotted]', 'dashed': '[column-rule-style:dashed]', 'solid': '[column-rule-style:solid]', 'double': '[column-rule-style:double]', 'groove': '[column-rule-style:groove]', 'ridge': '[column-rule-style:ridge]', 'inset': '[column-rule-style:inset]', 'outset': '[column-rule-style:outset]', 'initial': '[column-rule-style:initial]'
    }
  ],
  [
    'column-rule-width',
    val => ((isUnit(val) ? `[column-rule-width:${val}]` : ''))
  ],
  [
    'column-span',
    val => (`[column-span:${getCustomVal(val)}]`)
  ],
  [
    'column-width',
    val => ((isUnit(val) ? `[column-width:${val}]` : ''))
  ],
  [
    'columns',
    val => (`[columns:${getCustomVal(val)}]`)
  ],
  [
    'contain-intrinsic-size',
    val => (`[contain-intrinsic-size:${getCustomVal(val)}]`)
  ],
  [
    'content',
    val => (`content-[${getCustomVal(val)}]`)
  ],
  [
    'content-visibility',
    val => (`[content-visibility:${getCustomVal(val)}]`)
  ],
  [
    'counter-increment',
    val => (`[content-increment:${getCustomVal(val)}]`)
  ],
  [
    'counter-reset',
    val => (`[counter-reset:${getCustomVal(val)}]`)
  ],
  [
    'counter-set',
    val => (`[counter-set:${getCustomVal(val)}]`)
  ],
  [
    'cursor',
    {
      'auto': 'cursor-auto', 'default': 'cursor-default', 'pointer': 'cursor-pointer', 'wait': 'cursor-wait', 'text': 'cursor-text', 'move': 'cursor-move', 'help': 'cursor-help', 'not-allowed': 'cursor-not-allowed'
    }
  ],
  [
    'direction',
    {
      'ltr': '[direction:ltr]', 'rtl': '[direction:rtl]', 'inherit': '[direction:inherit]', 'initial': '[direction:initial]'
    }
  ],
  [
    'display',
    {
      'block': 'block', 'inline-block': 'inline-block', 'inline': 'inline', 'flex': 'flex', 'inline-flex': 'inline-flex', 'table': 'table', 'inline-table': 'inline-table', 'table-caption': 'table-caption', 'table-cell': 'table-cell', 'table-column': 'table-column', 'table-column-group': 'table-column-group', 'table-footer-group': 'table-footer-group', 'table-header-group': 'table-header-group', 'table-row-group': 'table-row-group', 'table-row': 'table-row', 'flow-root': 'flow-root', 'grid': 'grid', 'inline-grid': 'inline-grid', 'contents': 'contents', 'list-item': 'list-item', 'none': 'hidden'
    }
  ],
  [
    'empty-cells',
    {
      'hide': '[empty-cells:hide]', 'show': '[empty-cells:show]', 'inherit': '[empty-cells:inherit]', 'initial': '[empty-cells:initial]'
    }
  ],
  [
    'fill',
    val => ({ 'currentColor': 'fill-current', 'currentcolor': 'fill-current' }[val] ?? (isColor(val, true) ? `fill-[${getCustomVal(val)}]` : ''))
  ],
  [
    'filter',
    val => {
      const defaultVal = { 'none': 'filter-none' }[val]
      if (defaultVal) {
        return defaultVal
      }

      const backdropFilterValConfig: Record<string, ((v: string) => string)> = {
        blur: (v: string) => `blur-[${v}]`,
        brightness: (v: string) => `brightness-[${v}]`,
        contrast: (v: string) => `contrast-[${v}]`,
        grayscale: (v: string) => `grayscale-[${v}]`,
        'hue-rotate': (v: string) => {
          const t = hasNegative(v)
          return `${t[0]}hue-rotate-[${t[1]}]`
        },
        invert: (v: string) => `invert-[${v}]`,
        saturate: (v: string) => `saturate-[${v}]`,
        sepia: (v: string) => `sepia-[${v}]`
      }
      const vals = getCustomVal(val).replace(/\(.+?\)/g, v => v.replace(/_/g, '')).split(')_').map(v => `${v})`)
      vals[vals.length - 1] = vals[vals.length - 1].slice(0, -1)

      let canUse = true
      const res = vals.map(v => {
        let canUsePipeV = false
        const pipeV = v.replace(/^([a-zA-Z0-9_-]+)\((.+?)\)$/, (r, k: string, v) => {
          canUsePipeV = true
          return backdropFilterValConfig[k]?.(v) ?? (canUse = false)
        })
        return canUsePipeV ? pipeV : ''
      })
      return canUse ? `filter ${[...new Set(res)].join(' ')}` : `[filter:${getCustomVal(val)}]`
    }
  ],
  [
    'flex',
    val => ({ '1 1 0%': 'flex-1', '1 1 auto': 'flex-auto', '0 1 auto': 'flex-initial', 'none': 'flex-none' }[val] ?? `flex-[${getCustomVal(val)}]`)
  ],
  [
    'flex-basis',
    val => ((isUnit(val) ? `[flex-basis:${val}]` : ''))
  ],
  [
    'flex-direction',
    {
      'row': 'flex-row', 'row-reverse': 'flex-row-reverse', 'column': 'flex-col', 'column-reverse': 'flex-col-reverse'
    }
  ],
  [
    'flex-flow',
    val => (`[flex-flow:${getCustomVal(val)}]`)
  ],
  [
    'flex-grow',
    val => ((isUnit(val) ? ({ '0': 'flex-grow-0', '1': 'flex-grow' }[val] ?? `flex-grow-[${val}]`) : ''))
  ],
  [
    'flex-shrink',
    val => ((isUnit(val) ? ({ '0': 'flex-shrink-0', '1': 'flex-shrink' }[val] ?? `flex-shrink-[${val}]`) : ''))
  ],
  [
    'flex-wrap',
    {
      'wrap': 'flex-wrap', 'wrap-reverse': 'flex-wrap-reverse', 'nowrap': 'flex-nowrap'
    }
  ],
  [
    'float',
    {
      'right': 'float-right', 'left': 'float-left', 'none': 'float-none'
    }
  ],
  [
    'font',
    val => (`[font:${getCustomVal(val)}]`)
  ],
  [
    'font-family',
    val => (`font-[${getCustomVal(val)}]`)
  ],
  [
    'font-size',
    val => ((isUnit(val) ? `text-[${val}]` : ''))
  ],
  [
    'font-size-adjust',
    val => ((isUnit(val) ? `[font-size-adjust:${val}]` : ''))
  ],
  [
    '-webkit-font-smoothing',
    {
      'antialiased': 'antialiased', 'auto': 'subpixel-antialiased'
    }
  ],
  [
    '-moz-osx-font-smoothing',
    {
      'grayscale': 'antialiased', 'auto': 'subpixel-antialiased'
    }
  ],
  [
    'font-stretch',
    {
      'wider': '[font-stretch:wider]', 'narrower': '[font-stretch:narrower]', 'ultra-condensed': '[font-stretch:ultra-condensed]', 'extra-condensed': '[font-stretch:extra-condensed]', 'condensed': '[font-stretch:condensed]', 'semi-condensed': '[font-stretch:semi-condensed]', 'normal': '[font-stretch:normal]', 'semi-expanded': '[font-stretch:semi-expanded]', 'expanded': '[font-stretch:expanded]', 'extra-expanded': '[font-stretch:extra-expanded]', 'ultra-expanded': '[font-stretch:ultra-expanded]', 'inherit': '[font-stretch:inherit]', 'initial': '[font-stretch:initial]'
    }
  ],
  [
    'font-style',
    {
      'italic': 'italic', 'normal': 'not-italic'
    }
  ],
  [
    'font-variant',
    {
      'normal': '[font-variant:normal]', 'small-caps': '[font-variant:small-caps]', 'inherit': '[font-variant:inherit]', 'initial': '[font-variant:initial]'
    }
  ],
  [
    'font-variant-numeric',
    {
      'normal': 'normal-nums', 'ordinal': 'ordinal', 'slashed-zero': 'slashed-zero', 'lining-nums': 'lining-nums', 'oldstyle-nums': 'oldstyle-nums', 'proportional-nums': 'proportional-nums', 'tabular-nums': 'tabular-nums', 'diagonal-fractions': 'diagonal-fractions', 'stacked-fractions': 'stacked-fractions'
    }
  ],
  [
    'font-variation-settings',
    val => (`[font-variation-settings:${getCustomVal(val)}]`)
  ],
  [
    'font-weight',
    val => ((isUnit(val) ? `font-[${val}]` : ''))
  ],
  [
    'gap',
    val => ({ '0': 'gap-0' }[val] ?? (isUnit(val) ? `gap-[${val}]` : ''))
  ],
  [
    'grid',
    val => (`[grid:${getCustomVal(val)}]`)
  ],
  [
    'grid-area',
    val => (`[grid-area:${getCustomVal(val)}]`)
  ],
  [
    'grid-auto-columns',
    val => ({
      'auto': 'auto-cols-auto', 'min-content': 'auto-cols-min', 'max-content': 'auto-cols-max', 'minmax(0, 1fr)': 'auto-cols-fr'
    }[val] ?? `auto-cols-[${getCustomVal(val)}]`)
  ],
  [
    'grid-auto-flow',
    val => ({
      'row': 'grid-flow-row', 'column': 'grid-flow-col', 'row_dense': 'grid-flow-row-dense', 'column_dense': 'grid-flow-col-dense'
    }[getCustomVal(val)] ?? '')
  ],
  [
    'grid-auto-rows',
    val => ({
      'auto': 'auto-rows-auto', 'min-content': 'auto-rows-min', 'max-content': 'auto-rows-max', 'minmax(0, 1fr)': 'auto-rows-fr'
    }[val] ?? `auto-rows-[${getCustomVal(val)}]`)
  ],
  [
    'grid-column',
    val => ({
      'auto': 'col-auto',
      'span 1 / span 1': 'col-span-1',
      'span 2 / span 2': 'col-span-2',
      'span 3 / span 3': 'col-span-3',
      'span 4 / span 4': 'col-span-4',
      'span 5 / span 5': 'col-span-5',
      'span 6 / span 6': 'col-span-6',
      'span 7 / span 7': 'col-span-7',
      'span 8 / span 8': 'col-span-8',
      'span 9 / span 9': 'col-span-9',
      'span 10 / span 10': 'col-span-10',
      'span 11 / span 11': 'col-span-11',
      'span 12 / span 12': 'col-span-12',
      '1 / -1': 'col-span-full'
    }[val] ?? `col-[${getCustomVal(val)}]`)
  ],
  [
    'grid-column-end',
    val => ({
      '1': 'col-end-1',
      '2': 'col-end-2',
      '3': 'col-end-3',
      '4': 'col-end-4',
      '5': 'col-end-5',
      '6': 'col-end-6',
      '7': 'col-end-7',
      '8': 'col-end-8',
      '9': 'col-end-9',
      '10': 'col-end-10',
      '11': 'col-end-11',
      '12': 'col-end-12',
      '13': 'col-end-13',
      auto: 'col-end-auto'
    }[val] ?? `col-end-[${getCustomVal(val)}]`)
  ],
  [
    'grid-column-gap',
    val => ({ '0': 'gap-x-0' }[val] ?? (isUnit(val) ? `gap-x-[${val}]` : ''))
  ],
  [
    'grid-column-start',
    val => ({
      '1': 'col-start-1',
      '2': 'col-start-2',
      '3': 'col-start-3',
      '4': 'col-start-4',
      '5': 'col-start-5',
      '6': 'col-start-6',
      '7': 'col-start-7',
      '8': 'col-start-8',
      '9': 'col-start-9',
      '10': 'col-start-10',
      '11': 'col-start-11',
      '12': 'col-start-12',
      '13': 'col-start-13',
      'auto': 'col-start-auto'
    }[val] ?? `col-start-[${getCustomVal(val)}]`)
  ],
  [
    'grid-gap',
    val => ({ '0': 'gap-0' }[val] ?? (isUnit(val) ? `gap-[${val}]` : ''))
  ],
  [
    'grid-row',
    val => ({
      'auto': 'row-auto',
      'span 1 / span 1': 'row-span-1',
      'span 2 / span 2': 'row-span-2',
      'span 3 / span 3': 'row-span-3',
      'span 4 / span 4': 'row-span-4',
      'span 5 / span 5': 'row-span-5',
      'span 6 / span 6': 'row-span-6',
      '1 / -1': 'row-span-full'
    }[val] ?? `row-[${getCustomVal(val)}]`)
  ],
  [
    'grid-row-end',
    val => ({
      '1': 'row-end-1',
      '2': 'row-end-2',
      '3': 'row-end-3',
      '4': 'row-end-4',
      '5': 'row-end-5',
      '6': 'row-end-6',
      '7': 'row-end-7',
      auto: 'row-end-auto'
    }[val] ?? `row-end-[${getCustomVal(val)}]`)
  ],
  [
    'grid-row-gap',
    val => ({ '0': 'gap-y-0' }[val] ?? (isUnit(val) ? `gap-y-[${val}]` : ''))
  ],
  [
    'grid-row-start',
    val => ({
      '1': 'row-start-1',
      '2': 'row-start-2',
      '3': 'row-start-3',
      '4': 'row-start-4',
      '5': 'row-start-5',
      '6': 'row-start-6',
      '7': 'row-start-7',
      'auto': 'row-start-auto'
    }[val] ?? `row-start-[${getCustomVal(val)}]`)
  ],
  [
    'grid-rows',
    val => (`[grid-rows:${getCustomVal(val)}]`)
  ],
  [
    'grid-template',
    val => (`[grid-template:${getCustomVal(val)}]`)
  ],
  [
    'grid-template-areas',
    val => (`[grid-template-areas:${getCustomVal(val)}]`)
  ],
  [
    'grid-template-columns',
    val => ({
      'repeat(1,minmax(0,1fr))': 'grid-cols-1', 'repeat(2,minmax(0,1fr))': 'grid-cols-2', 'repeat(3,minmax(0,1fr))': 'grid-cols-3', 'repeat(4,minmax(0,1fr))': 'grid-cols-4', 'repeat(5,minmax(0,1fr))': 'grid-cols-5', 'repeat(6,minmax(0,1fr))': 'grid-cols-6', 'repeat(7,minmax(0,1fr))': 'grid-cols-7', 'repeat(8,minmax(0,1fr))': 'grid-cols-8', 'repeat(9,minmax(0,1fr))': 'grid-cols-9', 'repeat(10,minmax(0,1fr))': 'grid-cols-10', 'repeat(11,minmax(0,1fr))': 'grid-cols-11', 'repeat(12,minmax(0,1fr))': 'grid-cols-12', 'none': 'grid-cols-none'
    }[getCustomVal(val).replace(/_/g, '')] ?? `grid-cols-[${getCustomVal(val)}]`)
  ],
  [
    'grid-template-rows',
    val => ({
      'repeat(1,minmax(0,1fr))': 'grid-rows-1', 'repeat(2,minmax(0,1fr))': 'grid-rows-2', 'repeat(3,minmax(0,1fr))': 'grid-rows-3', 'repeat(4,minmax(0,1fr))': 'grid-rows-4', 'repeat(5,minmax(0,1fr))': 'grid-rows-5', 'repeat(6,minmax(0,1fr))': 'grid-rows-6', 'none': 'grid-rows-none'
    }[getCustomVal(val).replace(/_/g, '')] ?? `grid-rows-[${getCustomVal(val)}]`)
  ],
  [
    'hanging-punctuation',
    {
      'none': '[hanging-punctuation:none]', 'first': '[hanging-punctuation:first]', 'last': '[hanging-punctuation:last]', 'allow-end': '[hanging-punctuation:allow-end]', 'force-end': '[hanging-punctuation:force-end]', 'initial': '[hanging-punctuation:initial]'
    }
  ],
  [
    'height',
    val => (isUnit(val) ? `h-${getUnitMetacharactersVal(val, [CustomSelect.vw]) || `[${val}]`}` : '')
  ],
  [
    'icon',
    val => (`[icon:${getCustomVal(val)}]`)
  ],
  [
    'image-orientation',
    val => (`[image-orientation:${getCustomVal(val)}]`)
  ],
  [
    'justify-content',
    {
      'flex-start': 'justify-start', 'flex-end': 'justify-end', 'center': 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly'
    }
  ],
  [
    'justify-items',
    {
      'start': 'justify-items-start', 'end': 'justify-items-end', 'center': 'justify-items-center', 'stretch': 'justify-items-stretch'
    }
  ],
  [
    'justify-self',
    {
      'auto': 'justify-self-auto', 'start': 'justify-self-start', 'end': 'justify-self-end', 'center': 'justify-self-center', 'stretch': 'justify-self-stretch'
    }
  ],
  [
    'left',
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}left-${getUnitMetacharactersVal(t[1], [CustomSelect.vw, CustomSelect.vh]) || `[${t[1]}]`}` : '')
    }
  ],
  [
    'letter-spacing',
    val => ({ '-0.05em': 'tracking-tighter', '-0.025em': 'tracking-tight', '0em': 'tracking-normal', '0.025em': 'tracking-wide', '0.05em': 'tracking-wider', '0.1em': 'tracking-widest' }[val] ?? (isUnit(val) ? `tracking-[${val}]` : ''))
  ],
  [
    'line-height',
    val => ({ '1': 'leading-none', '2': 'leading-loose', '1.25': 'leading-tight', '1.375': 'leading-snug', '1.5': 'leading-normal', '1.625': 'leading-relaxed' }[val] ?? (isUnit(val) ? `leading-[${val}]` : ''))
  ],
  [
    'list-style',
    val => (`[list-style:${getCustomVal(val)}]`)
  ],
  [
    'list-style-image',
    val => (`[list-style-image:${getCustomVal(val)}]`)
  ],
  [
    'list-style-position',
    val => ({
      'inside': 'list-inside', 'outside': 'list-outside'
    }[val] ?? `[list-style-position:${getCustomVal(val)}]`)
  ],
  [
    'list-style-type',
    val => ({
      'none': 'list-none', 'disc': 'list-disc', 'decimal': 'list-decimal'
    }[val] ?? `list-[${getCustomVal(val)}]`)
  ],
  [
    'logical-height',
    val => ((isUnit(val) ? `[logical-height:${val}]` : ''))
  ],
  [
    'logical-width',
    val => ((isUnit(val) ? `[logical-width:${val}]` : ''))
  ],
  [
    'margin',
    val => {
      const getPipeVal = (val: string) => {
        const r = ({ '0': 'm_0', '0px': 'm_0', 'auto': 'm_auto' }[val])
        if (r) {
          return r
        }
        const vals = val.split(' ').filter(v => v !== '')
        if (vals.filter(v => !isUnit(v)).length > 0) {
          return ''
        }
        if (vals.length === 1 || new Set(vals).size === 1) {
          return `m_[${vals[0]}]`
        } else if (vals.length === 2) {
          return `mx_[${vals[1]}] my_[${vals[0]}]`
        } else if (vals.length === 3) {
          if (vals[0] === vals[2]) {
            return `mx_[${vals[1]}] my_[${vals[0]}]`
          }
          return `mt_[${vals[0]}] mx_[${vals[1]}] mb_[${vals[2]}]`
        } else if (vals.length === 4) {
          if (vals[0] === vals[2]) {
            if (vals[1] === vals[3]) {
              return `mx_[${vals[1]}] my_[${vals[0]}]`
            }
            return `ml_[${vals[3]}] mr_[${vals[1]}] my_[${vals[0]}]`
          }
          if (vals[1] === vals[3]) {
            if (vals[0] === vals[2]) {
              return `mx_[${vals[1]}] my_[${vals[0]}]`
            }
            return `ml_[${vals[3]}] mr_[${vals[1]}] my_[${vals[0]}]`
          }
          return `mt_[${vals[0]}] mr_[${vals[1]}] mb_[${vals[2]}] ml_[${vals[3]}]`
        }
        return ''
      }
      const v = getPipeVal(val)
      return v === '' ? '' : (v.split(' ').map(t => t.includes('-') ? `-${t.replace('-', '').replace('_', '-')}` : t.replace('_', '-')).join(' '))
    }
  ],
  [
    'margin-bottom',
    val => {
      const t = hasNegative(val)
      return { '0': 'mb-0', '0px': 'mb-0', 'auto': 'mb-auto' }[val] ?? (isUnit(val) ? `${t[0]}mb-[${t[1]}]` : '')
    }
  ],
  [
    'margin-left',
    val => {
      const t = hasNegative(val)
      return { '0': 'ml-0', '0px': 'ml-0', 'auto': 'ml-auto' }[val] ?? (isUnit(val) ? `${t[0]}ml-[${t[1]}]` : '')
    }
  ],
  [
    'margin-right',
    val => {
      const t = hasNegative(val)
      return { '0': 'mr-0', '0px': 'mr-0', 'auto': 'mr-auto' }[val] ?? (isUnit(val) ? `${t[0]}mr-[${t[1]}]` : '')
    }
  ],
  [
    'margin-top',
    val => {
      const t = hasNegative(val)
      return { '0': 'mt-0', '0px': 'mt-0', 'auto': 'mt-auto' }[val] ?? (isUnit(val) ? `${t[0]}mt-[${t[1]}]` : '')
    }
  ],
  [
    'mask',
    val => (`[mask:${getCustomVal(val)}]`)
  ],
  [
    'mask-clip',
    val => (`[mask-clip:${getCustomVal(val)}]`)
  ],
  [
    'mask-composite',
    val => (`[mask-composite:${getCustomVal(val)}]`)
  ],
  [
    'mask-image',
    val => (`[mask-image:${getCustomVal(val)}]`)
  ],
  [
    'mask-origin',
    val => (`[mask-origin:${getCustomVal(val)}]`)
  ],
  [
    'mask-position',
    val => (`[mask-position:${getCustomVal(val)}]`)
  ],
  [
    'mask-repeat',
    val => (`[mask-repeat:${getCustomVal(val)}]`)
  ],
  [
    'mask-size',
    val => (`[mask-size:${getCustomVal(val)}]`)
  ],
  [
    'max-height',
    val => (isUnit(val) ? `max-h-${getUnitMetacharactersVal(val, [CustomSelect.vw]) || `[${val}]`}` : '')
  ],
  [
    'max-width',
    val => (isUnit(val) ? `max-w-${getUnitMetacharactersVal(val, [CustomSelect.vw, CustomSelect.vh]) || `[${val}]`}` : '')
  ],
  [
    'min-height',
    val => (isUnit(val) ? `min-h-${getUnitMetacharactersVal(val, [CustomSelect.vw]) || `[${val}]`}` : '')
  ],
  [
    'min-width',
    val => (isUnit(val) ? `min-w-${getUnitMetacharactersVal(val, [CustomSelect.vw, CustomSelect.vh]) || `[${val}]`}` : '')
  ],
  [
    'mix-blend-mode',
    {
      'normal': 'mix-blend-normal', 'multiply': 'mix-blend-multiply', 'screen': 'mix-blend-screen', 'overlay': 'mix-blend-overlay', 'darken': 'mix-blend-darken', 'lighten': 'mix-blend-lighten', 'color-dodge': 'mix-blend-color-dodge', 'color-burn': 'mix-blend-color-burn', 'hard-light': 'mix-blend-hard-light', 'soft-light': 'mix-blend-soft-light', 'difference': 'mix-blend-difference', 'exclusion': 'mix-blend-exclusion', 'hue': 'mix-blend-hue', 'saturation': 'mix-blend-saturation', 'color': 'mix-blend-color', 'luminosity': 'mix-blend-luminosity'
    }
  ],
  [
    'nav-down',
    val => (`[nav-down:${getCustomVal(val)}]`)
  ],
  [
    'nav-index',
    val => ((isUnit(val) ? `[nav-index:${val}]` : ''))
  ],
  [
    'nav-left',
    val => ((isUnit(val) ? `[nav-left:${val}]` : ''))
  ],
  [
    'nav-right',
    val => ((isUnit(val) ? `[nav-right:${val}]` : ''))
  ],
  [
    'nav-up',
    val => ((isUnit(val) ? `[nav-up:${val}]` : ''))
  ],
  [
    'object-fit',
    {
      'contain': 'object-contain', 'cover': 'object-cover', 'fill': 'object-fill', 'none': 'object-none', 'scale-down': 'object-scale-down'
    }
  ],
  [
    'object-position',
    val => ({
      'bottom': 'object-bottom', 'center': 'object-center', 'left': 'object-left', 'left_bottom': 'object-left-bottom', 'left_top': 'object-left-top', 'right': 'object-right', 'right_bottom': 'object-right-bottom', 'right_top': 'object-right-top', 'top': 'object-top'
    }[getCustomVal(val)] ?? '')
  ],
  [
    'opacity',
    val => ({ '0': 'opacity-0', '1': 'opacity-100', '0.05': 'opacity-5', '0.1': 'opacity-10', '0.2': 'opacity-20', '0.25': 'opacity-25', '0.3': 'opacity-30', '0.4': 'opacity-40', '0.5': 'opacity-50', '0.6': 'opacity-60', '0.7': 'opacity-70', '0.75': 'opacity-75', '0.8': 'opacity-80', '0.9': 'opacity-90', '0.95': 'opacity-95' }[val] ?? (isUnit(val) ? `opacity-[${val}]` : ''))
  ],
  [
    'order',
    val => ({ '0': 'order-none', '1': 'order-1', '2': 'order-2', '3': 'order-3', '4': 'order-4', '5': 'order-5', '6': 'order-6', '7': 'order-7', '8': 'order-8', '9': 'order-9', '10': 'order-10', '11': 'order-11', '12': 'order-12', '9999': 'order-last', '-9999': 'order-first' }[val] ?? (isUnit(val) ? `order-[${val}]` : ''))
  ],
  [
    'outline',
    val => (`outline-[${getCustomVal(val)}]`)
  ],
  [
    'outline-color',
    val => (isColor(val, true) ? `outline-[${getCustomVal(val)}]` : '')
  ],
  [
    'outline-offset',
    val => ((isUnit(val) ? `outline-offset-[${val}]` : ''))
  ],
  [
    'outline-style',
    {
      'none': 'outline-[none]', 'dotted': 'outline-dotted', 'dashed': 'outline-dashed', 'solid': '[outline-style:solid]', 'double': 'outline-double', 'groove': '[outline-style:groove]', 'ridge': '[outline-style:ridge]', 'inset': '[outline-style:inset]', 'outset': '[outline-style:outset]'
    }
  ],
  [
    'outline-width',
    val => ((isUnit(val) ? `outline-[${val}]` : ''))
  ],
  [
    'overflow',
    {
      'auto': 'overflow-auto', 'hidden': 'overflow-hidden', 'visible': 'overflow-visible', 'scroll': 'overflow-scroll'
    }
  ],
  [
    'overflow-anchor',
    val => (`[overflow-anchor:${getCustomVal(val)}]`)
  ],
  [
    'overflow-wrap',
    val => ({ 'break-word': 'break-words' }[val] ?? `[overflow-wrap:${getCustomVal(val)}]`)
  ],
  [
    'overflow-x',
    {
      'auto': 'overflow-x-auto', 'hidden': 'overflow-x-hidden', 'visible': 'overflow-x-visible', 'scroll': 'overflow-x-scroll'
    }
  ],
  [
    'overflow-y',
    {
      'auto': 'overflow-y-auto', 'hidden': 'overflow-y-hidden', 'visible': 'overflow-y-visible', 'scroll': 'overflow-y-scroll'
    }
  ],
  [
    'overscroll-behavior',
    {
      'auto': 'overscroll-auto', 'contain': 'overscroll-contain', 'none': 'overscroll-none'
    }
  ],
  [
    'overscroll-behavior-x',
    {
      'auto': 'overscroll-x-auto', 'contain': 'overscroll-x-contain', 'none': 'overscroll-x-none'
    }
  ],
  [
    'overscroll-behavior-y',
    {
      'auto': 'overscroll-y-auto', 'contain': 'overscroll-y-contain', 'none': 'overscroll-y-none'
    }
  ],
  [
    'padding',
    val => {
      const r = ({ '0': 'p-0', '0px': 'p-0' }[val])
      if (r) {
        return r
      }
      const vals = val.split(' ').filter(v => v !== '')
      if (vals.filter(v => !isUnit(v)).length > 0) {
        return ''
      }
      if (vals.length === 1 || new Set(vals).size === 1) {
        return `p-[${vals[0]}]`
      } else if (vals.length === 2) {
        return `px-[${vals[1]}] py-[${vals[0]}]`
      } else if (vals.length === 3) {
        if (vals[0] === vals[2]) {
          return `px-[${vals[1]}] py-[${vals[0]}]`
        }
        return `pt-[${vals[0]}] px-[${vals[1]}] pb-[${vals[2]}]`
      } else if (vals.length === 4) {
        if (vals[0] === vals[2]) {
          if (vals[1] === vals[3]) {
            return `px-[${vals[1]}] py-[${vals[0]}]`
          }
          return `pl-[${vals[3]}] pr-[${vals[1]}] py-[${vals[0]}]`
        }
        if (vals[1] === vals[3]) {
          if (vals[0] === vals[2]) {
            return `px-[${vals[1]}] py-[${vals[0]}]`
          }
          return `pl-[${vals[3]}] pr-[${vals[1]}] py-[${vals[0]}]`
        }
        return `pt-[${vals[0]}] pr-[${vals[1]}] pb-[${vals[2]}] pl-[${vals[3]}]`
      }
      return ''
    }
  ],
  [
    'padding-bottom',
    val => ({ '0': 'pb-0', '0px': 'pb-0' }[val] ?? ((isUnit(val) ? `pb-[${val}]` : '')))
  ],
  [
    'padding-left',
    val => ({ '0': 'pl-0', '0px': 'pl-0' }[val] ?? ((isUnit(val) ? `pl-[${val}]` : '')))
  ],
  [
    'padding-right',
    val => ({ '0': 'pr-0', '0px': 'pr-0' }[val] ?? ((isUnit(val) ? `pr-[${val}]` : '')))
  ],
  [
    'padding-top',
    val => ({ '0': 'pt-0', '0px': 'pt-0' }[val] ?? ((isUnit(val) ? `pt-[${val}]` : '')))
  ],
  [
    'page-break-after',
    {
      'auto': '[page-break-after:auto]', 'always': '[page-break-after:always]', 'avoid': '[page-break-after:avoid]', 'left': '[page-break-after:left]', 'right': '[page-break-after:right]', 'inherit': '[page-break-after:inherit]', 'initial': '[page-break-after:initial]'
    }
  ],
  [
    'page-break-before',
    {
      'auto': '[page-break-before:auto]', 'always': '[page-break-before:always]', 'avoid': '[page-break-before:avoid]', 'left': '[page-break-before:left]', 'right': '[page-break-before:right]', 'inherit': '[page-break-before:inherit]', 'initial': '[page-break-before:initial]'
    }
  ],
  [
    'page-break-inside',
    {
      'auto': '[page-break-inside:auto]', 'avoid': '[page-break-inside:avoid]', 'inherit': '[page-break-inside:inherit]', 'initial': '[page-break-inside:initial]'
    }
  ],
  [
    'perspective',
    val => ((isUnit(val) ? `[perspective:${val}]` : ''))
  ],
  [
    'perspective-origin',
    val => (`[perspective-origin:${getCustomVal(val)}]`)
  ],
  [
    'place-content',
    {
      'center': 'place-content-center', 'start': 'place-content-start', 'end': 'place-content-end', 'space-between': 'place-content-between', 'space-around': 'place-content-around', 'space-evenly': 'place-content-evenly', 'stretch': 'place-content-stretch'
    }
  ],
  [
    'place-items',
    {
      'start': 'place-items-start', 'end': 'place-items-end', 'center': 'place-items-center', 'stretch': 'place-items-stretch'
    }
  ],
  [
    'place-self',
    {
      'auto': 'place-self-auto', 'start': 'place-self-start', 'end': 'place-self-end', 'center': 'place-self-center', 'stretch': 'place-self-stretch'
    }
  ],
  [
    'pointer-events',
    {
      'none': 'pointer-events-none', 'auto': 'pointer-events-auto'
    }
  ],
  [
    'position',
    {
      'static': 'static', 'fixed': 'fixed', 'absolute': 'absolute', 'relative': 'relative', 'sticky': 'sticky'
    }
  ],
  [
    'punctuation-trim',
    {
      'none': '[punctuation-trim:none]', 'start': '[punctuation-trim:start]', 'end': '[punctuation-trim:end]', 'allow-end': '[punctuation-trim:allow-end]', 'adjacent': '[punctuation-trim:adjacent]', 'initial': '[punctuation-trim:initial]'
    }
  ],
  [
    'quotes',
    val => (`[quotes:${getCustomVal(val)}]`)
  ],
  [
    'resize',
    {
      'none': 'resize-none', 'vertical': 'resize-y', 'horizontal': 'resize-x', 'both': 'resize'
    }
  ],
  [
    'right',
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}right-${getUnitMetacharactersVal(t[1], [CustomSelect.vw, CustomSelect.vh]) || `[${t[1]}]`}` : '')
    }
  ],
  [
    'rotation',
    val => (`[rotation:${getCustomVal(val)}]`)
  ],
  [
    'row-gap',
    val => ({ '0': 'gap-y-0' }[val] ?? (isUnit(val) ? `gap-y-[${val}]` : ''))
  ],
  [
    'scroll-snap-align',
    val => (`[scroll-snap-align:${getCustomVal(val)}]`)
  ],
  [
    'scroll-snap-stop',
    val => (`[scroll-snap-stop:${getCustomVal(val)}]`)
  ],
  [
    'scroll-snap-type',
    val => (`[scroll-snap-type:${getCustomVal(val)}]`)
  ],
  [
    'scrollbar-width',
    val => ((isUnit(val) ? `[scrollbar-width:${val}]` : ''))
  ],
  [
    'shape-image-threshold',
    val => (`[shape-image-threshold:${getCustomVal(val)}]`)
  ],
  [
    'shape-margin',
    val => (`[shape-margin:${getCustomVal(val)}]`)
  ],
  [
    'shape-outside',
    val => (`[shape-outside:${getCustomVal(val)}]`)
  ],
  [
    'stroke',
    val => ({
      currentColor: 'stroke-current',
      currentcolor: 'stroke-current'
    }[val] ?? (isColor(val, true) ? `stroke-[${getCustomVal(val)}]` : ''))
  ],
  [
    'stroke-width',
    val => ((isUnit(val) ? `stroke-[${val}]` : ''))
  ],
  [
    'tab-size',
    val => ((isUnit(val) ? `[tab-size:${val}]` : ''))
  ],
  [
    'table-layout',
    {
      'auto': 'table-auto', 'fixed': 'table-fixed'
    }
  ],
  [
    'target',
    val => (`[target:${getCustomVal(val)}]`)
  ],
  [
    'target-name',
    val => (`[target-name:${getCustomVal(val)}]`)
  ],
  [
    'target-new',
    {
      'window': '[target-new:window]', 'tab': '[target-new:tab]', 'none': '[target-new:none]', 'initial': '[target-new:initial]'
    }
  ],
  [
    'target-position',
    {
      'above': '[target-position:above]', 'behind': '[target-position:behind]', 'front': '[target-position:front]', 'back': '[target-position:back]', 'initial': '[target-position:initial]'
    }
  ],
  [
    'text-align',
    {
      'left': 'text-left', 'center': 'text-center', 'right': 'text-right', 'justify': 'text-justify'
    }
  ],
  [
    'text-align-last',
    {
      'auto': '[text-align-last:auto]', 'left': '[text-align-last:left]', 'right': '[text-align-last:right]', 'center': '[text-align-last:center]', 'justify': '[text-align-last:justify]', 'start': '[text-align-last:start]', 'end': '[text-align-last:end]', 'initial': '[text-align-last:initial]', 'inherit': '[text-align-last:inherit]'
    }
  ],
  [
    'text-decoration',
    {
      'underline': 'underline', 'line-through': 'line-through', 'none': 'no-underline'
    }
  ],
  [
    'text-decoration-color',
    val => (isColor(val, true) ? `[text-decoration-color:${getCustomVal(val)}]` : '')
  ],
  [
    'text-decoration-line',
    {
      'none': '[text-decoration-line:none]', 'underline': '[text-decoration-line:underline]', 'overline': '[text-decoration-line:overline]', 'line-through': '[text-decoration-line:line-through]', 'initial': '[text-decoration-line:initial]', 'inherit': '[text-decoration-line:inherit]'
    }
  ],
  [
    'text-decoration-skip-ink',
    val => (`[text-decoration-skip-ink:${getCustomVal(val)}]`)
  ],
  [
    'text-decoration-style',
    {
      'solid': '[text-decoration-style:solid]', 'double': '[text-decoration-style:double]', 'dotted': '[text-decoration-style:dotted]', 'dashed': '[text-decoration-style:dashed]', 'wavy': '[text-decoration-style:wavy]', 'initial': '[text-decoration-style:initial]', 'inherit': '[text-decoration-style:inherit]'
    }
  ],
  [
    'text-emphasis-color',
    val => (isColor(val, true) ? `[text-emphasis-color:${getCustomVal(val)}]` : '')
  ],
  [
    'text-emphasis-position',
    val => (`[text-emphasis-position:${getCustomVal(val)}]`)
  ],
  [
    'text-emphasis-style',
    val => (`[text-emphasis-style:${getCustomVal(val)}]`)
  ],
  [
    'text-indent',
    val => ((isUnit(val) ? `[text-indent:${val}]` : ''))
  ],
  [
    'text-justify',
    {
      'auto': '[text-justify:auto]', 'none': '[text-justify:none]', 'inter-word': '[text-justify:inter-word]', 'inter-ideograph': '[text-justify:inter-ideograph]', 'inter-cluster': '[text-justify:inter-cluster]', 'distribute': '[text-justify:distribute]', 'kashida': '[text-justify:kashida]', 'initial': '[text-justify:initial]'
    }
  ],
  [
    'text-orientation',
    val => (`[text-orientation:${getCustomVal(val)}]`)
  ],
  [
    'text-outline',
    val => (`[text-outline:${getCustomVal(val)}]`)
  ],
  [
    'text-overflow',
    val => ({
      'ellipsis': 'overflow-ellipsis', 'clip': 'overflow-clip'
    }[val] ?? (`[text-overflow:${getCustomVal(val)}]`))
  ],
  [
    'text-shadow',
    val => (`[text-shadow:${getCustomVal(val)}]`)
  ],
  [
    'text-transform',
    {
      'uppercase': 'uppercase', 'lowercase': 'lowercase', 'capitalize': 'capitalize', 'none': 'normal-case'
    }
  ],
  [
    'text-underline-offset',
    val => (`[text-underline-offset:${getCustomVal(val)}]`)
  ],
  [
    'text-underline-position',
    val => (`[text-underline-position:${getCustomVal(val)}]`)
  ],
  [
    'text-wrap',
    {
      'normal': '[text-wrap:normal]', 'none': '[text-wrap:none]', 'unrestricted': '[text-wrap:unrestricted]', 'suppress': '[text-wrap:suppress]', 'initial': '[text-wrap:initial]'
    }
  ],
  [
    'top',
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}top-${getUnitMetacharactersVal(t[1], [CustomSelect.vw, CustomSelect.vh]) || `[${t[1]}]`}` : '')
    }
  ],
  [
    'transform',
    (val) => {
      const defaultVal = { 'none': 'transform-none' }[val]
      if (defaultVal) {
        return defaultVal
      }

      const transformValConfig: Record<string, ((v: string) => string | undefined)> = {
        scale: (v: string) => {
          const vs = v.split(',')
          if (vs.length === 3) {
            return undefined
          }
          if (vs[0] === vs[1] || vs.length === 1) {
            return `scale-[${vs[0]}]`
          }
          return vs.map((v, idx) => {
            return `scale-${idx === 0 ? 'x' : 'y'}-[${v}]`
          }).join(' ')
        },
        scaleX: (v: string) => `scale-x-[${v}]`,
        scaleY: (v: string) => `scale-y-[${v}]`,
        rotate: (v: string) => {
          const vs = v.split(',')
          if (vs.length > 1) {
            if (vs.length === 3 && ['0', '0deg'].findIndex(v => v === vs[0]) > -1 && ['0', '0deg'].findIndex(v => v === vs[1]) > -1) {
              const t = hasNegative(vs[2])
              return `${t[0]}rotate-[${t[1]}]`
            }
            return undefined
          }
          const t = hasNegative(vs[0])
          return `${t[0]}rotate-[${t[1]}]`
        },
        rotateZ: (v: string) => {
          const t = hasNegative(v)
          return `${t[0]}rotate-[${t[1]}]`
        },
        translate: (v: string) => {
          const vs = v.split(',')
          if (vs.length === 3) {
            return undefined
          }
          return vs.map((v, idx) => {
            const t = hasNegative(v)
            return `${t[0]}translate-${idx === 0 ? 'x' : 'y'}-[${t[1]}]`
          }).join(' ')
        },
        translateX: (v: string) => {
          const t = hasNegative(v)
          return `${t[0]}translate-x-[${t[1]}]`
        },
        translateY: (v: string) => {
          const t = hasNegative(v)
          return `${t[0]}translate-y-[${t[1]}]`
        },
        skew: (v: string) => {
          const vs = v.split(',')
          if (vs.length === 3) {
            return undefined
          }
          return vs.map((v, idx) => {
            const t = hasNegative(v)
            return `${t[0]}skew-${idx === 0 ? 'x' : 'y'}-[${t[1]}]`
          }).join(' ')
        },
        skewX: (v: string) => {
          const t = hasNegative(v)
          return `${t[0]}skew-x-[${t[1]}]`
        },
        skewY: (v: string) => {
          const t = hasNegative(v)
          return `${t[0]}skew-y-[${t[1]}]`
        }
      }
      const vals = getCustomVal(val).replace(/\(.+?\)/g, v => v.replace(/_/g, '')).split(')_').map(v => `${v})`)
      vals[vals.length - 1] = vals[vals.length - 1].slice(0, -1)

      let canUse = true
      const res = vals.map(v => {
        let canUsePipeV = false
        const pipeV = v.replace(/^([a-zA-Z0-9_-]+)\((.+?)\)$/, (r, k: string, v) => {
          canUsePipeV = true
          const tmpRes = transformValConfig[k]?.(v) ?? (canUse = false)
          return typeof tmpRes === 'string' ? tmpRes : ''
        })
        return canUsePipeV ? pipeV : ''
      })
      return canUse ? `transform ${[...new Set(res)].join(' ')}` : `[transform:${getCustomVal(val)}]`
    }
  ],
  [
    'transform-origin',
    val => ({
      'center': 'origin-center', 'top': 'origin-top', 'top_right': 'origin-top-right', 'right': 'origin-right', 'bottom_right': 'origin-bottom-right', 'bottom': 'origin-bottom', 'bottom_left': 'origin-bottom-left', 'left': 'origin-left', 'top_left': 'origin-top-left'
    }[getCustomVal(val)] ?? `origin-[${getCustomVal(val)}]`)
  ],
  [
    'transform-style',
    {
      'flat': '[transform-style:flat]', 'preserve-3d': '[transform-style:preserve-3d]', 'initial': '[transform-style:initial]'
    }
  ],
  [
    'transition',
    val => {
      if (val === 'none') {
        return 'transition-none'
      }
      return `[transition:${getCustomVal(val)}]`
    }
  ],
  [
    'transition-delay',
    val => {
      val = val.replace(/^([.\d]+)s$/, (v, $1) => `${($1 * 1000).toFixed(6).replace(/\.?0+$/, '')}ms`)
      return ({
        '75ms': 'delay-75', '100ms': 'delay-100', '150ms': 'delay-150', '200ms': 'delay-200', '300ms': 'delay-300', '500ms': 'delay-500', '700ms': 'delay-700', '1000ms': 'delay-1000'
      }[val] ?? (/^[.\d]+[ms]{1,2}$/.test(val) ? `delay-[${getCustomVal(val)}]` : ''))
    }
  ],
  [
    'transition-duration',
    val => {
      val = val.replace(/^([.\d]+)s$/, (v, $1) => `${($1 * 1000).toFixed(6).replace(/\.?0+$/, '')}ms`)
      return ({
        '75ms': 'duration-75', '100ms': 'duration-100', '150ms': 'duration-150', '200ms': 'duration-200', '300ms': 'duration-300', '500ms': 'duration-500', '700ms': 'duration-700', '1000ms': 'duration-1000'
      }[val] ?? (/^[.\d]+[ms]{1,2}$/.test(val) ? `duration-[${getCustomVal(val)}]` : ''))
    }
  ],
  [
    'transition-property',
    val => (`[transition-property:${getCustomVal(val)}]`)
  ],
  [
    'transition-timing-function',
    val => {
      val = val.replace(/\s/g, '')
      return ({
        'linear': 'ease-linear', 'cubic-bezier(0.4,0,1,1)': 'ease-in', 'cubic-bezier(0,0,0.2,1)': 'ease-out', 'cubic-bezier(0.4,0,0.2,1)': 'ease-in-out',
        'ease': 'ease-[ease]', 'ease-in': 'ease-in', 'ease-out': 'ease-out', 'ease-in-out': 'ease-in-out'
      }[val] ?? (val.startsWith('cubic-bezier') ? `ease-[${getCustomVal(val)}]` : ''))
    }
  ],
  [
    'unicode-bidi',
    {
      'normal': '[unicode-bidi:normal]', 'embed': '[unicode-bidi:embed]', 'bidi-override': '[unicode-bidi:bidi-override]', 'initial': '[unicode-bidi:initial]', 'inherit': '[unicode-bidi:inherit]'
    }
  ],
  [
    'user-select',
    {
      'none': 'select-none', 'text': 'select-text', 'all': 'select-all', 'auto': 'select-auto'
    }
  ],
  [
    'vertical-align',
    {
      'baseline': 'align-baseline', 'top': 'align-top', 'middle': 'align-middle', 'bottom': 'align-bottom', 'text-top': 'align-text-top', 'text-bottom': 'align-text-bottom'
    }
  ],
  [
    'visibility',
    {
      'visible': 'visible', 'hidden': 'invisible'
    }
  ],
  [
    'white-space',
    {
      'normal': 'whitespace-normal', 'nowrap': 'whitespace-nowrap', 'pre': 'whitespace-pre', 'pre-line': 'whitespace-pre-line', 'pre-wrap': 'whitespace-pre-wrap'
    }
  ],
  [
    'width',
    val => (isUnit(val) ? `w-${getUnitMetacharactersVal(val, [CustomSelect.vh]) || `[${val}]`}` : '')
  ],
  [
    'word-break',
    {
      'break-all': 'break-all',
      'normal': '[word-break:normal]', 'keep-all': '[word-break:keep-all]', 'initial': '[word-break:initial]'
    }
  ],
  [
    'word-spacing',
    val => ((isUnit(val) ? `[word-spacing:${val}]` : ''))
  ],
  [
    'word-wrap',
    {
      'normal': '[word-wrap:normal]', 'break-word': '[word-wrap:break-word]', 'initial': '[word-wrap:initial]'
    }
  ],
  [
    'writing-mode',
    val => (`[writing-mode:${getCustomVal(val)}]`)
  ],
  [
    'z-index',
    val => ({
      '0': 'z-0', '10': 'z-10', '20': 'z-20', '30': 'z-30', '40': 'z-40', '50': 'z-50', 'auto': 'z-auto'
    }[val] ?? (typeof val === 'number' ? `z-[${val}]` : ''))
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


const getResultCode = (it: CssCodeParse, prefix = '', tailwindPrefix = '') => {
  if (typeof it.cssCode !== 'string') {
    return null
  }
  const cssCodeList = it.cssCode.split(';').filter(v => v !== '')
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
    let hasImportant = false
    if (val.includes('!important')) {
      val = val.replace('!important', '').trim()
      hasImportant = true
    }
    let pipeVal = ''
    if (val === 'initial' || val === 'inherit') {
      pipeVal = `[${key.trim()}:${val}]`
    } else {
      pipeVal = typeof pipe === 'function' ? pipe(val) : (pipe?.[val] ?? '')
    }
    if (tailwindPrefix.length > 0) {
      pipeVal = pipeVal.split(' ').map(v => `${tailwindPrefix}${v}`).join(' ')
    }
    if (hasImportant) {
      const getImportantVal = (v: string) => {
        if (v[0] === '[' && v[v.length - 1] === ']') {
          v = `${v.slice(0, -1)}!important]`
        } else {
          v = `!${v}`
        }
        return v
      }
      if (pipeVal.includes(' ') && ['backdrop-filter', 'filter', 'transform'].filter(v => pipeVal.startsWith(v)).length === 0) {
        pipeVal = pipeVal.split(' ').map(v => getImportantVal(v)).join(' ')
      } else if (pipeVal.length > 0) {
        pipeVal = getImportantVal(pipeVal)
      }
    }
    if (it.selectorName.endsWith(':hover') && pipeVal.length > 0) {
      if (['backdrop-filter', 'filter', 'transform'].filter(v => pipeVal.startsWith(v)).length > 0) {
        pipeVal = `hover:${pipeVal}`
      } else {
        pipeVal = pipeVal.split(' ').map(v => `hover:${v}`).join(' ')
      }
    } else if (it.selectorName.endsWith(':focus') && pipeVal.length > 0) {
      if (['backdrop-filter', 'filter', 'transform'].filter(v => pipeVal.startsWith(v)).length > 0) {
        pipeVal = `focus:${pipeVal}`
      } else {
        pipeVal = pipeVal.split(' ').map(v => `focus:${v}`).join(' ')
      }
    } else if (it.selectorName.endsWith(':active') && pipeVal.length > 0) {
      if (['backdrop-filter', 'filter', 'transform'].filter(v => pipeVal.startsWith(v)).length > 0) {
        pipeVal = `active:${pipeVal}`
      } else {
        pipeVal = pipeVal.split(' ').map(v => `active:${v}`).join(' ')
      }
    } else if (it.selectorName.endsWith('::before') && pipeVal.length > 0) {
      if (['backdrop-filter', 'filter', 'transform'].filter(v => pipeVal.startsWith(v)).length > 0) {
        pipeVal = `before:${pipeVal}`
      } else {
        pipeVal = pipeVal.split(' ').map(v => `before:${v}`).join(' ')
      }
    } else if (it.selectorName.endsWith('::after') && pipeVal.length > 0) {
      if (['backdrop-filter', 'filter', 'transform'].filter(v => pipeVal.startsWith(v)).length > 0) {
        pipeVal = `after:${pipeVal}`
      } else {
        pipeVal = pipeVal.split(' ').map(v => `after:${v}`).join(' ')
      }
    }
    if (prefix.length > 0) {
      if (['backdrop-filter', 'filter', 'transform'].filter(v => pipeVal.startsWith(v)).length > 0) {
        pipeVal = `[${prefix}]:${pipeVal}`
      } else {
        pipeVal = pipeVal.split(' ').map(v => `[${prefix}]:${v}`).join(' ')
      }
    }
    return pipeVal
  }).filter(v => v !== '')
  return {
    selectorName: it.selectorName,
    resultVal: [...new Set(resultVals)].join(' ')
  }
}

export interface TranslatorConfig {
  prefix: string
}

export const CssToTailwindTranslator = (code: string, config: TranslatorConfig): {
  code: 'SyntaxError' | 'OK'
  data: ResultCode[]
} => {
  if (specialAttribute.map(v => code.includes(v)).filter(v => v).length > 0) {
    return {
      code: 'SyntaxError',
      data: []
    }
  }
  const dataArray: ResultCode[] = []
  parsingCode(code).map(it => {
    if (typeof it.cssCode === 'string') {
      return getResultCode(it, '', config?.prefix)
    } else if (it.selectorName.includes('@media')) {
      return it.cssCode.map(v => {
        const res = getResultCode(v, it.selectorName.replace(/\s/g, ''), config?.prefix)
        return res ? ({
          selectorName: `${it.selectorName.replace(/\s/g, '')}-->${res.selectorName}`,
          resultVal: res.resultVal
        }) : null
      })
    } else {
      return null
    }
  }).filter(v => v !== null).forEach((v) => {
    if (Array.isArray(v)) {
      dataArray.push(...(v as ResultCode[]))
    } else {
      dataArray.push(v as ResultCode)
    }
  })
  return {
    code: 'OK',
    data: dataArray
  }
}
