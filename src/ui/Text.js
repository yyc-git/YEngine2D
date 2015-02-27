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


//    var _textAlign = ["left", "center", "right"];
//    var _textBaseline = ["top", "middle", "bottom"];



//Support: English French German
//Other as Oriental Language
    //todo 暂时仅支持English，删除French、German的支持

    var _wordRex = /([a-zA-Z0-9?????ü?éè?àùê????]+|\S)/;
    var _symbolRex = /^[!,.:;}\]%\?>、‘“》？。，！]/;
    var _lastWordRex = /([a-zA-Z0-9?????ü?éè?àùê????]+|\S)$/;
    var _lastEnglishOrNum = /[a-zA-Z0-9?????ü?éè?àùê????]+$/;
    var _firstEnglishOrNum = /^[a-zA-Z0-9?????ü?éè?àùê????]/;
    var _lastInValidChar = /\s+$/;




    //todo 如何消除字体变更的闪动（用户可看到从默认字体变到指定字体的闪动）

    YE.Text = YYC.Class({Class: YE.Node, Interface: IText}, {
        Init: function (string, fontPath, fontSize, dimensions, xAlignment, yAlignment) {
            this.base();

            this.ye_string = string;
            this.ye_fontPath = fontPath || "sans-serif";
            this.ye_fontSize = fontSize || 10;
            this.ye_dimensions = dimensions;
            this.ye_xAlignment = xAlignment || YE.TEXT_XALIGNMENT.LEFT;
            this.ye_yAlignment = yAlignment || YE.TEXT_YALIGNMENT.TOP;
        },
        Private: {
            ye_string: null,
            ye_strArr: null,
            ye_fontPath: null,
            ye_fontFamily: null,
            ye_fontSize: null,
            ye_dimensions: null,
            ye_xAlignment: null,
            ye_yAlignment: null,
            ye_x: null,
            ye_y: null,
            ye_strokeEnabled: null,
            ye_fillEnabled: null,
            ye_strokeStyle: null,
            ye_strokeSize: null,
            ye_context: null,
            ye_lineHeight: null,
            ye_fontClientHeightCache: null,

            ye_getFontFamily: function (fontPath) {
                return YE.Tool.path.basename(fontPath, YE.Tool.path.extname(fontPath));
            },
            ye_formatText: function () {
                var i = 0;

                this.ye_trimStr();

                if(this.ye_dimensions.width !== 0){
                    this.ye_strArr = this.ye_string.split('\n');
//
                    for (i = 0; i < this.ye_strArr.length; i++) {
//                        this._checkWarp(this._strings, i, locDimensionsWidth);
                        this.ye_formatMultiLine(this.ye_strArr, i, this.ye_dimensions.width);
                    }
                }
            },
            ye_trimStr: function(){
                this.ye_string = this.ye_string.replace(_lastInValidChar, "");
            },
            ye_measure: function(text){
                var context = this.ye_context;

                context.font = this.ye_fontSize + "px '" + this.ye_fontFamily + "'";

                return context.measureText(text).width;
            },
            ye_formatMultiLine: function (strArr, i, maxWidth) {
                var text =strArr[i];
//                var text = lineStr
                var allWidth = this.ye_measure(text);

                if (allWidth > maxWidth && text.length > 1) {
                    //找到截断点
                    var LOOP_MAX_NUM = 100;
                    //increased while cycle maximum ceiling. default 100 time
                    var loopIndex = 0;

                    //尝试按maxWidth / width 比值，来截断字符串。
                    //fuzzyLen为截取点序号
                    var fuzzylen = text.length * ( maxWidth / allWidth ) | 0;
                    var nextText = text.substr(fuzzylen);
                    var width = allWidth - this.ye_measure(nextText);
                    var pushNum = 0;

                    //exceeded the size
                    //处理完后，fuzzylen会小于等于截取点
                    while (width > maxWidth && loopIndex < LOOP_MAX_NUM) {
                        //尝试按maxWidth / width 比值，来截断字符串。
                        //如果字符串仍然过长，则再次按maxWidth / width（< 1）来截取
                        fuzzylen *= maxWidth / width;
                        //| 0 取整？
//                        fuzzylen = fuzzylen | 0;
                        fuzzylen = YE.Tool.math.floor(fuzzylen);
                        nextText = text.substr(fuzzylen);
                        width = allWidth - this.ye_measure(nextText);
                        loopIndex = loopIndex + 1;
                    }

                    loopIndex = 0;





                    //find the truncation point
                    //以单词为步长来判断（如果是中文，则步长为1）
                    //处理后，fuzzylen为超过width的单词最后一个字符的序号，nextText

                    while(width < maxWidth && loopIndex < LOOP_MAX_NUM){
                        if(nextText){
                            var exec = _wordRex.exec(nextText);
                            pushNum = exec ? exec[0].length : 1;
                        }
                        fuzzylen = fuzzylen + pushNum;
                        nextText = text.substr(fuzzylen);
                        width = allWidth - this.ye_measure(nextText);
                        loopIndex = loopIndex + 1;
                    }

                    var preText = text.substr(0, fuzzylen);

                    //todo 判断symbol有什么用？
                    //如果wrapInspection为true，则行首字符不能为标点符号

//                    //symbol in the first
//                    if (cc.labelttf.wrapInspection) {
//                        if (cc.labelttf._symbolrex.test(sline || tmptext)) {
//                            result = cc.labelttf._lastwordrex.exec(stext);
//                            fuzzylen -= result ? result[0].length : 0;
//
//                            sline = text.substr(fuzzylen);
//                            stext = text.substr(0, fuzzylen);
//                        }
//                    }

                    //不能截断一个单词

                    //To judge whether a English words are truncated
//                    var pExec = _lastEnglishOrNum.exec(preText);

                    if(_firstEnglishOrNum.test(nextText) ){
                        var pExec = _lastEnglishOrNum.exec(preText);
//                        if (fExec && preText !== result[0]) {
                        if(pExec){
                            fuzzylen = fuzzylen - pExec[0].length;
                        }
                    }
                    else{
                        fuzzylen = fuzzylen - pushNum;
                    }

                    if (fuzzylen === 0) {
                        fuzzylen = 1;
                    }

                    nextText = text.substr(fuzzylen);
                    preText = text.substr(0, fuzzylen);


                    strArr[i] = nextText;
                    strArr.splice(i, 0, preText);
                }
            }
        },
        Public: {
            initWhenCreate: function () {
                //默认使用fill

                this.ye_fillEnabled = true;
                this.ye_fillStyle = "rgba(0, 0, 0, 1)";

                this.ye_strokeEnabled = false;

                this.ye_x = 0;
                this.ye_y = 0;
//                this.ye_string = "";

                if (YE.Tool.path.isPath(this.ye_fontPath)) {
//                    等待加载完成后再渲染（加入到preLoad中？）
//                    YE.FontLoader.getInstance().load(this.ye_fontPath);
                    this.ye_fontFamily = this.ye_getFontFamily(this.ye_fontPath);
                }
                else {
                    this.ye_fontFamily = this.ye_fontPath;
                }

                //默认为0
                this.ye_dimensions.height = this.ye_dimensions.height || 0;
            },
            init: function (parent) {
                this.base(parent);

                this.ye_fontClientHeightCache = YE.Hash.create();
                this.ye_context = parent.getContext();

                this.ye_formatText();
                this.ye_lineHeight = this.ye_getDefaultLineHeight();
            },
            setString: function (string) {
                this.ye_string = string;
            },
            setPosition: function (x, y) {
                this.ye_x = x;
                this.ye_y = y;
            },
            setFillStyle: function(fillStyle){
                this.ye_fillStylele = fillStyle;
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

                this.ye_fillStylele = fillStyle;
            },
            setLineHeight: function(lineHeight){
                this.ye_lineHeight = lineHeight;
            },
            ye_getDefaultLineHeight: function(){
                return this.ye_computeLineHeight("normal");
            },
            ye_getFontClientHeight: function(){
                var fontSize = this.ye_fontSize,
                    fontName = this.ye_fontFamily;
                var key = fontSize+"." + fontName;
                var cacheHeight = this.ye_fontClientHeightCache.getValue(key);
                var height = null;

                if(cacheHeight){
                    return cacheHeight;
                }

                height = this.ye_computeLineHeight(1);
                this.ye_fontClientHeightCache.addChild(key, height);

                return height;
            },
            ye_computeLineHeight: function(lineHeight){
                var div = YE.$.newElement("div");

                div.style.cssText = "font-family: " + this.ye_fontFamily
                + "; font-size: " + this.ye_fontSize + "px"
                + "; position: absolute; left: -100px; top: -100px; line-height: " + lineHeight + ";";

                YE.$("body").prepend(div);
                div.innerHTML = "abc!";
                lineHeight = div.clientHeight;

                YE.$(div).remove();

                return lineHeight;
            },
            draw: function (context) {
                //todo 待优化：如果文字没有变化，则不重绘

                context.save();

                //context.strokeStyle = "green";
                //context.strokeRect(400, 100, 400, 300);

                context.font = this.ye_fontSize + "px '" + this.ye_fontFamily + "'";

//                context.textBaseline = _textAlign[this.ye_yAlignment];
//                context.textAlign = _textBaseline[this.ye_xAlignment];
                context.textBaseline = "top";
                context.textAlign = "start";


                //如果多行
                //依次显示出来，并设置水平和垂直对齐



                //否则（单行）
                //显示，设置水平和垂直对齐
                //多行
                if(this.ye_strArr.length > 1){
                    var lineHeight = this.ye_lineHeight;
                    var fontClientHeight = this.ye_getFontClientHeight();
                    var self = this;
                    var y = this.ye_y;
                    var x = this.ye_x;

                    var lineCount = this.ye_strArr.length;
                    //最后一行的行高为字体本身的高度
                    var lineTotalHeight = (lineCount - 1) * lineHeight + fontClientHeight;

                    if(self.ye_yAlignment === YE.TEXT_YALIGNMENT.BOTTOM){
                        y = y + self.ye_dimensions.height - lineTotalHeight;
                    }
                    else if(self.ye_yAlignment === YE.TEXT_YALIGNMENT.MIDDLE){
                        y = y + (self.ye_dimensions.height - lineTotalHeight) / 2;
                    }

                    this.ye_strArr.forEach(function(str, index){
                        if(self.ye_xAlignment === YE.TEXT_XALIGNMENT.RIGHT){
                            x = x + self.ye_dimensions.width - self.ye_measure(str);
                        }
                        else if(self.ye_xAlignment == YE.TEXT_XALIGNMENT.CENTER){
                            x = x + (self.ye_dimensions.width - self.ye_measure(str)) / 2;
                        }



                        if (self.ye_fillEnabled) {
                            context.fillStyle = self.ye_fillStylele;
                            context.fillText(str, x, y);
                        }
                        else if (self.ye_strokeEnabled) {
                            context.strokeStyle = self.ye_strokeStyle;
                            context.lineWidth = self.ye_strokeSize;
                            context.strokeText(str, x, y);
                        }

                        x = self.ye_x;
                        y = y + lineHeight;
                    });
                }
                else{
                    //var lineHeight = this.ye_lineHeight;
                    var fontClientHeight = this.ye_getFontClientHeight();
                    var self = this;
                    var y = this.ye_y;
                    var x = this.ye_x;

                    var lineCount = 1;
                    //最后一行的行高为字体本身的高度
                    var lineTotalHeight = fontClientHeight;

                    var str = this.ye_strArr[0];

                    if(self.ye_yAlignment === YE.TEXT_YALIGNMENT.BOTTOM){
                        y = y + self.ye_dimensions.height - lineTotalHeight;
                    }
                    else if(self.ye_yAlignment === YE.TEXT_YALIGNMENT.MIDDLE){
                        y = y + (self.ye_dimensions.height - lineTotalHeight) / 2;
                    }

                    if(self.ye_xAlignment === YE.TEXT_XALIGNMENT.RIGHT){
                        x = x + self.ye_dimensions.width - self.ye_measure(str);
                    }
                    else if(self.ye_xAlignment == YE.TEXT_XALIGNMENT.CENTER){
                        x = x + (self.ye_dimensions.width - self.ye_measure(str)) / 2;
                    }



                    if (self.ye_fillEnabled) {
                        context.fillStyle = self.ye_fillStylele;
                        context.fillText(str, x, y);
                    }
                    else if (self.ye_strokeEnabled) {
                        context.strokeStyle = self.ye_strokeStyle;
                        context.lineWidth = self.ye_strokeSize;
                        context.strokeText(str, x, y);
                    }

                    x = self.ye_x;
                    y = y + lineHeight;
                }




                context.restore();
            }
        },
        Static: {
            create: function (string, fontPath, fontSize, dimensions, xAlignment, yAlignment) {
                var text = new this(string, fontPath, fontSize, dimensions, xAlignment, yAlignment);

                text.initWhenCreate();

                return text;
            }
        }
    });
}());