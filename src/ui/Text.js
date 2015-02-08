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


    var _textAlign = ["left", "center", "right"];
    var _textBaseline = ["top", "middle", "bottom"];



//Support: English French German
//Other as Oriental Language
    //todo 暂时仅支持English，删除French、German的支持

    var _wordRex = /([a-zA-Z0-9?????ü?éè?àùê????]+|\S)/;
    var _symbolRex = /^[!,.:;}\]%\?>、‘“》？。，！]/;
    var _lastWordRex = /([a-zA-Z0-9?????ü?éè?àùê????]+|\S)$/;
    var _lastEnglish = /[a-zA-Z0-9?????ü?éè?àùê????]+$/;
    var _firsrEnglish = /^[a-zA-Z0-9?????ü?éè?àùê????]/;





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

            ye_getFontName: function (fontPath) {
                return YE.Tool.path.basename(fontPath, YE.Tool.path.extname(fontPath));
            },
            ye_formatText: function () {
                if(this.ye_dimensions.width !== 0){
                    this.ye_strArr = this.ye_string.split('\n');
//
                    for (i = 0; i < this.ye_strArr.length; i++) {
//                        this._checkWarp(this._strings, i, locDimensionsWidth);
                        this.ye_formatMultiLine(this.ye_strArr, i, this.ye_dimensions.width);
                    }
                }


                //todo 设置精灵的大小（dimensions）


//                var node = this._node;
//                var locDimensionsWidth = node._dimensions.width, i, strLength;
//                var locLineWidth = this._lineWidths;
//                locLineWidth.length = 0;
//
//                this._isMultiLine = false;
//                this.ye_measureConfig();
//                if (locDimensionsWidth !== 0) {
//                    // Content processing
//                    this._strings = node._string.split('\n');
//
//                    for (i = 0; i < this._strings.length; i++) {
//                        this._checkWarp(this._strings, i, locDimensionsWidth);
//                    }
//                } else {
//                    this._strings = node._string.split('\n');
//                    for (i = 0, strLength = this._strings.length; i < strLength; i++) {
//                        locLineWidth.push(this.ye_measure(this._strings[i]));
//                    }
//                }
//
//                if (this._strings.length > 0)
//                    this._isMultiLine = true;
//
//                var locSize, locStrokeShadowOffsetX = 0, locStrokeShadowOffsetY = 0;
//                if (node._strokeEnabled)
//                    locStrokeShadowOffsetX = locStrokeShadowOffsetY = node._strokeSize * 2;
//                if (node._shadowEnabled) {
//                    var locOffsetSize = node._shadowOffset;
//                    locStrokeShadowOffsetX += Math.abs(locOffsetSize.x) * 2;
//                    locStrokeShadowOffsetY += Math.abs(locOffsetSize.y) * 2;
//                }
//
//                //get offset for stroke and shadow
//                if (locDimensionsWidth === 0) {
//                    if (this._isMultiLine)
//                        locSize = cc.size(0 | (Math.max.apply(Math, locLineWidth) + locStrokeShadowOffsetX),
//                            0 | ((this._fontClientHeight * this._strings.length) + locStrokeShadowOffsetY));
//                    else
//                        locSize = cc.size(0 | (this.ye_measure(node._string) + locStrokeShadowOffsetX), 0 | (this._fontClientHeight + locStrokeShadowOffsetY));
//                } else {
//                    if (node._dimensions.height === 0) {
//                        if (this._isMultiLine)
//                            locSize = cc.size(0 | (locDimensionsWidth + locStrokeShadowOffsetX), 0 | ((node.getLineHeight() * this._strings.length) + locStrokeShadowOffsetY));
//                        else
//                            locSize = cc.size(0 | (locDimensionsWidth + locStrokeShadowOffsetX), 0 | (node.getLineHeight() + locStrokeShadowOffsetY));
//                    } else {
//                        //dimension is already set, contentSize must be same as dimension
//                        locSize = cc.size(0 | (locDimensionsWidth + locStrokeShadowOffsetX), 0 | (node._dimensions.height + locStrokeShadowOffsetY));
//                    }
//                }
//                node.setContentSize(locSize);
//                node._strokeShadowOffsetX = locStrokeShadowOffsetX;
//                node._strokeShadowOffsetY = locStrokeShadowOffsetY;
//
//                // need computing _anchorPointInPoints
//                var locAP = node._anchorPoint;
//                this._anchorPointInPoints.x = (locStrokeShadowOffsetX * 0.5) + ((locSize.width - locStrokeShadowOffsetX) * locAP.x);
//                this._anchorPointInPoints.y = (locStrokeShadowOffsetY * 0.5) + ((locSize.height - locStrokeShadowOffsetY) * locAP.y);
            },
            ye_measure: function(text){
                var context = this.ye_context;

                context.font = this.ye_fontSize + "px '" + this.ye_fontFamily + "'";

                return context.measureText(text).width;
            },
            ye_formatMultiLine: function (strArr, i, maxWidth) {
                var text =strArr[i];
//                var text = lineStr;
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

//
//
//                    fuzzyLen -= pushNum;
//                    if (fuzzyLen === 0) {
//                        fuzzyLen = 1;
//                        sLine = sLine.substr(1);
//                    }
//
//                    var preText = text.substr(0, fuzzyLen), result;


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
//                    var pExec = _lastEnglish.exec(preText);

                    if(_firsrEnglish.test(nextText) ){
                        var fExec = _firstEnglish.exec(nextText);
//                        if (fExec && preText !== result[0]) {
                        if(fExec){
                            fuzzylen = fuzzylen - fExec[0].length;
                            nextText = text.substr(fuzzylen);
                            preText = text.substr(0, fuzzylen);
                        }
                    }
                    else{
                        fuzzylen = fuzzylen - pushNum;
                        preText = text.substr(0, fuzzylen);
                        if (fuzzylen === 0) {
                            fuzzylen = 1;
                            nextText = nextText.substr(1);
                        }
                        else{
                            nextText = text.substr(fuzzylen);
                        }
                    }



//                    strArr[i] = sLine || nextText;
                    strArr[i] = nextText;
                    strArr.splice(i, 0, preText);
                }



