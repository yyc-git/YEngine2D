describe("AStar", function () {
    describe("4方向寻找路径", function () {
        beforeEach(function () {
            YE.AStar.setDirection(4);
        });

        it("返回的path为寻找的路径（二维数组），time为算法时间", function () {
            var fakeTerrainData = [
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]
                ],
                begin = [0, 0],
                end = [2, 3],
                result = null;

            result = YE.AStar.aCompute(fakeTerrainData, begin, end);

            expect(result.path).toEqual([
                [0, 1],
                [0, 2],
                [0, 3],
                [1, 3],
                [2, 3]
            ]);
            expect(result.time).toBeNumber();

        });
    });

    describe("8方向寻找路径", function () {
        beforeEach(function () {
            YE.AStar.setDirection(8);
        });

        it("返回的path为寻找的路径（二维数组），time为算法时间", function () {
            var fakeTerrainData = [
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]
                ],
                start = [0, 0],
                end = [3, 2],
                result = null;

            result = YE.AStar.aCompute(fakeTerrainData, start, end);

            expect(result.path).toEqual([
                [ 1, 0 ],
                [ 2, 1 ],
                [ 3, 2 ]
            ]);
        });
    });

    describe("如果不能找到路径", function () {
        beforeEach(function () {
            YE.AStar.setDirection(8);
        });

        it("目的地无法到达", function () {
            var fakeTerrainData = [
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]
                ],
                start = [0, 0],
                end = [1, 2],
                result1 = null,
                result2 = null;

            YE.AStar.setDirection(4);
            result1 = YE.AStar.aCompute(fakeTerrainData, start, end);
            YE.AStar.setDirection(8);
            result2 = YE.AStar.aCompute(fakeTerrainData, start, end);

            expect(result1.path).toEqual([]);
            expect(result1.info).toEqual("目的地无法到达");
            expect(result2.path).toEqual([]);
            expect(result2.info).toEqual("目的地无法到达");
        });
        it("找不到路径", function () {
            var fakeTerrainData = [
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [1, 0]
                ],
                start = [1, 0],
                end = [0, 2],
                result1 = null,
                result2 = null;

            YE.AStar.setDirection(4);
            result1 = YE.AStar.aCompute(fakeTerrainData, start, end);
            YE.AStar.setDirection(8);
            result2 = YE.AStar.aCompute(fakeTerrainData, start, end);

            expect(result1.path).toEqual([]);
            expect(result1.info).toEqual("目标成孤岛");
            expect(result2.path).toEqual([]);
            expect(result2.info).toEqual("找不到路径");
        });
    });
});
