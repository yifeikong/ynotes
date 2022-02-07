"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.renderer = void 0;
var highlight_js_1 = __importDefault(require("highlight.js"));
exports.renderer = {
    heading: function (text, level) {
        var sizeClass;
        if (level <= 2) {
            sizeClass = "text-xl";
        }
        else {
            sizeClass = "";
        }
        var className = "my-2 font-semibold ".concat(sizeClass);
        return "<h".concat(level, " class=\"").concat(className, "\">").concat(text, "</h").concat(level, ">");
    },
    paragraph: function (text) {
        return "<p class=\"my-4 font-light\">".concat(text, "</p>");
    },
    code: function (code, infostring, escaped) {
        var highlighted;
        try {
            if (!infostring) {
                highlighted = highlight_js_1["default"].highlightAuto(code).value;
            }
            else {
                highlighted = highlight_js_1["default"].highlight(code, { language: infostring }).value;
            }
        }
        catch (e) {
            highlighted = code;
        }
        return "<pre class=\"text-sm bg-gray-100 my-4 p-2 overflow-x-auto\"><code>".concat(highlighted, "</code></pre>");
    },
    list: function (body, ordered, start) {
        var el = ordered ? "ol" : "ul";
        return "<".concat(el, " class=\"my-4 ml-4 font-light ").concat(ordered ? "list-decimal" : "list-disc", "\">").concat(body, "</").concat(el, ">");
    },
    listitem: function (text, task, checked) {
        return "<li class=\"\">".concat(text, "</li>");
    }
};
