/**
 * The Collection provider
 */
(function(window) {
  'use strict';

  angular
    .module('model')
    .provider('Collection', CollectionProvider);

  CollectionProvider.$inject = ['$injector'];

  function CollectionProvider($injector) {
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
     * Define
     */
    function defineCollection(collectionProvider, options) {
      collectionProvider.$get       = collectionFactory;
      collectionProvider.Collection = createCollection();

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
        return collectionProvider.Collection;
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