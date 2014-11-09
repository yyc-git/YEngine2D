/**YEngine2D 帧数据缓存类
 * author：YYC
 * date：2014-02-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
(function () {
    var _instance = null;

    YE.FrameCache = YYC.Class(YE.Entity, {
        Init: function () {
            this.base();

            this._frames = YE.Hash.create();
            this._flags = YE.Hash.create();
        },
        Private: {
            _frames: null,
            _flags: null,

            _createFrameAndAddToDict: function (img, frames) {
                var frameData = null,
                    frame = null,
                    bitmap = YE.Bitmap.create(img);

                for (var key in frames) {
                    if (frames.hasOwnProperty(key)) {
                        if (this._frames.hasChild(key)) {
                            continue;
                        }
                        frameData = frames[key];
                        frame = YE.Frame.create(bitmap, YE.rect(frameData[0], frameData[1], frameData[2], frameData[3]));

                        this._frames.addChild(key, frame);
                    }
                }
            },
            _hasFrameData: function (jsonFilePath, imgPath) {
                var key = jsonFilePath + "_" + imgPath;
                if (this._flags.hasChild(key)) {
                    return true;
                }

                this._flags.addChild(key, 1);
                return false;
            }
        },
        Public: {
            addFrameData: function (jsonFilePath, imgPath) {
                var img = null,
                    jsonData = null;

                if (this._hasFrameData(jsonFilePath, imgPath)) {
                    return YE.returnForTest;
                }

                img = YE.ImgLoader.getInstance().get(imgPath);
                jsonData = YE.JsonLoader.getInstance().get(jsonFilePath);

                YE.error(img === undefined, imgPath + "不存在");
                YE.error(jsonData === undefined, jsonFilePath + "不存在");

                this._createFrameAndAddToDict(img, jsonData.frames);
            },
            getFrame: function (imgName) {
                var frame = this._frames.getValue(imgName);

                if (frame) {
                    return frame.copy();
                }
                return null;
            }
        },
        Static: {
            getInstance: function () {
                if (_instance === null) {
                    _instance = new this();
                }
                return _instance;
            }
        }
    });
}());