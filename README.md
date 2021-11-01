# node-pixel-font
Library that loads [BitmapFont](https://www.angelcode.com/products/bmfont/) and draw text in a [node-canvas](https://www.npmjs.com/package/canvas) or an HTML canvas.

# Node Dependencies
- [node-canvas](https://www.npmjs.com/package/canvas)
- [xml2js](https://www.npmjs.com/package/xml2js)

# HTML Dependencies
- [axios](https://github.com/axios/axios)

# How to generate a font
[BitFontMaker2](http://www.pentacom.jp/pentacom/bitfontmaker2/gallery) is a great source of bitmap font. You can download the ttf format, in which you can then transform it into a pixel font using [fontbuilder](https://github.com/andryblack/fontbuilder). Make sure to tweak the font size and DPI in order to not have any smoothing (the font is intended to work on a specific size. Anything in above or below would extrapolate and create antialias). This might require some try and error, but you can use the font image preview in the tool to visualize the output. I found that usually size 9 DPI 128 creates a good font quality. In the output tab, make sure to select PNG and XML formats.

# Usage
Install the library
```
npm install --save node-pixel-font
```

## Node example
Include the code
```typescript
    import { NodePixelFont } from 'node-pixel-font/lib/node-pixel-font'
    const font = new NodePixelFont()
    await font.loadFont('path/to/png-file.png', 'path/to/xml-file.xml')
    font.draw(canvas, 'Hello World !', 10, 20, '#00FF00')
```

## HTML example
Include the code
```typescript
    import { HTMLPixelFont } from 'node-pixel-font/lib/html-pixel-font'
    const font = new HTMLPixelFont()
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
 draw(canvas: Canvas, text: string, x: number | HorizontalAlignment, y: number | VerticalAlignment, color: string = '#FFFFFF', scale: number = 1, rect?: Rect): void
 ```

Draw the specified text into the provided canvas. Can specify the destination X and Y of the text, as well as color and scale factor. The last args rect is to align within smaller boundaries inside the canvas.

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