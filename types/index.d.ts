interface ResultCode {
  selectorName: string
  resultVal: string
}

interface ComputedResultCode {
  id: string
  selectorName: string
  resultVal: {
    id: string
    val: string
  }[]
}

interface TranslatorConfigCopy extends Omit<TranslatorConfig, 'customTheme'> {
  customTheme: string
}