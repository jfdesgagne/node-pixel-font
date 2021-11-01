import { CanvasLike, HorizontalAlignment, VerticalAlignment, Rect } from './types';
declare type Char = {
    width: number;
    offset: number[];
    rect: number[];
};
export interface IPixelFont {
    loadFont(pngFilePath: string, xmlFilePath: string): Promise<void>;
    draw(canvas: CanvasLike, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, color?: string, scale?: number, rect?: Rect): Rect;
}
export interface PixelFontOptions {
    spacing?: number;
}
export declare class PixelFont implements IPixelFont {
    protected chars: Record<string, Char>;
    protected img: any;
    protected bufferCanvas: CanvasLike;
    protected spacing: number;
    protected options: PixelFontOptions;
    readonly loadFont: (_pngFilePath: string, _xmlFilePath: string, options?: PixelFontOptions) => Promise<void>;
    readonly setOptions: (options: PixelFontOptions) => void;
    private getCharWidth;
    protected readonly getPositionRect: (canvas: CanvasLike, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, scale: number, rect?: Rect) => {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    draw: (canvas: CanvasLike, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, color?: string, scale?: number, rect?: Rect) => {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    protected drawChar: (canvas: CanvasLike, char: Char, x: number, y: number, color: string, scale: number) => void;
}
export {};
