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
    'deg', 'grad', 'rad', 'turn',
    '%', 'length', 'inherit', 'thick', 'medium', 'thin', 'initial', 'auto'
  ].includes(str.replace(/[.\d\s-]/g, '')) || /^[-.\d]+$/.test(str.trim())
}

enum CustomSelect {
  auto = 'auto',
  screen = '100vw',
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

      return `backdrop-filter ${[...new Set(vals.map(v => v.replace(/^([a-z-]+)\((.+?)\)$/, (r, k: string, v) => backdropFilterValConfig[k](v))))].join(' ')}`
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
      const vals: string = val.split(' ').filter(v => v !== '').map(v => (isUnit(v) || isColor(v)) ? `border-[${v}]` : ((propertyMap.get('border-style') as Record<string, string>)[v] ?? '')).filter(v => v !== '').join(' ')
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
        return `rounded-${getCustomVal(val)}`
      }
      const vals = val.split(' ').filter(v => v !== '')
      if (vals.filter(v => !isUnit(v)).length > 0) {
        return ''
      }
      if (vals.length === 1) {
        return `rounded-${vals[0]}`
      } else if (vals.length === 2) {
        return `rounded-tl-${vals[0]} rounded-br-${vals[0]} rounded-tr-${vals[1]} rounded-bl-${vals[1]}`
      } else if (vals.length === 3) {
        return `rounded-tl-${vals[0]} rounded-br-${vals[2]} rounded-tr-${vals[1]} rounded-bl-${vals[1]}`
      } else if (vals.length === 4) {
        return `rounded-tl-${vals[0]} rounded-br-${vals[2]} rounded-tr-${vals[1]} rounded-bl-${vals[3]}`
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
      return (isUnit(val) ? `${t[0]}bottom-${getUnitMetacharactersVal(t[1], [CustomSelect.screen]) || `[${t[1]}]`}` : '')
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
    val => ((isUnit(val) ? `text-[${val}]` : ''))
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
    val => (isUnit(val) ? `h-${getUnitMetacharactersVal(val, [CustomSelect.screen]) || `[${val}]`}` : '')
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
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}left-${getUnitMetacharactersVal(t[1], [CustomSelect.screen]) || `[${t[1]}]`}` : '')
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
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}mb-[${t[1]}]` : '')
    }
  ],
  [
    'margin-left',
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}ml-[${t[1]}]` : '')
    }
  ],
  [
    'margin-right',
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}mr-[${t[1]}]` : '')
    }
  ],
  [
    'margin-top',
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}mt-[${t[1]}]` : '')
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
    val => (isUnit(val) ? `max-h-${getUnitMetacharactersVal(val, [CustomSelect.screen]) || `[${val}]`}` : '')
  ],
  [
    'max-width',
    val => (isUnit(val) ? `max-w-${getUnitMetacharactersVal(val, [CustomSelect.screen]) || `[${val}]`}` : '')
  ],
  [
    'min-height',
    val => (isUnit(val) ? `min-h-${getUnitMetacharactersVal(val, [CustomSelect.screen]) || `[${val}]`}` : '')
  ],
  [
    'min-width',
    val => (isUnit(val) ? `min-w-${getUnitMetacharactersVal(val, [CustomSelect.screen]) || `[${val}]`}` : '')
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
    val => ((isUnit(val) ? `pb-[${val}]` : ''))
  ],
  [
    'padding-left',
    val => ((isUnit(val) ? `pl-[${val}]` : ''))
  ],
  [
    'padding-right',
    val => ((isUnit(val) ? `pr-[${val}]` : ''))
  ],
  [
    'padding-top',
    val => ((isUnit(val) ? `pt-[${val}]` : ''))
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
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}right-${getUnitMetacharactersVal(t[1], [CustomSelect.screen]) || `[${t[1]}]`}` : '')
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
    val => {
      const t = hasNegative(val)
      return (isUnit(val) ? `${t[0]}top-${getUnitMetacharactersVal(t[1], [CustomSelect.screen]) || `[${t[1]}]`}` : '')
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
    val => (isUnit(val) ? `w-${getUnitMetacharactersVal(val, [CustomSelect.screen]) || `[${val}]`}` : '')
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
          let pipeVal = typeof pipe === 'function' ? pipe(val) : (pipe?.[val] ?? '')
          if (hasImportant) {
            const getImportantVal = (v: string) => {
              if (v[0] === '[' && v[v.length - 1] === ']') {
                v = `${v.slice(0, -1)}!important]`
              } else {
                v = `!${v}`
              }
              return v
            }
            if (pipeVal.includes(' ')) {
              pipeVal = pipeVal.split(' ').map(v => getImportantVal(v)).join(' ')
            } else if (pipeVal.length > 0) {
              pipeVal = getImportantVal(pipeVal)
            }
          }
          if (it.selectorName.endsWith(':hover') && pipeVal.length > 0) {
            pipeVal = `hover:${pipeVal}`
          }
          return pipeVal
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
