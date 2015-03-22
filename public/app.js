(function(){
    var app = angular.module('todoList', ['ngMaterial', 'ngSanitize']);
    
    /* Set theme */
    app.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('orange');
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
    }]);
    
})();