//                if (allWidth > maxWidth && text.length > 1) {
//
//                    var fuzzyLen = text.length * ( maxWidth / allWidth ) | 0;
//                    var tmpText = text.substr(fuzzyLen);
//                    var width = allWidth - this.ye_measure(tmpText);
//                    var sLine;
//                    var pushNum = 0;
//
//                    //Increased while cycle maximum ceiling. default 100 time
//                    var checkWhile = 0;
//
//                    //Exceeded the size
//                    while (width > maxWidth && checkWhile++ < 100) {
//                        fuzzyLen *= maxWidth / width;
//                        fuzzyLen = fuzzyLen | 0;
//                        tmpText = text.substr(fuzzyLen);
//                        width = allWidth - this.ye_measure(tmpText);
//                    }
//
//                    checkWhile = -1;
//
//                    //Find the truncation point
//                    while (width < maxWidth && checkWhile++ < 100) {
//                        if (tmpText) {
//                            var exec = cc.LabelTTF._wordRex.exec(tmpText);
//                            pushNum = exec ? exec[0].length : 1;
//                            sLine = tmpText;
//                        }
//
//                        fuzzyLen = fuzzyLen + pushNum;
//                        tmpText = text.substr(fuzzyLen);
//                        width = allWidth - this.ye_measure(tmpText);
//                    }
//
//                    fuzzyLen -= pushNum;
//                    if (fuzzyLen === 0) {
//                        fuzzyLen = 1;
//                        sLine = sLine.substr(1);
//                    }
//
//                    var preText = text.substr(0, fuzzyLen), result;
//
//                    //symbol in the first
//                    if (cc.LabelTTF.wrapInspection) {
//                        if (cc.LabelTTF._symbolRex.test(sLine || tmpText)) {
//                            result = cc.LabelTTF._lastWordRex.exec(preText);
//                            fuzzyLen -= result ? result[0].length : 0;
//
//                            sLine = text.substr(fuzzyLen);
//                            preText = text.substr(0, fuzzyLen);
//                        }
//                    }
//
//                    //To judge whether a English words are truncated
//                    if (cc.LabelTTF._firsrEnglish.test(sLine)) {
//                        result = cc.LabelTTF._lastEnglish.exec(preText);
//                        if (result && preText !== result[0]) {
//                            fuzzyLen -= result[0].length;
//                            sLine = text.substr(fuzzyLen);
//                            preText = text.substr(0, fuzzyLen);
//                        }
//                    }
//
//                    strArr[i] = sLine || tmpText;
//                    strArr.splice(i, 0, preText);
//                }
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
                    this.ye_fontFamily = this.ye_getFontName(this.ye_fontPath);
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



//                div.css({
//                    fontFamily: this.ye_fontFamily,
//                    fontSize: this.ye_fontSize,
//                    position: "absolute",
//                    left: "-100px",
//                    top: "-100px",
//                    lineHeight: "normal"
//                });

//                div.appendTo($("body"));
                YE.$("body").prepend(div);
                div.innerHTML = "abc!";
                lineHeight = div.clientHeight;

                YE.$(div).remove();

                return lineHeight;

