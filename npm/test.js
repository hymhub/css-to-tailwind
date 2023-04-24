import { CssToTailwindTranslator } from './CssToTailwindTranslator.js'

const cssCode = `body {
  width: 100%;
  height: 50%;
  margin: 0 !important;
  background-color: transparent;
}`

const conversionResult = CssToTailwindTranslator(cssCode)

console.log(conversionResult)
// {
//   code: 'OK',
//   data: [
//     {
//       selectorName: 'body',
//       resultVal: 'w-full h-1/2 !m-0 bg-transparent'
//     }
//   ]
// }