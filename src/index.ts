import { Canvas, createCanvas, Image, loadImage } from 'canvas';
import * as fs from 'fs'
import { parseStringPromise } from 'xml2js';

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

export class NodePixelFont {
    private chars: Record<string, Char> = {}
    private img: Image
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

    public draw = async (canvas: Canvas, text: string, x: number, y: number, color: string = '#FFFFFF', scale: number = 1) => {
        if (!this.bufferCanvas || this.bufferCanvas.width !== canvas.width || this.bufferCanvas.height !== canvas.height) {
            this.bufferCanvas = createCanvas(canvas.width, canvas.height)
        }

        text.split('').forEach(charStr => {
            const char = this.chars[charStr]
            if (char) {
                this.drawChar(canvas, char, x, y, color, scale)
                x += char.width * scale
            }
        })
    }

    private drawChar = (canvas: Canvas, char: Char, x: number, y: number, color: string, scale: number) => {
        const bufferContext = this.bufferCanvas.getContext('2d')
        const context = canvas.getContext('2d')
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