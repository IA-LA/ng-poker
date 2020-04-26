'use strict';

/* Some functions */

function Shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/* TODO v 0.0.2 */
function Mano(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function UserCtrl($scope, $http) {
    $scope.users = []; // Initialize with an empty array

    $http.get('data/users').success(function(data, status, headers, config) {
        // When the request is successful, add value to $scope.users
        $scope.users = data.split(',')
    })
}

function MyCtrl($scope,$rootScope) {
    $scope.name = {name: "MyCtrl"};
    $scope.broadcast = function(){
        $rootScope.$broadcast('someEvent', $scope.name);
    };
}

function MyCtrl2($scope) {
    $scope.name2 = null;
    $scope.$on('someEvent', function(event, data){
        $scope.name2 = data;
    });
}