import { Canvas, CanvasRenderingContext2D, createCanvas, Image, loadImage } from 'canvas'
import * as fs from 'fs'
import { parseStringPromise } from 'xml2js'

const readFile = (path: string) => new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    })
})

type Char = {
    width: number
    offset: number[]
    rect: number[]
}

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

type Point = {
    x: number
    y: number
}

export type Rect = {
    width: number
    height: number
} & Point

export type RectAlignment = {
    x: number | HorizontalAlignment
    y: number | VerticalAlignment
    width: number
    height: number
}

export class NodePixelFont {
    private chars: Record<string, Char> = {}
    private img: CanvasImageSource | Image
    private bufferCanvas: Canvas

    private validateFont = (xmlObject: { Font: Record<string, unknown> }) => {
        if(!xmlObject.Font || !xmlObject.Font.$ || !xmlObject.Font.Char) {
            throw new Error('Invalid XML format')
        }
    }

    public loadFont = async (pngFilePath: string, xmlFilePath: string) => {
        const data = await readFile(xmlFilePath)
        const xmlObject = await parseStringPromise(data)
        this.validateFont(xmlObject)
        this.chars = xmlObject.Font.Char.reduce((acc, node) => {
            if(node.$) {
                acc[node.$.code] = {
                    width: parseInt(node.$.width),
                    offset: node.$.offset.split(' ').map(i => parseInt(i)),
                    rect: node.$.rect.split(' ').map(i => parseInt(i))
                }
            }
            return acc
        }, {})
        this.img = await loadImage(pngFilePath)
    }

    // protected getCanvasRect = (canvas: Canvas | HTMLCanvasElement, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, scale: number, rect: Rect = { x: 0, y: 0, width: 0, height: 0 }) => {
    //     const width = text
    //         .split('')
    //         .map(charStr => this.chars[charStr] ? this.chars[charStr].width * scale : 0)
    //         .reduce((prev, cur) => prev + cur)
    //     const height = Math.max(
    //         ...text
    //             .split('')
    //             .map(charStr => this.chars[charStr] ? this.chars[charStr].rect[3] * scale : 0))
    //     const y = Math.min(
    //         ...text
    //             .split('')
    //             .map(charStr => this.chars[charStr] ? this.chars[charStr].offset[1] * scale : 0))

    //     const canvasRect: Rect = {
    //         width,
    //         height,
    //         y,
    //         x: 0
    //     }

    //     return canvasRect
    // }

    private getPositionRect = (canvas: Canvas, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, scale: number, rect: Rect = { x: 0, y: 0, width: 0, height: 0 }) => {
        const width = text
            .split('')
            .map(charStr => this.chars[charStr] ? this.chars[charStr].width * scale : 0)
            .reduce((prev, cur) => prev + cur)
        const height = Math.max(
            ...text
                .split('')
                .map(charStr => this.chars[charStr] ? this.chars[charStr].rect[3] * scale : 0))
        const offsetY = Math.min(
            ...text
                .split('')
                .map(charStr => this.chars[charStr] ? this.chars[charStr].offset[1] * scale : 0))

        let x = 0, y = 0
        if (typeof initialX === 'string') {
            switch (initialX) {
                case HorizontalAlignment.Center:
                    x = ((rect.width || canvas.width) - width) / 2
                    break
                case HorizontalAlignment.Right:
                    x = (rect.width || canvas.width) - width
                    break
                case HorizontalAlignment.Left:
                    x = rect.x
            }
        } else {
            x = initialX as number
        }

        if (typeof initialY === 'string') {
            switch (initialY) {
                case VerticalAlignment.Middle:
                    y = ((rect.height || canvas.height) - height) / 2 - offsetY
                    break
                case VerticalAlignment.Bottom:
                    y = (rect.height || canvas.height) - height - offsetY
                    break
                case VerticalAlignment.Top:
                    y = -offsetY
            }
        } else {
            y = initialY as number
        }

        return {
            width: Math.round(width),
            height: Math.round(height),
            x: Math.round(x + rect.x),
            y: Math.round(y + rect.y)
        }
    }

    public draw = async (canvas: Canvas, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, color: string = '#FFFFFF', scale: number = 1, rect?: Rect) => {
        if (!this.bufferCanvas) {
            this.bufferCanvas = createCanvas(canvas.width, canvas.height)
        } else {
            this.bufferCanvas.width = canvas.width
            this.bufferCanvas.height = canvas.height
        }

        const positionRect = this.getPositionRect(canvas, text, initialX, initialY, scale, rect)
        let x = positionRect.x, y = positionRect.y
        text.split('').forEach(charStr => {
            const char = this.chars[charStr]
            if (char) {
                this.drawChar(canvas, char, x, y, color, scale)
                x += char.width * scale
            }
        })

        return positionRect
    }

    private drawChar = (canvas: Canvas | HTMLCanvasElement, char: Char, x: number, y: number, color: string, scale: number) => {
        const bufferContext = this.bufferCanvas.getContext('2d') as CanvasRenderingContext2D
        const context = canvas.getContext('2d') as CanvasRenderingContext2D
        const charX = x + char.offset[0] * scale
        const charY = y + char.offset[1] * scale
        const charWidth = char.rect[2] * scale
        const charHeight = char.rect[3] * scale

        // Draw the font in a temporary context where smoothing is disabled
        bufferContext.imageSmoothingEnabled = false
        bufferContext.drawImage(
            this.img,
            char.rect[0],
            char.rect[1],
            char.rect[2],
            char.rect[3],
            charX,
            charY,
            charWidth,
            charHeight
        )
        bufferContext.fillStyle = color
        bufferContext.globalCompositeOperation = 'source-in'
        bufferContext.fillRect(charX, charY, charWidth, charHeight)
        bufferContext.globalCompositeOperation = 'source-over'

        // Draw the char in the real context
        context.drawImage(
            bufferContext.canvas,
            charX,
            charY,
            charWidth,
            charHeight,
            charX,
            charY,
            charWidth,
            charHeight
        )
    }
}