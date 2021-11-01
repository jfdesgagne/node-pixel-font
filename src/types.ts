import { CanvasRenderingContext2D } from "canvas"


export enum HorizontalAlignment {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

export enum VerticalAlignment {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom'
}

export type Point = {
    x: number
    y: number
}

export type Rect = RectOnly & Point

export type RectOnly = {
    width: number
    height: number
}

export type RectAlignment = {
    x: number | HorizontalAlignment
    y: number | VerticalAlignment
    width: number
    height: number
}

export interface ContextLike {
    imageSmoothingEnabled: boolean
    drawImage: (...args: any[]) => void
    fillStyle: any
    globalCompositeOperation: string
    fillRect(x: number, y: number, w: number, h: number): void
    clearRect(x: number, y: number, w: number, h: number): void
    canvas: CanvasLike
    getImageData(x: number, y: number, width: number, height: number): ImageData
}

export interface CanvasLike {
    width: number
    height: number
    getContext: (type: '2d') => ContextLike

}