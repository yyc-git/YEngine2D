/**YEngine2D 事件管理
 * author：YYC
 * date：2014-01-05
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
(function () {
    var _keyListeners = {};

    YE.EventManager = {
        _getEventType: function (event) {
            var eventType = "",
                e = YE.Event;

            switch (event) {
                case e.KEY_DOWN:
                    eventType = "keydown";
                    break;
                case e.KEY_UP:
                    eventType = "keyup";
                    break;
                case e.KEY_PRESS:
                    eventType = "keypress";
                    break;
                case e.MOUSE_MOVE:
                    eventType = "mousemove";
                    break;
                case e.MOUSE_OVER:
                    eventType = "mouseover";
                    break;
                case e.MOUSE_OUT:
                    eventType = "mouseout";
                    break;
                case e.MOUSE_DOWN:
                    eventType = "mousedown";
                    break;
                case e.MOUSE_UP:
                    eventType = "mouseup";
                    break;
                case e.CLICK:
                    eventType = "click";
                    break;
                case e.CONTEXTMENU:
                    eventType = "contextmenu";
                    break;
                default:
                    YE.error(true, "事件类型错误");
            }

            return eventType;
        },
        addListener: function (event, handler, eventContext, handlerContext) {
            var eventType = "",
                _handler = null;

            eventType = this._getEventType(event);

            if (handlerContext) {
                _handler = YE.Tool.event.bindEvent(handlerContext, handler);
            }
            else {
                _handler = handler;
            }

            YE.Tool.event.addEvent(eventContext || window, eventType, _handler);
            this._registerEvent(eventType, _handler, eventContext || window);
        },
        _registerEvent: function (eventType, handler, eventContext) {
            if (_keyListeners[eventType] === undefined) {
                _keyListeners[eventType] = [
                    [handler, eventContext]
                ];
            }
            else {
                _keyListeners[eventType].push([handler, eventContext]);
            }
        },
        removeListener: function (event) {
            var eventType = "";

            eventType = this._getEventType(event);

            if (_keyListeners[eventType]) {
                _keyListeners[eventType].forEach(function (e, i) {
                    YE.Tool.event.removeEvent(e[1], eventType, e[0]);
                });
                _keyListeners[eventType] = undefined;
            }
        },
        removeAllListener: function () {
            var eventType = null;

            for (eventType in _keyListeners) {
                _keyListeners[eventType].forEach(function (e, i) {
                    YE.Tool.event.removeEvent(e[1], eventType, e[0]);
                });
            }
            _keyListeners = {};
        }
    };
}());
