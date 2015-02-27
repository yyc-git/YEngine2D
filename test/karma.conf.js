// Karma configuration
// Generated on Wed Nov 05 2014 07:16:09 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'bower_components/yoop/yOOP.js',
        'bower_components/jquery/jquery.js',
        'test/hepler/**',
        'src/main.js',
        'src/import/jsExtend.js',
        'src/import/yeQuery.js' ,


        'src/base/Entity.js',
        'src/base/Node.js',
        'src/base/*.js',
        'src/action/Action.js',
        'src/action/ActionInstant.js',
        'src/action/ActionInterval.js',
        'src/action/Control.js',
        'src/loader/Loader.js',

        'src/**',

        //chrome的控制台中，不会显示全部的单元测试用例（如不会显示TextSpec的测试用例），
        //且单元测试的总计数也可能有问题。
        //如果测试失败，会显示错误error（但不会显示Failed的log信息）
        'test/unit/**'
        //这样配置，就能显示全部的单元测试用例（如TextSpec、TextImgSpec），且会显示Failed的log信息
        //'test/unit/ui/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'IE'],
      browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
