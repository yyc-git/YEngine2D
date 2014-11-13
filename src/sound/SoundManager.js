/**YEngine2D 声音管理类，负责包装声音引擎，提供游戏访问的声音api
 * author：YYC
 * date：2014-05-17
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
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
            createSound: function (urlArr, onload, onerror) {
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