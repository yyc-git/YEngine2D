/**YEngine2D
 * author：YYC
 * date：2015-01-19
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    var IText = YYC.Interface(
        "setString",
        "enableStroke",
        "enableFill",
//        "setFontFillColor",
//        "setFontName",
//        "setFontSize",
//        "setDimensions",
        "setPosition");


    YE.Text = YYC.Class({Class: YE.Node, Interface: IText}, {
        Init: function (string, fontPath, fontSize) {
            this.base();

            this.ye_string = string;
            this.ye_fontPath = fontPath || "sans-serif";
            this.ye_fontSize = fontSize || 10;
        },
        Private: {
            ye_string: null,
            ye_fontPath: null,
            ye_fontName: null,
            ye_fontSize: null,
            ye_x: null,
            ye_y: null,
            ye_strokeEnabled: null,
            ye_fillEnabled: null,
            ye_strokeStyle: null,
            ye_strokeSize: null,

            ye_getFontName: function (fontPath) {
                return YE.Tool.path.basename(fontPath, YE.Tool.path.extname(fontPath));
            }
        },
        Public: {
            initWhenCreate: function () {
                //默认使用fill

                this.ye_fillEnabled = true;
                this._fillStyle = "green";

                this.ye_strokeEnabled = false;

                this.ye_x = 0;
                this.ye_y = 0;
//                this.ye_string = "";

                if (YE.Tool.path.isPath(this.ye_fontPath)) {
//                    等待加载完成后再渲染（加入到preLoad中？）
//                    YE.FontLoader.getInstance().load(this.ye_fontPath);
                    this.ye_fontName = this.ye_getFontName(this.ye_fontPath);
                }
                else {
                    this.ye_fontName = this.ye_fontPath;
                }
            },

            setString: function (string) {
                this.ye_string = string;
            },
            setPosition: function (x, y) {
                this.ye_x = x;
                this.ye_y = y;
            },
            enableStroke: function (strokeStyle, strokeSize) {
                this.ye_strokeEnabled = true;
                this.ye_fillEnabled = false;

                this.ye_strokeStyle = strokeStyle;
                this.ye_strokeSize = strokeSize;
            },
            enableFill: function (fillStyle) {
                this.ye_fillEnabled = true;
                this.ye_strokeEnabled = false;

                this._fillStyle = fillStyle;
            },
            draw: function (context) {
                context.save();

                context.font = this.ye_fontSize + "px '" + this.ye_fontName + "'";

                if (this.ye_fillEnabled) {
                    context.fillStyle = this._fillStyle;
                    context.fillText(this.ye_string, this.ye_x, this.ye_y);
                }
                else if (this.ye_strokeEnabled) {
                    context.strokeStyle = this.ye_strokeStyle;
                    context.lineWidth = this.ye_strokeSize;
                    context.strokeText(this.ye_string, this.ye_x, this.ye_y);
                }

                context.restore();
            }
        },
        Static: {
            create: function (string, fontPath, fontSize) {
                var text = new this(string, fontPath, fontSize);

                text.initWhenCreate();

                return text;
            }
        }
    });
}());