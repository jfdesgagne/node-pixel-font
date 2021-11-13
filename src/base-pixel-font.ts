import { CanvasLike, HorizontalAlignment, VerticalAlignment, Rect, ContextLike } from './types'

type Char = {
    width: number
    offset: number[]
    rect: number[]
}

export interface IPixelFont {
    loadFont(pngFilePath: string, xmlFilePath: string): Promise<void>
    draw(canvas: CanvasLike, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, color?: string, scale?: number, rect?: Rect): Rect
}

export interface PixelFontOptions {
    spacing?: number
}

export class PixelFont implements IPixelFont {
    protected chars: Record<string, Char> = {}
    protected img: any
    protected bufferCanvas: CanvasLike
    protected spacing: number
    protected options: PixelFontOptions = {}

    public readonly loadFont = async (_pngFilePath: string, _xmlFilePath: string, options: PixelFontOptions = {}): Promise<void> => {
        this.options = options
        return Promise.resolve()
    }

    public readonly setOptions = (options: PixelFontOptions) => {
        this.options = options
    }

    private getCharWidth = (charStr: string) => {
        if (charStr === ' ' && this.options.spacing !== undefined) {
            return this.options.spacing
        }
        return this.chars[charStr].width
    }

    protected readonly getPositionRect = (canvas: CanvasLike, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, scale: number, rect: Rect = { x: 0, y: 0, width: 0, height: 0 }) => {
        const width = text
            .split('')
            .map(charStr => this.chars[charStr] ? this.getCharWidth(charStr) * scale : 0)
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

    public draw = (canvas: CanvasLike, text: string, initialX: number | HorizontalAlignment, initialY: number | VerticalAlignment, color: string = '#FFFFFF', scale: number = 1, rect?: Rect) => {
        if (!this.bufferCanvas) {
            throw new Error('You must instanciate the buffer canvas in the constructor')            
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

    protected drawChar = (canvas: CanvasLike, char: Char, x: number, y: number, color: string, scale: number) => {
        const bufferContext = this.bufferCanvas.getContext('2d') as ContextLike
        const context = canvas.getContext('2d') as ContextLike
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
            this.bufferCanvas,
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