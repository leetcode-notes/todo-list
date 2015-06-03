(function(){
    var app = angular.module('todoList', ['ngMaterial', 'ngSanitize']);
    
    /* Set theme */
    app.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue', {
            'default': '700',
            'hue-1': '400',
            'hue-2': '900',
            'hue-3': 'A100'
        });
    });

    app.controller('ListController', ['$http', function($http){
        var ctrl = this;
        this.newTodoDesc = '';
        this.loading = false;
        
        this.refreshTodos = function(){
            this.loading = true;
            $http.get('/api/todos')
                .success(function(data){
                    ctrl.todos = data;
                    console.log(data);
                });
            this.loading = false;
        };
        this.refreshTodos();
        
        this.addTodo = function(){
            if (!this.newTodoDesc) return;
            $http.post('/api/todos', { text: this.newTodoDesc })
                .success(function(data){
                    ctrl.todos = data;
                    console.log(data);
                });
            this.newTodoDesc = '';
        };
        
        this.deleteTodo = function(todo_id){
            $http.delete('/api/todos/' + todo_id)
                .success(function(data){
                    ctrl.todos = data;
                    console.log(data);
                });
        };
        
        this.renderMath = function(){
            window.renderMathInElement(document.body);
        };
    }]);
    
    app.directive('katex', function($timeout){
        return {
            restrict: 'A',
            link: function(scope, element, attr){
                $timeout(function(){
                    $timeout(function(){
                        window.renderMathInElement(element[0]);
                    });
                });
            }
        };
    });
    
    app.directive('onRepeatFinished', function($timeout){
        return {
            restrict: 'A',
            link: function(scope, element, attr){
                if (scope.$last) {
                    $timeout(function(){
                        scope.$eval(attr.onRepeatFinished);
                    });
                }
            }
        };
    });
    
})();