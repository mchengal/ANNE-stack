module.exports = function(config){
  config.set({
    basePath : '../',

    files : [
        'public/vendor/jquery/jquery-2.0.3.js',
      'public/vendor/angular/angular.js',
      'public/vendor/angular/angular-mocks.js',
      'public/vendor/angular/angular-animate.js',
      'public/vendor/angular/angular-route.js',
      'public/vendor/angular/angular-sanitize.js',
      'public/vendor/angular/draganddrop.js',
      'public/vendor/angular/angular-wizard.js',
      'public/vendor/bootstrap.js',
      'public/vendor/toastr.js',
      'public/vendor/moment.js',
      'public/vendor/ui-bootstrap-tpls-0.10.0.js',
      'public/vendor/spin.js',



       //<!-- Bootstrapping -->
    'public/app/app.js',
    'public/app/config.js',
    'public/app/config.exceptionHandler.js',
    'public/app/config.route.js',

    //<!-- common Modules -->
    'public/app/common/common.js',
    'public/app/common/logger.js',
    'public/app/common/spinner.js',

    //<!-- common.bootstrap Modules -->
    'public/app/common/bootstrap/bootstrap.dialog.js',

    //<!-- app -->
    'public/app/admin/stages.js',
    'public/app/admin/assembly.js',
    'public/app/admin/parts.js',
    'public/app/admin/query.js',
    'public/app/dashboard/dashboard.js',
    'public/app/layout/shell.js',
    'public/app/layout/sidebar.js',

    //<!-- app Services -->
    'public/app/services/datacontext.js',
    'public/app/services/directives.js',


      //'public/app/**/*.js',
      'test/unit/**/*.js'
    ],

    exclude : [
      'public/vendor/angular/angular-loader.js',
      'public/vendor/angular/*.min.js',
      'public/vendor/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-script-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
