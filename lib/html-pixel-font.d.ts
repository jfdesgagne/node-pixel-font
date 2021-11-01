import { PixelFont } from './base-pixel-font';
export declare class HTMLPixelFont extends PixelFont {
    constructor();
    private validateFont;
    loadFont: (pngFilePath: string, xmlFilePath: string) => Promise<void>;
}
