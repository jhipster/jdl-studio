(function() {
  'use strict';

  angular.module('jdlStudio').directive('jdlEditor', jdlEditor);

  function jdlEditor() {
    var directive = {
      restrict: 'AE',
      require: '?ngModel',
      compile: function compile() {
        return postLink;
      }
    };

    return directive;

    function postLink(scope, elm, attr, ngModel) {

      var codemirrorOptions = angular.extend(scope.$eval(attr.jdlEditor));

      var codemirror = window.CodeMirror.fromTextArea(elm[0], {
        lineNumbers: true,
        mode: 'jdl',
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: 'solarized dark',
        keyMap: 'sublime',
        extraKeys: {
          "Ctrl-Space": "autocomplete"
        }
      });

      configNgModelLink(codemirror, ngModel, scope);

      // Allow access to the CodeMirror instance through a broadcasted event
      // eg: $broadcast('CodeMirror', function(cm){...});
      scope.$on('CodeMirror', function(event, callback) {
        if (angular.isFunction(callback)) {
          callback(codemirror);
        } else {
          throw new Error('the CodeMirror event requires a callback function');
        }
      });

      // onLoad callback
      if (angular.isFunction(codemirrorOptions.onLoad)) {
        codemirrorOptions.onLoad(codemirror);
      }
    }

    function configNgModelLink(codemirror, ngModel, scope) {
      if (!ngModel) {
        return;
      }
      // CodeMirror expects a string, so make sure it gets one.
      // This does not change the model.
      ngModel.$formatters.push(function(value) {
        if (angular.isUndefined(value) || value === null) {
          return '';
        } else if (angular.isObject(value) || angular.isArray(value)) {
          throw new Error('Codemirror cannot use an object or an array as a model');
        }
        return value;
      });

      // Override the ngModelController $render method, which is what gets called when the model is updated.
      // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
      ngModel.$render = function() {
        //Code mirror expects a string so make sure it gets one
        //Although the formatter have already done this, it can be possible that another formatter returns undefined (for example the required directive)
        var safeViewValue = ngModel.$viewValue || '';
        codemirror.setValue(safeViewValue);
      };

      // Keep the ngModel in sync with changes from CodeMirror
      codemirror.on('change', function(instance) {
        var newValue = instance.getValue();
        if (newValue !== ngModel.$viewValue) {
          scope.$evalAsync(function() {
            ngModel.$setViewValue(newValue);
          });
        }
      });
    }
  }
})();
