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
exports.NodePixelFont = void 0;
var canvas_1 = require("canvas");
var fs = require("fs");
var xml2js_1 = require("xml2js");
var readFile = function (path) { return new Promise(function (resolve, reject) {
    fs.readFile(path, function (err, data) {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
}); };
var NodePixelFont = /** @class */ (function () {
    function NodePixelFont() {
        var _this = this;
        this.chars = {};
        this.validateFont = function (xmlObject) {
            if (!xmlObject.Font || !xmlObject.Font.$ || !xmlObject.Font.Char) {
                throw new Error('Invalid XML format');
            }
        };
        this.loadFont = function (pngFilePath, xmlFilePath) { return __awaiter(_this, void 0, void 0, function () {
            var data, xmlObject, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, readFile(xmlFilePath)];
                    case 1:
                        data = _b.sent();
                        return [4 /*yield*/, (0, xml2js_1.parseStringPromise)(data)];
                    case 2:
                        xmlObject = _b.sent();
                        this.validateFont(xmlObject);
                        this.chars = xmlObject.Font.Char.reduce(function (acc, node) {
                            if (node.$) {
                                acc[node.$.code] = {
                                    width: parseInt(node.$.width),
                                    offset: node.$.offset.split(' ').map(function (i) { return parseInt(i); }),
                                    rect: node.$.rect.split(' ').map(function (i) { return parseInt(i); })
                                };
                            }
                            return acc;
                        }, {});
                        _a = this;
                        return [4 /*yield*/, (0, canvas_1.loadImage)(pngFilePath)];
                    case 3:
                        _a.img = _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.draw = function (canvas, text, x, y, color, scale) {
            if (color === void 0) { color = '#FFFFFF'; }
            if (scale === void 0) { scale = 1; }
            return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!this.bufferCanvas || this.bufferCanvas.width !== canvas.width || this.bufferCanvas.height !== canvas.height) {
                        this.bufferCanvas = (0, canvas_1.createCanvas)(canvas.width, canvas.height);
                    }
                    text.split('').forEach(function (charStr) {
                        var char = _this.chars[charStr];
                        if (char) {
                            _this.drawChar(canvas, char, x, y, color, scale);
                            x += char.width * scale;
                        }
                    });
                    return [2 /*return*/];
                });
            });
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
            context.drawImage(bufferContext.canvas, charX, charY, charWidth, charHeight, charX, charY, charWidth, charHeight);
        };
    }
    return NodePixelFont;
}());
exports.NodePixelFont = NodePixelFont;
