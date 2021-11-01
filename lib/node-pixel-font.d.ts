import { PixelFont } from './base-pixel-font';
export declare class NodePixelFont extends PixelFont {
    constructor();
    private validateFont;
    loadFont: (pngFilePath: string, xmlFilePath: string) => Promise<void>;
}
