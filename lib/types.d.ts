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
export declare type Point = {
    x: number;
    y: number;
};
export declare type Rect = RectOnly & Point;
export declare type RectOnly = {
    width: number;
    height: number;
};
export declare type RectAlignment = {
    x: number | HorizontalAlignment;
    y: number | VerticalAlignment;
    width: number;
    height: number;
};
export interface ContextLike {
    imageSmoothingEnabled: boolean;
    drawImage: (...args: any[]) => void;
    fillStyle: any;
    globalCompositeOperation: string;
    fillRect(x: number, y: number, w: number, h: number): void;
    clearRect(x: number, y: number, w: number, h: number): void;
    canvas: CanvasLike;
    getImageData(x: number, y: number, width: number, height: number): ImageData;
    putImageData(image: ImageData, x: number, y: number): void;
}
export interface CanvasLike {
    width: number;
    height: number;
    getContext: (type: '2d') => ContextLike;
}
