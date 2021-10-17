import { Canvas } from 'canvas';
export declare enum HorizontalAlignment {
    Left = "left",
    Center = "center",
    Right = "right"
}
export declare enum VerticalAlignment {
    Top = "top",
    Middle = "middle",
    Bottom = "bottom"
}
declare type Point = {
    x: number;
    y: number;
};
export declare type Rect = {
    width: number;
    height: number;
} & Point;
export declare type RectAlignment = {
    x: number | HorizontalAlignment;
    y: number | VerticalAlignment;
    width: number;
    height: number;
};
export declare class NodePixelFont {
    private chars;
    private img;
    private bufferCanvas;
    private validateFont;
    loadFont: (pngFilePath: string, xmlFilePath: string) => Promise<void>;
    private getPositionRect;
    draw: (canvas: Canvas, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, color?: string, scale?: number, rect?: Rect) => Promise<{
        width: number;
        height: number;
        x: number;
        y: number;
    }>;
    private drawChar;
}
export {};
