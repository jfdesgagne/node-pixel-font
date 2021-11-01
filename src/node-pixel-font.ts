import { createCanvas, loadImage } from 'canvas'
import * as fs from 'fs'
import { parseStringPromise } from 'xml2js'
import { PixelFont } from './base-pixel-font'

const readFile = (path: string) => new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    })
})

export class NodePixelFont extends PixelFont {
    constructor() {
        super()
        this.bufferCanvas = createCanvas(0, 0)
    }

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
}