export interface ISize {
    width: number | undefined;
    height: number | undefined;
    orientation?: number;
    type?: string;
}
export declare type ISizeCalculationResult = ISize & {
    images?: ISize[];
};
export declare type ToAsciiCallback = {
    (view: DataView, begin: number, end: number): string;
};
export interface IImage {
    validate: (buffer: DataView, toAscii: ToAsciiCallback) => boolean;
    calculate: (buffer: DataView, toAscii: ToAsciiCallback) => ISizeCalculationResult;
}
