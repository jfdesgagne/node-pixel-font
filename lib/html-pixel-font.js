"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.HTMLPixelFont = void 0;
var axios_1 = require("axios");
var base_pixel_font_1 = require("./base-pixel-font");
var loadImage = function (path) { return new Promise(function (resolve, reject) {
    var img = new Image();
    img.addEventListener('load', function () { return resolve(img); });
    img.addEventListener('error', function (err) { return reject(err); });
    img.src = path;
}); };
var HTMLPixelFont = /** @class */ (function (_super) {
    __extends(HTMLPixelFont, _super);
    function HTMLPixelFont() {
        var _this = _super.call(this) || this;
        _this.validateFont = function (xmlObject) {
            var fontTags = xmlObject.querySelectorAll('Font');
            if (fontTags.length !== 1 || fontTags[0].querySelectorAll('Char').length < 1) {
                throw new Error('Invalid XML format');
            }
        };
        _this.loadFont = function (pngFilePath, xmlFilePath) { return __awaiter(_this, void 0, void 0, function () {
            var data, parser, xmlDoc, chars, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(xmlFilePath)];
                    case 1:
                        data = (_b.sent()).data;
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(data, 'text/xml');
                        this.validateFont(xmlDoc);
                        chars = Array.from(xmlDoc.querySelector('Font').querySelectorAll('Char'));
                        this.chars = chars.reduce(function (acc, node) {
                            if (node) {
                                acc[node.getAttribute('code')] = {
                                    width: parseInt(node.getAttribute('width')),
                                    offset: node.getAttribute('offset').split(' ').map(function (i) { return parseInt(i); }),
                                    rect: node.getAttribute('rect').split(' ').map(function (i) { return parseInt(i); })
                                };
                            }
                            return acc;
                        }, {});
                        _a = this;
                        return [4 /*yield*/, loadImage(pngFilePath)];
                    case 2:
                        _a.img = _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.bufferCanvas = document.createElement('canvas');
        return _this;
    }
    return HTMLPixelFont;
}(base_pixel_font_1.PixelFont));
exports.HTMLPixelFont = HTMLPixelFont;
