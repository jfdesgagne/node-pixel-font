# node-pixel-font
Library that loads [BitmapFont](https://www.angelcode.com/products/bmfont/) and draw text in a [node-canvas](https://www.npmjs.com/package/canvas).

# Dependencies
- [node-canvas](https://www.npmjs.com/package/canvas)
- [xml2js](https://www.npmjs.com/package/xml2js)

# Usage
Install the library
```
npm install --save node-pixel-font
```

Include the code
```typescript
    import { NodePixelFont } from 'node-pixel-font'
    const font = new NodePixelFont()
    await font.loadFont('path/to/png-file.png', 'path/to/xml-file.xml')
    font.draw(canvas, 'Hello World !', 10, 20, '#00FF00')
```

# API

## loadFont()
 ```typescript
 loadFont(pngFilePath: string, xmlFilePath: string): Promise<void>
 ```

load the font in memory. `draw()` needs to be called after awaiting on `loadFont()`

## draw()
 ```typescript
 draw(canvas: Canvas, text: string, x: number | HorizontalAlignment, y: number | VerticalAlignment, color: string = '#FFFFFF', scale: number = 1): void
 ```

Draw the specified text into the provided canvas. Can specify the destination X and Y of the text, as well as color and scale factor.

# Alignment
You can align the text manually, by providing x, y as pixel number, or by providing either (or both) x and y as alignment using `HorizontalAlignment` and `VerticalAlignment`

```typescript
import { NodePixelFont, HorizontalAlignment, VerticalAlignment } from 'node-pixel-font'
import { createCanvas } from 'canvas'
const canvas = createCanvas(64, 32)
const pixelFont = new NodePixelFont()
pixelFont.loadFont('path/to/file.png', 'path/to/file.xml')
pixelFont.draw(canvas, 'some text', HorizontalAlignment.Center, VerticalAlignment.Middle, '#FF0000')
```