'use strict';

/* App Module */

var pokerApp = angular.module('ngPoker', [
  'ngRoute',
  'pokerControllers',
  'pokerDirectives'
]);

pokerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'PokerHomeCtrl'
      }).
      when('/room', {
        templateUrl: 'partials/room.html',
        controller: 'PokerRoomCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      })
  }]);

pokerApp.constant("pokerConfig", {
  "emptyCard": "empty",
  "pokerTable": "./img/table.png",
  "pokerDealer": "./img/dealer.jpg",
  "imagePath": "./img/",
  "imageExt": ".png",
  "cardvals": ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'],
  "handtypes": [
    "invalid hand", "high card",
    "one pair", "two pairs", "three of a kind",
    "straight", "flush", "full house",
    "four of a kind", "straight flush"
  ],
  "cards": {
    "2c": 1,  "2d": 2,  "2h": 3,  "2s": 4,
    "3c": 5,  "3d": 6,  "3h": 7,  "3s": 8,
    "4c": 9,  "4d": 10, "4h": 11, "4s": 12,
    "5c": 13, "5d": 14, "5h": 15, "5s": 16,
    "6c": 17, "6d": 18, "6h": 19, "6s": 20,
    "7c": 21, "7d": 22, "7h": 23, "7s": 24,
    "8c": 25, "8d": 26, "8h": 27, "8s": 28,
    "9c": 29, "9d": 30, "9h": 31, "9s": 32,
    "tc": 33, "td": 34, "th": 35, "ts": 36,
    "jc": 37, "jd": 38, "jh": 39, "js": 40,
    "qc": 41, "qd": 42, "qh": 43, "qs": 44,
    "kc": 45, "kd": 46, "kh": 47, "ks": 48,
    "ac": 49, "ad": 50, "ah": 51, "as": 52
  },
    "cardsES": {
        "2t": 1,  "2d": 2,  "2c": 3,  "2p": 4,
        "3t": 5,  "3d": 6,  "3c": 7,  "3p": 8,
        "4t": 9,  "4d": 10, "4c": 11, "4p": 12,
        "5t": 13, "5d": 14, "5c": 15, "5p": 16,
        "6t": 17, "6d": 18, "6c": 19, "6p": 20,
        "7t": 21, "7d": 22, "7c": 23, "7p": 24,
        "8t": 25, "8d": 26, "8c": 27, "8p": 28,
        "9t": 29, "9d": 30, "9c": 31, "9p": 32,
        "tt": 33, "td": 34, "tc": 35, "tp": 36,
        "jt": 37, "jd": 38, "jc": 39, "jp": 40,
        "qt": 41, "qd": 42, "qc": 43, "qp": 44,
        "kt": 45, "kd": 46, "kc": 47, "kp": 48,
        "at": 49, "ad": 50, "ac": 51, "ap": 52
    },
  "cardsArr": [
    "2c", "2d", "2h", "2s", "3c", "3d", "3h", "3s", "4c", "4d", "4h", "4s", "5c", "5d", "5h", "5s",
    "6c", "6d", "6h", "6s", "7c", "7d", "7h", "7s", "8c", "8d", "8h", "8s", "9c", "9d", "9h", "9s",
    "tc", "td", "th", "ts", "jc", "jd", "jh", "js", "qc", "qd", "qh", "qs", "kc", "kd", "kh", "ks",
    "ac", "ad", "ah", "as"
  ]
});
