/**
 * Model Utils
 */
(function(window) {
  'use strict';

  angular
    .module('model')
    .provider('model.utils', modelUtilsProvider);

  function modelUtilsProvider() {
    var provider = this;

    this.$get  = modelUtilsFactory;
    this.utils = window.Model.utils;

    ////////

    function modelUtilsFactory() {
      return provider.utils;
    }
  }
})(window);