//                cc.LabelTTF.__labelHeightDiv = cc.newElement("div");
//                cc.LabelTTF.__labelHeightDiv.style.fontFamily = "Arial";
//                cc.LabelTTF.__labelHeightDiv.style.position = "absolute";
//                cc.LabelTTF.__labelHeightDiv.style.left = "-100px";
//                cc.LabelTTF.__labelHeightDiv.style.top = "-100px";
//                cc.LabelTTF.__labelHeightDiv.style.lineHeight = "normal";
//
//                document.body ?
//                    document.body.appendChild(cc.LabelTTF.__labelHeightDiv) :
//                    cc._addEventListener(window, 'load', function () {
//                        this.removeEventListener('load', arguments.callee, false);
//                        document.body.appendChild(cc.LabelTTF.__labelHeightDiv);
//                    }, false);
//
//                cc.LabelTTF.__getFontHeightByDiv = function (fontName, fontSize) {
//                    var clientHeight = cc.LabelTTF.__fontHeightCache[fontName + "." + fontSize];
//                    if (clientHeight > 0) return clientHeight;
//                    var labelDiv = cc.LabelTTF.__labelHeightDiv;
//                    labelDiv.innerHTML = "ajghl~!";
//                    labelDiv.style.fontFamily = fontName;
//                    labelDiv.style.fontSize = fontSize + "px";
//                    clientHeight = labelDiv.clientHeight;
//                    cc.LabelTTF.__fontHeightCache[fontName + "." + fontSize] = clientHeight;
            },
            draw: function (context) {
                //todo 待优化：如果文字没有变化，则不重绘

                context.save();

                //todo 测试测试代码
                context.strokeStyle = "green";
                context.strokeRect(400, 100, 400, 300);

                context.font = this.ye_fontSize + "px '" + this.ye_fontFamily + "'";

//                context.textBaseline = _textAlign[this.ye_yAlignment];
//                context.textAlign = _textBaseline[this.ye_xAlignment];
                context.textBaseline = "top";
                context.textAlign = "start";


                //如果多行
                //依次显示出来，并设置水平和垂直对齐



                //否则（单行）
                //显示，设置水平和垂直对齐
                var lineHeight = this.ye_lineHeight;
                var fontClientHeight = this.ye_getFontClientHeight();
                var self = this;
                var y = this.ye_y;
var x = this.ye_x;

//                context.fillStyle = self._fillStyle;
//                context.fillText("阿斯顿", x, 0);



//                if (locyAlignment === cc.TEXT_ALIGNMENT_RIGHT)
//                    xOffset += locContentWidth;
//                else if (locyAlignment === cc.TEXT_ALIGNMENT_CENTER)
//                    xOffset += locContentWidth / 2;
//                else
//                    xOffset += 0;
//                if (this._isMultiLine) {
//                    var locStrLen = this._strings.length;
//                    if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
//                        yOffset = lineHeight - transformTop * 2 + locContentSizeHeight - lineHeight * locStrLen;
//                    else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
//                        yOffset = (lineHeight - transformTop * 2) / 2 + (locContentSizeHeight - lineHeight * locStrLen) / 2;

                //多行
                if(this.ye_strArr.length > 1){
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
                            context.fillStyle = self._fillStyle;
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

//                var lineHeight = node.getLineHeight();
//                var transformTop = (lineHeight - this._fontClientHeight) / 2;
//
//                if (locyAlignment === cc.TEXT_ALIGNMENT_RIGHT)
//                    xOffset += locContentWidth;
//                else if (locyAlignment === cc.TEXT_ALIGNMENT_CENTER)
//                    xOffset += locContentWidth / 2;
//                else
//                    xOffset += 0;
//                if (this._isMultiLine) {
//                    var locStrLen = this._strings.length;
//                    if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
//                        yOffset = lineHeight - transformTop * 2 + locContentSizeHeight - lineHeight * locStrLen;
//                    else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
//                        yOffset = (lineHeight - transformTop * 2) / 2 + (locContentSizeHeight - lineHeight * locStrLen) / 2;
//
//                    for (var i = 0; i < locStrLen; i++) {
//                        var line = this._strings[i];
//                        var tmpOffsetY = -locContentSizeHeight + (lineHeight * i + transformTop) + yOffset;
//                        if (locStrokeEnabled)
//                            context.strokeText(line, xOffset, tmpOffsetY);
//                        context.fillText(line, xOffset, tmpOffsetY);
//                    }
//                } else {
//                    if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM) {
//                        //do nothing
//                    } else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
//                        yOffset -= locContentSizeHeight;
//                    } else {
//                        yOffset -= locContentSizeHeight * 0.5;
//                    }
//                    if (locStrokeEnabled)
//                        context.strokeText(node._string, xOffset, yOffset);
//                    context.fillText(node._string, xOffset, yOffset);
//                }
//            };
//
//
//







                context.restore();
            }



            /*
             proto._drawTTFInCanvas = function (context) {
             if (!context)
             return;
             var node = this._node;
             var locStrokeShadowOffsetX = node._strokeShadowOffsetX, locStrokeShadowOffsetY = node._strokeShadowOffsetY;
             var locContentSizeHeight = node._contentSize.height - locStrokeShadowOffsetY, locVAlignment = node._vAlignment,
             locyAlignment = node._yAlignment, locStrokeSize = node._strokeSize;

             context.setTransform(1, 0, 0, 1, 0 + locStrokeShadowOffsetX * 0.5, locContentSizeHeight + locStrokeShadowOffsetY * 0.5);

             //this is fillText for canvas
             if (context.font != this._fontStyleStr)
             context.font = this._fontStyleStr;
             context.fillStyle = this._fillColorStr;

             var xOffset = 0, yOffset = 0;
             //stroke style setup
             var locStrokeEnabled = node._strokeEnabled;
             if (locStrokeEnabled) {
             context.lineWidth = locStrokeSize * 2;
             context.strokeStyle = this._strokeColorStr;
             }

             //shadow style setup
             if (node._shadowEnabled) {
             var locShadowOffset = node._shadowOffset;
             context.shadowColor = this._shadowColorStr;
             context.shadowOffsetX = locShadowOffset.x;
             context.shadowOffsetY = -locShadowOffset.y;
             context.shadowBlur = node._shadowBlur;
             }

             context.textBaseline = cc.LabelTTF._textBaseline[locVAlignment];
             context.textAlign = cc.LabelTTF._textAlign[locyAlignment];

             var locContentWidth = node._contentSize.width - locStrokeShadowOffsetX;

             //lineHeight
             var lineHeight = node.getLineHeight();
             var transformTop = (lineHeight - this._fontClientHeight) / 2;

             if (locyAlignment === cc.TEXT_ALIGNMENT_RIGHT)
             xOffset += locContentWidth;
             else if (locyAlignment === cc.TEXT_ALIGNMENT_CENTER)
             xOffset += locContentWidth / 2;
             else
             xOffset += 0;
             if (this._isMultiLine) {
             var locStrLen = this._strings.length;
             if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
             yOffset = lineHeight - transformTop * 2 + locContentSizeHeight - lineHeight * locStrLen;
             else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
             yOffset = (lineHeight - transformTop * 2) / 2 + (locContentSizeHeight - lineHeight * locStrLen) / 2;

             for (var i = 0; i < locStrLen; i++) {
             var line = this._strings[i];
             var tmpOffsetY = -locContentSizeHeight + (lineHeight * i + transformTop) + yOffset;
             if (locStrokeEnabled)
             context.strokeText(line, xOffset, tmpOffsetY);
             context.fillText(line, xOffset, tmpOffsetY);
             }
             } else {
             if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM) {
             //do nothing
             } else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
             yOffset -= locContentSizeHeight;
             } else {
             yOffset -= locContentSizeHeight * 0.5;
             }
             if (locStrokeEnabled)
             context.strokeText(node._string, xOffset, yOffset);
             context.fillText(node._string, xOffset, yOffset);
             }
             };






             cc.LabelTTF.__labelHeightDiv = cc.newElement("div");
             cc.LabelTTF.__labelHeightDiv.style.fontFamily = "Arial";
             cc.LabelTTF.__labelHeightDiv.style.position = "absolute";
             cc.LabelTTF.__labelHeightDiv.style.left = "-100px";
             cc.LabelTTF.__labelHeightDiv.style.top = "-100px";
             cc.LabelTTF.__labelHeightDiv.style.lineHeight = "normal";

             document.body ?
             document.body.appendChild(cc.LabelTTF.__labelHeightDiv) :
             cc._addEventListener(window, 'load', function () {
             this.removeEventListener('load', arguments.callee, false);
             document.body.appendChild(cc.LabelTTF.__labelHeightDiv);
             }, false);

             cc.LabelTTF.__getFontHeightByDiv = function (fontName, fontSize) {
             var clientHeight = cc.LabelTTF.__fontHeightCache[fontName + "." + fontSize];
             if (clientHeight > 0) return clientHeight;
             var labelDiv = cc.LabelTTF.__labelHeightDiv;
             labelDiv.innerHTML = "ajghl~!";
             labelDiv.style.fontFamily = fontName;
             labelDiv.style.fontSize = fontSize + "px";
             clientHeight = labelDiv.clientHeight;
             cc.LabelTTF.__fontHeightCache[fontName + "." + fontSize] = clientHeight;
             labelDiv.innerHTML = "";
             */

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