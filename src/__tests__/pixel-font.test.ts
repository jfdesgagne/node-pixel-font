import { Canvas, createCanvas } from 'canvas'
import { HorizontalAlignment, VerticalAlignment, Rect, CanvasLike } from '../types'
import { NodePixelFont } from '../node-pixel-font'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { PixelFont } from '../base-pixel-font'

expect.extend({ toMatchImageSnapshot })

const width = 64
const height = 32
const textColor = '#00FF00'
const bgColor = '#FF0000'
const text = 'a2z'

const expectNodeSnapshot = (canvas: CanvasLike) => {
    const buffer = (canvas as Canvas).toBuffer('image/png')
    expect(buffer).toMatchImageSnapshot()
}


describe('NodePixelFont', () => {
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = bgColor
    const font: PixelFont = new NodePixelFont()

    beforeAll(async() => {
        await font.loadFont(`public/fonts/sampleFont.png`, `public/fonts/sampleFont.xml`)
    })

    beforeEach(() => {
        context.clearRect(0, 0, width, height)
        context.fillRect(0, 0, width, height)
    })

    it('shoud manually postition the text to 5,5 and draw it', async () => {
        font.draw(canvas, '123abc', 5, 5, textColor)
        expectNodeSnapshot(canvas)
    })

    it('shoud draw text horizontally centered', async () => {
        font.draw(canvas, text, HorizontalAlignment.Center, 0, textColor)
        expectNodeSnapshot(canvas)
    })

    it('shoud draw text horizontally left aligned', async () => {
        font.draw(canvas, text, HorizontalAlignment.Left, 0, textColor)
        expectNodeSnapshot(canvas)
    })

    it('shoud draw text horizontally right aligned', async () => {
        font.draw(canvas, text, HorizontalAlignment.Right, 0, textColor)
        expectNodeSnapshot(canvas)
    })

    it('shoud draw text vertically top aligned', async () => {
        font.draw(canvas, text, 0, VerticalAlignment.Top, textColor)
        expectNodeSnapshot(canvas)
    })

    it('shoud draw text vertically middle aligned', async () => {
        font.draw(canvas, text, 0, VerticalAlignment.Middle, textColor)
        expectNodeSnapshot(canvas)
    })

    it('shoud draw text vertically bottom aligned', async () => {
        font.draw(canvas, text, 0, VerticalAlignment.Bottom, textColor)
        expectNodeSnapshot(canvas)
    })

    it('shoud draw text vertically and horiontally center aligned', async () => {
        font.draw(canvas, text, HorizontalAlignment.Center, VerticalAlignment.Middle, textColor)
        expectNodeSnapshot(canvas)
    })

    it('should center the text in a smaller canvas area with offset', () => {
        const canvasRect: Rect = { x: 1, y: 5, width: 30, height: 20 }
        context.fillStyle = '#0000FF'
        context.fillRect(canvasRect.x, canvasRect.y, canvasRect.width, canvasRect.height)
        font.draw(canvas, text, HorizontalAlignment.Center, VerticalAlignment.Middle, textColor, 1, canvasRect)
        expectNodeSnapshot(canvas)
    })
})
