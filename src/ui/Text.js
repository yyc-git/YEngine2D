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
        Init: function (string) {
            this.base();

            this.ye_string = string;
        },
        Private: {
            ye_string: null,
            ye_x: null,
            ye_y: null,
            _strokeEnabled: null,
            _fillEnabled: null,
            _strokeStyle: null,
            _strokeSize: null
        },
        Public: {
            initWhenCreate: function () {
                //默认使用fill

                this._fillEnabled = true;
                this._fillStyle = "green";

                this._strokeEnabled = false;

                this.ye_x = 0;
                this.ye_y = 0;
//                this.ye_string = "";
            },

            setString: function (string) {
                this.ye_string = string;
            },
            setPosition: function (x, y) {
                this.ye_x = x;
                this.ye_y = y;
            },
            enableStroke: function (strokeStyle, strokeSize) {
                this._strokeEnabled = true;
                this._fillEnabled = false;

                this._strokeStyle = strokeStyle;
                this._strokeSize = strokeSize;
            },
            enableFill: function (fillStyle) {
                this._fillEnabled = true;
                this._strokeEnabled = false;

                this._fillStyle = fillStyle;
            },
            draw: function(context){
                context.save();

                //todo 设置font
//                context.font = ""

                if(this._fillEnabled){
                    context.fillStyle = this._fillStyle;
                    context.fillText(this.ye_string, this.ye_x, this.ye_y);
                }
                else if(this._strokeEnabled){
                    context.strokeStyle = this._strokeStyle;
                    context.lineWidth = this._strokeSize;
                    context.strokeText(this.ye_string, this.ye_x, this.ye_y);
                }

                context.restore();
            }
        },
        Static: {
            create: function (string) {
                var text = new this(string);

                text.initWhenCreate();

                return text;
            }
        }
    });
}());