import { NodePixelFont } from '../src'
import { createCanvas } from 'canvas'
import * as fs from 'fs'

;(async () => {
    const width = 64
    const height = 32
    const text = '01234567890'
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    const font = new NodePixelFont()
    await font.loadFont('./fonts/sampleFont.png', './fonts/sampleFont.xml')
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(0, 0, width, height)
    console.log(`drawing text: ${text}`)
    font.draw(canvas, '01234567890', 3, 0, '#00FF00')
    const buffer = canvas.toBuffer('image/png')
    if (!fs.existsSync('./output/')){
        fs.mkdirSync('./output/');
    }
    fs.writeFileSync('./output/image.png', buffer)
    console.log('file saved in output/image.png')
})()