"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelFont = void 0;
var types_1 = require("./types");
var PixelFont = /** @class */ (function () {
    function PixelFont() {
        var _this = this;
        this.chars = {};
        this.options = {};
        this.loadFont = function (_pngFilePath, _xmlFilePath, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.options = options;
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        this.setOptions = function (options) {
            _this.options = options;
        };
        this.getCharWidth = function (charStr) {
            if (charStr === ' ' && _this.options.spacing !== undefined) {
                return _this.options.spacing;
            }
            return _this.chars[charStr].width;
        };
        this.getPositionRect = function (canvas, text, initialX, initialY, scale, rect) {
            if (rect === void 0) { rect = { x: 0, y: 0, width: 0, height: 0 }; }
            var width = text
                .split('')
                .map(function (charStr) { return _this.chars[charStr] ? _this.getCharWidth(charStr) * scale : 0; })
                .reduce(function (prev, cur) { return prev + cur; });
            var height = Math.max.apply(Math, text
                .split('')
                .map(function (charStr) { return _this.chars[charStr] ? _this.chars[charStr].rect[3] * scale : 0; }));
            var offsetY = Math.min.apply(Math, text
                .split('')
                .map(function (charStr) { return _this.chars[charStr] ? _this.chars[charStr].offset[1] * scale : 0; }));
            var x = 0, y = 0;
            if (typeof initialX === 'string') {
                switch (initialX) {
                    case types_1.HorizontalAlignment.Center:
                        x = ((rect.width || canvas.width) - width) / 2;
                        break;
                    case types_1.HorizontalAlignment.Right:
                        x = (rect.width || canvas.width) - width;
                        break;
                    case types_1.HorizontalAlignment.Left:
                        x = rect.x;
                }
            }
            else {
                x = initialX;
            }
            if (typeof initialY === 'string') {
                switch (initialY) {
                    case types_1.VerticalAlignment.Middle:
                        y = ((rect.height || canvas.height) - height) / 2 - offsetY;
                        break;
                    case types_1.VerticalAlignment.Bottom:
                        y = (rect.height || canvas.height) - height - offsetY;
                        break;
                    case types_1.VerticalAlignment.Top:
                        y = -offsetY;
                }
            }
            else {
                y = initialY;
            }
            return {
                width: Math.round(width),
                height: Math.round(height),
                x: Math.round(x + rect.x),
                y: Math.round(y + rect.y)
            };
        };
        this.draw = function (canvas, text, initialX, initialY, color, scale, rect) {
            if (color === void 0) { color = '#FFFFFF'; }
            if (scale === void 0) { scale = 1; }
            if (!_this.bufferCanvas) {
                throw new Error('You must instanciate the buffer canvas in the constructor');
            }
            else {
                _this.bufferCanvas.width = canvas.width;
                _this.bufferCanvas.height = canvas.height;
            }
            var positionRect = _this.getPositionRect(canvas, text, initialX, initialY, scale, rect);
            var x = positionRect.x, y = positionRect.y;
            text.split('').forEach(function (charStr) {
                var char = _this.chars[charStr];
                if (char) {
                    _this.drawChar(canvas, char, x, y, color, scale);
                    x += char.width * scale;
                }
            });
            return positionRect;
        };
        this.drawChar = function (canvas, char, x, y, color, scale) {
            var bufferContext = _this.bufferCanvas.getContext('2d');
            var context = canvas.getContext('2d');
            var charX = x + char.offset[0] * scale;
            var charY = y + char.offset[1] * scale;
            var charWidth = char.rect[2] * scale;
            var charHeight = char.rect[3] * scale;
            // Draw the font in a temporary context where smoothing is disabled
            bufferContext.imageSmoothingEnabled = false;
            bufferContext.drawImage(_this.img, char.rect[0], char.rect[1], char.rect[2], char.rect[3], charX, charY, charWidth, charHeight);
            bufferContext.fillStyle = color;
            bufferContext.globalCompositeOperation = 'source-in';
            bufferContext.fillRect(charX, charY, charWidth, charHeight);
            bufferContext.globalCompositeOperation = 'source-over';
            // Draw the char in the real context
            context.drawImage(_this.bufferCanvas, charX, charY, charWidth, charHeight, charX, charY, charWidth, charHeight);
        };
    }
    return PixelFont;
}());
exports.PixelFont = PixelFont;
