/**
 * The Model provider
 */
(function(window) {
  'use strict';

  angular
    .module('model')
    .provider('Model', ModelProvider);

  ModelProvider.$inject = ['$injector'];

  function ModelProvider($injector) {
    var provider = this;

    this.$get   = ModelFactory;
    this.define = define;
    this.Model  = createBaseModel();

    ////////

    /**
     * The Model Factory
     */
    function ModelFactory() {
      return function(options) {
        return $injector.invoke(provider.define({ }, options).$get);
      };
    }

    /**
     * Create base Model
     */
    function createBaseModel(options) {
      return window.Model({

      }, function(construct) {
        return Model;

        ////////

        /**
         * The base Model
         */
        function Model(data) {
          construct(this).load(data);
        }
      });
    }

    /**
     * Define
     */
    function define(modelProvider, options) {
      modelProvider.$get = modelFactory;
      modelProvider.Model = inheritModel();

      ////////

      /**
       * Inherit existing Model
       */
      function inheritModel() {
        var parentProvider  = options.inherits ? 
                              $injector.get(options.inherits + 'Provider') : 
                              provider,
            Parent          = parentProvider.Model;
        // Inherit
        return Parent.inherit(options.schema, function(construct, methods, virtuals, statics) {
          options.constructor.$construct = function(self, args) {
            return construct(self, args);
          };
          // Extend methods
          angular.extend(methods,   options.methods   || {});
          angular.extend(virtuals,  options.virtuals  || {});
          angular.extend(statics,   options.statics   || {});
          // Return the constructor
          return options.constructor;
        });
      }

      function modelFactory() {
        return modelProvider.Model;
      } 
    }
  }
})(window);