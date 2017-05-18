/**
 * AngularJS Model module
 */
(function() {
  'use strict';

  angular
    .module('model', []);
})();
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
/**
 * The Model provider
 */
(function(window) {
  'use strict';

  angular
    .module('model')
    .provider('model', modelProvider);

  modelProvider.$inject = ['$injector'];

  function modelProvider($injector) {
    var provider = this;

    this.$get   = ModelFactory;
    this.define = defineModel;
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
    function createBaseModel() {
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
     * Define Model
     */
    function defineModel(childProvider, options) {
      childProvider.$get = modelFactory;
      childProvider.Model = inheritModel();

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
        return childProvider.Model;
      } 
    }
  }
})(window);
/**
 * The Collection provider
 */
(function(window) {
  'use strict';

  angular
    .module('model')
    .provider('collection', collectionProvider);

  collectionProvider.$inject = ['$injector'];

  function collectionProvider($injector) {
    var provider  = this;
    var base = {
      methods:  {},
      statics:  {},
      virtuals: {}
    };

    this.$get     = CollectionFactory;
    this.define   = defineCollection;
    this.extend   = extendCollection;

    ////////

    /**
     * The Collection Factory
     */
    function CollectionFactory() {
      return function(options) {
        return $injector.invoke(provider.define({ }, options).$get);
      };
    }

    /**
     * Define Collection
     */
    function defineCollection(childProvider, options) {
      childProvider.$get        = collectionFactory;
      childProvider.Collection  = createCollection();

      ////////

      /**
       * Create collection
       */
      function createCollection() {
        // Get Model
        var Model = $injector.get(options.model + 'Provider').Model;
        // Inherit
        return new window.Model.Collection(Model, function(construct, methods, virtuals, statics) {
          // Add construct
          options.constructor.$construct = function(self, args) {
            return construct(self).load((args || {})[0] || []);
          };
          // Extend methods
          angular.extend(methods,  base.methods,  options.methods   || {});
          angular.extend(virtuals, base.virtuals, options.virtuals  || {});
          angular.extend(statics,  base.statics,  options.statics   || {});
          // Return the constructor
          return options.constructor;
        });
      }

      function collectionFactory() {
        return childProvider.Collection;
      } 
    }

    /**
     * Extend methods, statics, and virtuals
     */
    function extendCollection(baseProvider, extension) {
      // Create $get
      baseProvider.$get = CollectionFactory;
      // Extend base methods
      angular.extend(base.methods,  extension.methods   || {});
      angular.extend(base.virtuals, extension.virtuals  || {});
      angular.extend(base.statics,  extension.statics   || {});
    }
  }
})(window);