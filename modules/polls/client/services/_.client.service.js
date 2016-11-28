(function () {
  'use strict';

  angular
    .module('polls')
    .factory('_', UnderscoreService);

  UnderscoreService.$inject = ['$window'];

  function UnderscoreService($window) {
    var _ = $window._;
    delete ($window._);
    return (_);
  }
}());
