export interface ResultCode {
    selectorName: string;
    resultVal: string;
}
export declare const specialAttribute: string[];
export declare const CssToTailwindTranslator: (code: string) => {
    code: 'SyntaxError' | 'OK';
    data: ResultCode[];
};
