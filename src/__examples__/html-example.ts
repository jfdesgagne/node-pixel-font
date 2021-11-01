import { HTMLPixelFont } from '../html-pixel-font'

document.body.setAttribute('style', 'padding: 0; margin: 0;')
const WIDTH = 64
const HEIGHT = 32
const canvas = document.createElement('canvas')
canvas.setAttribute('style', 'transform: scale(10); transform-origin: left top;')
canvas.width = 64
canvas.height = 32
document.body.appendChild(canvas)
const context = canvas.getContext('2d')
context.fillStyle = 'blue'
context.fillRect(0, 0, WIDTH, HEIGHT)
;(async () => {
    const pixelFont = new HTMLPixelFont()
    await pixelFont.loadFont('fonts/sampleFont.png', 'fonts/sampleFont.xml')
    pixelFont.draw(canvas, 'Some text', 5, 5, 'red')
})()
