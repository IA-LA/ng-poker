'use strict';

/* Some functions */

function Shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function Mano(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function UserCtrl($scope, $http) {
    $scope.users = [] // Initialize with an empty array

    $http.get('data/users').success(function(data, status, headers, config) {
        // When the request is successful, add value to $scope.users
        $scope.users = data.split(',')
    })
}