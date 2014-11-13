/**YEngine2D canvas通用图形绘制封装
 * author：YYC
 * date：2014-02-05
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
(function () {
    YE.Graphics = YYC.Class(YE.Entity, {
        Init: function (context) {
            this.base();

            this.ye_context = context;
        },
        Private: {
            ye_context: null,

            ye_buildDiamondBox: function (originPoint, leftHalfAngle, size) {
                var p1 = originPoint,
                    p2 = [originPoint[0] + size * Math.cos(leftHalfAngle),
                        originPoint[1] - size * Math.sin(leftHalfAngle)
                    ],
                    p3 = [originPoint[0] + size * Math.cos(leftHalfAngle) * 2,
                        originPoint[1]
                    ],
                    p4 = [originPoint[0] + size * Math.cos(leftHalfAngle),
                        originPoint[1] + size * Math.sin(leftHalfAngle)
                    ];

                return [p1, p2, p3, p4];
            }
        },
        Public: {
            setContext: function (context) {
                this.ye_context = context;
            },
            drawPolygon: function (style, lineWidth, polygon) {
                var i = 0,
                    len = polygon.length;

                this.ye_context.strokeStyle = style;
                this.ye_context.lineWidth = lineWidth;

                this.ye_context.beginPath();

                this.ye_context.moveTo(polygon[0][0], polygon[0][1]);

                for (i = 1; i < len; i++) {
                    this.ye_context.lineTo(polygon[i][0], polygon[i][1]);
                }

                this.ye_context.lineTo(polygon[0][0], polygon[0][1]);

                this.ye_context.closePath();

                this.ye_context.stroke();
            },
            fillPolygon: function (style, polygon) {
                var i = 0,
                    len = polygon.length;

                this.ye_context.fillStyle = style;

                this.ye_context.beginPath();

                this.ye_context.moveTo(polygon[0][0], polygon[0][1]);

                for (i = 1; i < len; i++) {
                    this.ye_context.lineTo(polygon[i][0], polygon[i][1]);
                }

                this.ye_context.lineTo(polygon[0][0], polygon[0][1]);

                this.ye_context.closePath();

                this.ye_context.fill();
            },
            fillMultiplePolygon: function (style, polygonArr) {
                var i = 0,
                    self = this;

                this.ye_context.fillStyle = style;

                this.ye_context.beginPath();

                polygonArr.forEach(function (polygon) {
                    self.ye_context.moveTo(polygon[0][0], polygon[0][1]);

                    polygon.forEach(function (point) {
                        self.ye_context.lineTo(point[0], point[1]);
                    });

                    self.ye_context.lineTo(polygon[0][0], polygon[0][1]);
                });

                this.ye_context.closePath();
                this.ye_context.fill();
            },
            drawCircle: function (style, lineWidth, x, y, radius) {
                this.ye_context.strokeStyle = style;
                this.ye_context.lineWidth = lineWidth;
                this.ye_context.beginPath();
                this.ye_context.arc(x, y, radius, 0, Math.PI * 2, false);
                this.ye_context.stroke();
            },
            fillCircle: function (style, x, y, radius) {
                this.ye_context.fillStyle = style;
                this.ye_context.beginPath();
                this.ye_context.arc(x, y, radius, 0, Math.PI * 2, false);
                this.ye_context.fill();
            },
            drawDiamondBox: function (style, lineWidth, originPoint, leftHalfAngle, size) {
                this.drawPolygon(style, lineWidth, this.ye_buildDiamondBox(originPoint, leftHalfAngle, size));
            },
            fillDiamondBox: function (style, originPoint, leftHalfAngle, size) {
                this.fillPolygon(style, this.ye_buildDiamondBox(originPoint, leftHalfAngle, size));
            },
            fillMultipleDiamondBox: function (style, originPointArr, leftHalfAngle, size) {
                var pointArr = [],
                    self = this;

                originPointArr.forEach(function (originPoint) {
                    pointArr.push(self.ye_buildDiamondBox(originPoint, leftHalfAngle, size));
                });

                this.fillMultiplePolygon(style, pointArr);
            },
            /**
             * 绘制血条
             * @param rangeArr [左上角X,左上角Y,血条边框宽度,血条边框高度]
             * @param lineWidth
             * @param fillWidth
             * @param frameStyle
             * @param fillStyle
             */
            drawLifeBar: function (rangeArr, lineWidth, fillWidth, frameStyle, fillStyle) {
                this.ye_context.strokeStyle = frameStyle;
                this.ye_context.lineWidth = lineWidth;
                this.ye_context.strokeRect(rangeArr[0], rangeArr[1], rangeArr[2], rangeArr[3]);

                this.ye_context.fillStyle = fillStyle;
                this.ye_context.fillRect(rangeArr[0], rangeArr[1], fillWidth, rangeArr[3]);
            }
        },
        Static: {
            create: function (context) {
                return new this(context);
            }
        }
    });
}());