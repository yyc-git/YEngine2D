/**YEngine2D
 * author：YYC
 * date：2014-05-17
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    var _instance = null;

    YE.SoundManager = YYC.Class(YE.Entity, {
        Init: function () {
            this.base();
        },
        Private: {
            ye_counter: 0
        },
        Public: {
            createSound: function (url, onload, onerror) {
                var urlArr = YE.Tool.judge.isArray(url) ? url : [url];

                YE.YSoundEngine.create({
                    urlArr: urlArr,
                    onload: onload,
                    onerror: onerror
                });
            },
            play: function (soundId) {
                var sound = YE.SoundLoader.getInstance().get(soundId),
                    audioObject = null;

                if (!sound || sound.length === 0) {
                    return YE.returnForTest;
                }

                if (this.ye_counter >= sound.length) {
                    this.ye_counter = 0;
                }

                audioObject = sound[this.ye_counter];
                this.ye_counter++;
                audioObject.play();
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