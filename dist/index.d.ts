import { Canvas } from 'canvas';
export declare class NodePixelFont {
    private chars;
    private img;
    private bufferCanvas;
    private validateFont;
    loadFont: (pngFilePath: string, xmlFilePath: string) => Promise<void>;
    draw: (canvas: Canvas, text: string, x: number, y: number, color?: string, scale?: number) => Promise<void>;
    private drawChar;
}
