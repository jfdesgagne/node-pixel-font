import axios from 'axios'
import { PixelFont } from './base-pixel-font'

const loadImage = (path: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', err => reject(err))
    img.src = path
})

export class HTMLPixelFont extends PixelFont {
    constructor() {
        super()
        this.bufferCanvas = document.createElement('canvas')
    }

    private validateFont = (xmlObject: XMLDocument) => {
        const fontTags = xmlObject.querySelectorAll('Font')
        if (fontTags.length !== 1 || fontTags[0].querySelectorAll('Char').length < 1) {
            throw new Error('Invalid XML format')
        }
    }

    public loadFont = async (pngFilePath: string, xmlFilePath: string) => {
        const { data } = await axios.get(xmlFilePath)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data as string, 'text/xml')

        this.validateFont(xmlDoc)

        const chars = Array.from(xmlDoc.querySelector('Font').querySelectorAll('Char'))

        this.chars = chars.reduce((acc, node) => {
            if(node) {
                acc[node.getAttribute('code')] = {
                    width: parseInt(node.getAttribute('width')),
                    offset: node.getAttribute('offset').split(' ').map(i => parseInt(i)),
                    rect: node.getAttribute('rect').split(' ').map(i => parseInt(i))
                }
            }
            return acc
        }, {})

        this.img = await loadImage(pngFilePath)
    }
}