'use strict';

/* Controllers */

var pokerControllers = angular.module('pokerControllers', []);

pokerControllers.controller('PokerHomeCtrl', ['$scope',
    function($scope) {
        $scope.cards = [2,3,4,5,6];
        $scope.game = 'Poker (Texas Holdem)';
        $scope.name = 'Sala 1';
    }]);

pokerControllers.controller('PokerRoomCtrl', ['$scope', '$http', 'pokerConfig',
    function($scope, $http, pokerConfig) {

        $scope.init = function() {
            if(!$scope.$$phase) {
                //$digest or $apply
                $scope.$apply();
                $scope.$digest();
            }

            $scope.imagePath = pokerConfig.imagePath;
            $scope.imageExt = pokerConfig.imageExt;

            $scope.shuffleCards = Shuffle(pokerConfig.cardsArr).slice();
            $scope.tableCards = [];
            for (var i = 0; i < 3; i++) {
                $scope.tableCards.push($scope.shuffleCards.pop());
            }
            $scope.tableCards.push(pokerConfig.emptyCard, pokerConfig.emptyCard);
            console.log('CARTAS', $scope.tableCards.length);

            /* TODO v 0.0.2 */
            $scope.pokerTable = pokerConfig.pokerTable;
            $scope.pokerDealer = pokerConfig.pokerDealer;

            $scope.users = []; //['Fulano', 'Mengano', 'Zutano']; // Initialize with an empty array
            $scope.moneys = []; //[500, 500, 500]; // Initialize with an empty array

            $http.get('partials/jugadores.json').success(function(data, status, headers, config) {
                // When the request is successful, add value to $scope.users
                console.log('Users', data.ususarios.length);
                for (var i = 0; i < data.ususarios.length; i++) {
                    // $scope.users = data.split(',')
                    $scope.users.push(data.ususarios[i].name);
                    $scope.moneys.push(data.ususarios[i].money);
                }
            })
        };

        $scope.reset = function() {
            $scope.imagePath = pokerConfig.imagePath;
            $scope.imageExt = pokerConfig.imageExt;

            // Baraja
            $scope.shuffleCards = Shuffle(pokerConfig.cardsArr).slice();
            // Reparte
            console.log('CARTAS', $scope.tableCards)
            if($scope.tableCards === undefined)
            {
                $scope.tableCards = [];
                for (var i = 0; i < 3; i++) {
                    $scope.tableCards.push($scope.shuffleCards.pop());
                }
                $scope.tableCards.push(pokerConfig.emptyCard, pokerConfig.emptyCard);
                console.log('N CARTAS', $scope.tableCards.length);
            }

            /* TODO v 0.0.2 */
            $scope.pokerTable = pokerConfig.pokerTable;
            $scope.pokerDealer = pokerConfig.pokerDealer;

            $scope.cards = []; //[['2c' , '2d'], ['2c' , '2d'], ['2c' , '2d']]; // Initialize with an empty array

            for (var i = 0; i < $scope.users.length; i++) {
                $scope.cards.push([$scope.shuffleCards.pop(), $scope.shuffleCards.pop()]);
            }
        };

        $scope.next = function() {
            for (var i = 0, length = $scope.tableCards.length; i < length; i++) {
                if ($scope.tableCards[i] === pokerConfig.emptyCard) {
                    $scope.tableCards[i] = $scope.shuffleCards.pop();
                    break;
                }
                if (i === length - 1) {
                    alert('Gana esta mano: xxxxx. Y se lleva: XX,XX €');
                }
            }
            //console.log($scope.tableCards);
        };

        /* TODO v 0.0.2 */
        $scope.reload = function($scope)
        {
            location.reload($scope);
        };

        // AL CARGAR LA PAGINA
        $scope.init();

    }]);
