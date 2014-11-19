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
    YE.SoundManager = YYC.Class(YE.Entity, {
        Init: function () {
            this.base();
        },
        Private: {
            ye_counter: 0,

            ye_playOnlyOneSimultaneously: function (audioObject) {
                if (audioObject.getPlayState() !== 1) {
                    audioObject.play();
                }
            }
        },
        Public: {
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
                this.ye_playOnlyOneSimultaneously(audioObject);
            }
        },
        Static: {
            _instance: null,

            getInstance: function () {
                if (this._instance === null) {
                    this._instance = new this();
                }
                return this._instance;
            }
        }
    });
}());