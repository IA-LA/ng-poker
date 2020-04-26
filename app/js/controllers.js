'use strict';

/* Controllers */

var pokerControllers = angular.module('pokerControllers', []);

pokerControllers.controller('PokerHomeCtrl', ['$rootScope', '$scope',
    function($rootScope, $scope) {

        // Mensajes
        $scope.$broadcast('topic', 'message');
        $scope.$emit('topic', 'message');
        console.log('BROADCAST/EMIT:', 'message');
        $rootScope.prueba = 'Mierda para ti';

        $scope.cards = [2,3,4,5,6];
        $scope.game = 'Poker (Texas Holdem)';
        $scope.name = 'Sala 1';
    }]);

pokerControllers.controller('PokerRoomCtrl', ['$rootScope', '$scope', '$http', 'pokerConfig',
    function($rootScope, $scope, $http, pokerConfig) {

        $scope.init = function() {

            console.log('INICIALIZA');

            //Variables de la Vista
            // Título
            // Comunica con la Vista
            $scope.myTitle = true;
            $scope.myHand = true;
            $scope.myCard = false;
            $scope.myMenu = false;

            // Variables de Tiempo
            // Duplicar apuesta if($scope.time) {$scope.bid *= 2;}
            $scope.initialTime = new Date();
            console.log('INICIO TIEMPO', $scope.initialTime);

            // Variables de Mano
            // Manos de una partida
            $scope.nHands = 0;

            // Variables de Apuestas
            // Banca, Dinero, Mano,  Apuesta, Apuesta mínima, Dealer, newDealer, Hora ...
            $scope.bank = 0;
            $scope.money = 0;

            $scope.hand = 0;
            $scope.minHand = 0;
            $scope.maxHand = 1000000;

            $scope.bid = 0;
            $scope.minBid = 0;
            $scope.maxBid = 1000000;

            $scope.dealer = 0;
            $scope.newDealer = 0;

            $scope.jugadorCanino = 0;
            $scope.jugadorForrado = 0;

            // ...

            // PRUEBAS
            // Mensajes
            console.log('ON:', 'topic');
            $scope.prueba = $rootScope.prueba;
            $scope.$on('topic', function (event, arg) {
                console.log('ON:', arg);
                $scope.receiver = 'got your ' + arg;
            });

            // Ingesta
            if(!$scope.$$phase) {
                //$digest or $apply
                $scope.$apply();
                $scope.$digest();
            }

            // Paths
            $scope.imagePath = pokerConfig.imagePath;
            $scope.imageExt = pokerConfig.imageExt;

            /* v 0.0.2 */
            // Imágenes Tabla y Dealer
            $scope.pokerTable = pokerConfig.pokerTable;
            $scope.pokerDealer = pokerConfig.pokerDealer;

            // Jugadores y Turnos iniciales
            $scope.users = []; //[{'Fulano'...}, {'Mengano'...}, {'Zutano'...}]; // Initialize with an empty array
            $scope.players = []; //[{}, {}, {}]; // Initialize with an empty array
            // Recupera configuración inicial
            $http.get('partials/bets.json').then(function(data, status, headers, config) {
                // Game config
                $scope.name = data.data.name;
                $scope.version = data.data.version;
                $scope.time = data.data.time;

                // When the request is successful, add bid value to $scope.users
                console.log('Data', data.data);
                console.log('Bid', data.data.bid);
                $scope.bid = data.data.bid;
                $scope.minBid = $scope.bid;

                console.log('Users', data.data.users.length, data.data.users);
                for (var i = 0; i < data.data.users.length; i++) {
                    // $scope.users = data.split(',')
                    $scope.users.push(data.data.users[i]);
                }

                // Baraja usuarios
                $scope.players = Shuffle(Shuffle($scope.users).slice()).slice();

                console.log('Users shuffle(players)', $scope.players);

            }).catch(function(err){
                console.log(err)
            });

            $http.get('partials/jugadores.json').success(function(data, status, headers, config) {
                // When the request is successful, add value to
                console.log('Users', data.ususarios.length, data.ususarios);
            });

        };

        $scope.shuffleCards = function() {

            console.log('BARAJA CARTAS');

            // Baraja
            $scope.shuffleCardsArr = [];
            $scope.shuffleCardsArr = Shuffle(pokerConfig.cardsArr).slice();

            console.log('CARTAS BARAJADAS', $scope.shuffleCardsArr, $scope.shuffleCardsArr.length);

        };

        $scope.dealTable = function() {

            console.log('REPARTE MESA');

            console.log('CARTAS BARAJADAS', $scope.shuffleCardsArr, $scope.shuffleCardsArr.length);

            // Reparte Mesa
            $scope.tableCards = [];
            for (var i = 0; i < 3; i++) {
                $scope.tableCards.push($scope.shuffleCardsArr.pop());
            }
            $scope.tableCards.push(pokerConfig.emptyCard, pokerConfig.emptyCard);

            console.log('CARTAS MESA', $scope.tableCards, $scope.tableCards.length);
            console.log('CARTAS BARAJADAS', $scope.shuffleCardsArr, $scope.shuffleCardsArr.length);

        };

        $scope.dealCardTable = function() {

            console.log('REPARTE CARTA MESA');

            console.log('CARTAS', $scope.tableCards, $scope.tableCards.length);
            console.log('CARTAS BARAJADAS', $scope.shuffleCardsArr, $scope.shuffleCardsArr.length);

            for (var i = 0, length = $scope.tableCards.length; i < length; i++) {
                if ($scope.tableCards[i] === pokerConfig.emptyCard) {
                    $scope.tableCards[i] = $scope.shuffleCardsArr.pop();
                    break;
                }
                // Fin de la mano
                if (i === length - 1) {
                    alert('¿Quién gana esta mano. Y se lleva los ' + $scope.money + ' céntimos de €?' +
                          '\n                                            ;-)                        ');
                    break;
                }
                // Pone fin a la mano
                if (i === length - 2) {

                    // Jugadores Activos
                    var jugadoresActivos = 0;

                    jugadoresActivos = $scope.activePlayers();

                    console.log('REPARTE CARTA MESA', jugadoresActivos);

                    // Finaliza la Mano
                    if(jugadoresActivos > 0)
                        $scope.finishHand(jugadoresActivos);
                }
                // Continua la Mano
                else{
                    // Inicia Turno
                    $scope.initTurn();
                }
            }
            //console.log($scope.tableCards);
            console.log('CARTAS', $scope.tableCards, $scope.tableCards.length);
            console.log('CARTAS BARAJADAS', $scope.shuffleCardsArr, $scope.shuffleCardsArr.length);
        };

        $scope.initPlayers = function() {

            console.log('INICIA JUGADORES');

            // ¿Habemus Player?
            var player = false;

            // Inicia Jugador que abre la Mano
            for (var j = 0; j < $scope.players.length; j++) {
                // Oportunidad de apuesta
                if(($scope.players[j].as !== -1) && ($scope.players[j].as !== 1) && ($scope.players[j].as !== 5)){
                    $scope.players[j].as = 0;
                    player = true;
                    break;
                }
            }

            // Comunica con la Vista
            // Sigue la Mano
            $scope.myCard = !player;

        };

        $scope.dealPlayers = function() {

            console.log('REPARTE JUGADORES');

            $scope.imagePath = pokerConfig.imagePath;
            $scope.imageExt = pokerConfig.imageExt;

            // Cartas en la mesa
            if($scope.tableCards === undefined)
            {
                $scope.tableCards = [];
                for (var i = 0; i < 3; i++) {
                    $scope.tableCards.push($scope.shuffleCardsArr.pop());
                }
                $scope.tableCards.push(pokerConfig.emptyCard, pokerConfig.emptyCard);
                console.log('N CARTAS', $scope.tableCards.length);
            }

            // Reparte
            console.log('CARTAS', $scope.tableCards, $scope.tableCards.length);
            console.log('CARTAS BARAJADAS', $scope.shuffleCardsArr, $scope.shuffleCardsArr.length);

            /* v 0.0.2 */
            // Cartas de los jugadores
            // Control de cartas restates
            if ((($scope.shuffleCardsArr.length - ($scope.players.length * 2)) <= 2) || ($scope.shuffleCardsArr.length < $scope.players.length * 2)) {
                alert('Se acabaron las cartas. No se pueden repartir más');
            }
            else{
                // Reparte cartas
                for (var j = 0; j < $scope.players.length; j++) {
                    console.log("REPARTE JUGADORES", j, $scope.players[j].name, $scope.players[j].as);

                    $scope.players[j].cards = []; //[['2c' , '2d'], ['2c' , '2d'], ['2c' , '2d']]; // Initialize with an empty array

                    //Jugador FUERA DE JUEGO
                    if($scope.players[j].as === -1){
                        console.log("REPARTE JUGADORES1", j, $scope.players[j].name, $scope.players[j].as);
                        $scope.players[j].cards.push(['empty', 'empty']);
                    }
                    else{
                        console.log("REPARTE JUGADORES2", j, $scope.players[j].name, $scope.players[j].as);
                        $scope.players[j].cards.push([$scope.shuffleCardsArr.pop(), $scope.shuffleCardsArr.pop()]);
                    }
                }

                // Reparte
                console.log('CARTAS', $scope.tableCards, $scope.tableCards.length);
                console.log('CARTAS BARAJADAS', $scope.shuffleCardsArr, $scope.shuffleCardsArr.length);
            }

        };

        $scope.turnPlayers = function(index, maxHand) {

            console.log('TURNOS JUGADORES', index, maxHand);

            // Desactualiza el que apuesta
            //$scope.players[index].as = 4;
            // ¿Habemus Player?
            var player = false;

            // Actualiza Jugadores
            // Actualiza siguientes Jugadores
            // Actualiza al que apuesta
            // Busca el primero que apuesta
            for (var i = index + 1; i < $scope.players.length; i++) {
                // Oportunidad de ver la apuesta
                if(($scope.players[i].as !== -1) && ($scope.players[i].as !== 1) && ($scope.players[i].hand <= maxHand)){
                    $scope.players[i].as = 0;
                    // Habemus Player
                    player = true;
                    break;
                }
            }
            //Si hay más jugadores
            //Si sube la apuesta
            //O debe igualarse
            if(!player){
                for (var j = 0; j < index; j++) {
                    // Oportunidad de ver la apuesta
                    if(($scope.players[j].as !== -1) && ($scope.players[j].as !== 1) && ($scope.players[j].hand < maxHand)){
                        $scope.players[j].as = 0;
                        // Habemus Player
                        player = true;
                        break;
                    }
                }
                // Actualiza el resto que apuestan
                /*for (var j = 0; j < $scope.players.length; j++) {
                    // Oportunidad de ver la apuesta
                    if(($scope.players[j].as !== -1) && ($scope.players[j].as !== 0) && ($scope.players[j].as !== 1) && ($scope.players[j].as !== 5)){
                        $scope.players[j].as = 4;
                    }
                }*/

            }

            // Comunica con la Vista
            // Sigue la Mano
            $scope.myCard = !player;

        };

        $scope.activePlayers = function(){
            console.log('JUGADORES ACTIVOS');

            // Jugadores Activos
            var jugadoresActivos = 0;

            // Revisa Jugadores
            for (var j = 0; j < $scope.players.length; j++) {
                console.log('JUGADORES ACTIVOS', $scope.players[j].as, j, jugadoresActivos);
                // Jugadores FUERA DE JUEGO y TIRO MIS CARTAS
                if(($scope.players[j].as !== -1) && ($scope.players[j].as !== 1) && ($scope.players[j].as <= 10)){
                    jugadoresActivos += 1;
                }
            }
            return jugadoresActivos;
        };

        $scope.activatePlayers = function(index, player) {
            console.log('JUGADORES ACTIVADOS', index, player, $scope.players.length);

        };

        $scope.deactivatePlayers = function(index, player) {
            console.log('JUGADOR INACTIVADO', index, player, $scope.players.length);

            // Jugadores Activos
            var jugadoresActivos = {};
            var numeroJugadores = 0;

            // Revisa Jugadores
            numeroJugadores = $scope.players.length;
            for (var j = 0; j < numeroJugadores; j++) {
                console.log('JUGADORES INACTIVOS', j, numeroJugadores);

                // Intercambia Jugadores
                jugadoresActivos = $scope.players.pop();
                console.log('JUGADORES INACTIVOS', jugadoresActivos);
                // Jugador no buscado
                if(player !== jugadoresActivos){
                    $scope.players.unshift(jugadoresActivos);
                    jugadoresActivos = {};
                }
            }
            return jugadoresActivos;
        };

        $scope.initHand = function()
        {
            console.log('INICIA MANO');

            // Tiempo
            // Calcular Apuestas Mín y Máx
            // Apuesta mínima y máxima
            // Apuesta $scope.bid
            $scope.bid = $scope.initBet();
            $scope.minBid = $scope.minBet();
            $scope.maxBid = $scope.maxBet();

            // Manos de una partida
            $scope.nHands += 1;

            // Inicializa la Banca, Dinero, Mano y Apuesta Mínima
            $scope.bank = $scope.bid + $scope.bid/2;
            $scope.money = $scope.bid + $scope.bid/2;
            $scope.hand = 0;

            // Jugadores Estado
            for (var i = 0; i < $scope.players.length; i++) {
                // Controlando Jugadores sin blanca
                if($scope.players[i].money <= 0) {
                    // Está fuera
                    $scope.players[i].as = -1;
                }
                else{
                    // Inicializa estados AS
                    // Jugadores en la partida
                    // Turno
                    // No es JUGADOR FUERA
                    if (($scope.players[i].as !== -1)) {
                        $scope.players[i].as = 0;
                    }
                }
            }

            // Rebaja de apuesta mínima
            // Del jugadorCanino
            if($scope.minBid < $scope.bid){
                // Reinicializa la Banca, Dinero, Mano y Apuesta Mínima
                $scope.bank = $scope.maxBid + $scope.maxBid/2;
                $scope.money = $scope.maxBid + $scope.maxBid/2;
                $scope.hand = 0;

                alert('Partida solidaria!!! ' + $scope.players[$scope.jugadorCanino].name + ' está a punto de irse de la mesa.');
                $scope.maxBid = $scope.minBid;
            }

        };

        $scope.dealHand = function()
        {
            console.log('REPARTE MANO');

            /* v 0.0.2 */
            //Mano Inicial de juego
            if ($scope.dealer === undefined){
                // Asigna Dealer al último
                // JUGADOR NO FUERA
                $scope.dealer = $scope.players.length-1;
                $scope.players[$scope.dealer].dealer = 1;
            }
            // Nueva Mano
            else {
                // Desasigna Dealer al último
                // JUGADOR NO FUERA
                $scope.dealer = $scope.players.length-1;
                $scope.players[$scope.dealer].dealer = 0;

                //Sube a Dealer al último de la lista de Jugadores
                $scope.newDealer = $scope.players.pop();
                $scope.players.unshift($scope.newDealer);

                // Asigna Dealer al primero
                $scope.dealer = $scope.players.length-1;
                $scope.players[$scope.dealer].dealer = 1;
            }

            //Asigna apuesta inicial
            for(var i = 0; i <  $scope.players.length; i++) {
                $scope.players[i].bid = 0;
                $scope.players[i].hand = 0;
                // Jugadores en la partida
                // Turno
                // No es JUGADOR FUERA
                if(($scope.players[i].as !== -1)){
                    $scope.players[i].as = 4;
                }
            }
            // Si hay un Jugador
            if($scope.players.length === 1){
                $scope.players[0].bid = $scope.bid;
                $scope.players[0].hand = $scope.bid;
                $scope.players[0].money = $scope.players[0].money - $scope.bid;
                // Jugadores en la partida
                // Sin turno
                // No es JUGADOR FUERA
                if(($scope.players[0].as !== -1)){
                    $scope.players[0].as = 0;
                }
            }
            else{
            }
            // Si hay dos Jugadores o más
            if($scope.players.length > 1){
                $scope.players[0].bid = $scope.bid;
                $scope.players[0].hand = $scope.bid;
                $scope.players[0].money = $scope.players[0].money - $scope.bid;
                // Jugadores en la partida
                // Sin Turno
                // No es JUGADOR FUERA
                if(($scope.players[0].as !== -1)){
                    $scope.players[0].as = 0;
                }
                $scope.players[1].bid = $scope.bid/2;
                $scope.players[1].hand = $scope.bid/2;
                $scope.players[1].money = $scope.players[1].money - $scope.bid/2;
            }

        };

        $scope.miniHand = function() {
            console.log('MINIMA MANO');

            $scope.minBid = 1000000;
            $scope.minHand = 1000000;
            // Jucador con el Mínimo de dinero
            for (var i = 0; i < $scope.players.length; i++) {
                if ($scope.players[i].money < $scope.minBid) {
                    $scope.minBid = $scope.players[i].money;
                }

                if ($scope.players[i].hand < $scope.minHand) {
                    $scope.minHand = $scope.players[i].money;

                    // Jugador Canino
                    $scope.jugadorCanino = i;
                }
            }

            return $scope.minHand;

        };

        $scope.maxiHand = function() {
            console.log('MAXIMA MANO');

            // Jugador con el Máximo de dinero
            $scope.maxBid = 0;
            $scope.maxHand = 0;
            for (var j = 0; j < $scope.players.length; j++) {
                if ($scope.players[j].money > $scope.maxBid) {
                    $scope.maxBid = $scope.players[j].money;
                }

                if ($scope.players[j].hand > $scope.maxHand) {
                    $scope.maxHand = $scope.players[j].hand;

                    // Jugador Forrado
                    $scope.jugadorForrado = j;
                }
            }

            return $scope.maxHand;

        };

        $scope.finishHand = function(jugadoresActivos) {
            console.log('FINALIZA MANO');

            // Repartir ganancias $scope.players[j]
            // Revisa todos los Jugadores
            for (var j = 0; j < $scope.players.length; j++) {
                // Oportunidad de apuesta
                if(($scope.players[j].as !== -1) && ($scope.players[j].as !== 1)){
                    console.log('FINALIZA MANO', $scope.players[j].as);
                    // TODO Show cards or not at the end of the Hand !!!
                    if(jugadoresActivos <= 1){
                        $scope.players[j].as = 100;
                    }
                    else{
                        $scope.players[j].as = 10;
                    }
                }
            }

        };

        $scope.initBet = function() {
            console.log('INICIA APUESTA');

            // Tiempo
            // Duplicar apuesta if($scope.time) {$scope.bid *= 2;}
            var actualTime = new Date();
            var interval = (actualTime - $scope.initialTime) / 1000 / 60; //En minutos
            if (interval > $scope.time) {
                $scope.initialTime = actualTime;
                $scope.bid = $scope.bid * 2;
            }

            console.log('INICIA APUESTA', interval);
            return $scope.bid;

        };

        $scope.minBet = function() {
            console.log('MINIMA APUESTA');

            $scope.minBid = 1000000;
            $scope.minHand = 1000000;
            // Jucador con el Mínimo de dinero
            for (var i = 0; i < $scope.players.length; i++) {
                if ($scope.players[i].money < $scope.minBid) {
                    $scope.minBid = $scope.players[i].money;

                    // Jugador Canino
                    $scope.jugadorCanino = i;
                }

                if ($scope.players[i].hand < $scope.minHand) {
                    $scope.minHand = $scope.players[i].money;
                }
            }

            return $scope.minBid;

        };

        $scope.maxBet = function() {
            console.log('MAXIMA APUESTA');

            // Jugador con el Máximo de dinero
            $scope.maxBid = 0;
            $scope.maxHand = 0;
            for (var j = 0; j < $scope.players.length; j++) {
                if ($scope.players[j].money > $scope.maxBid) {
                    $scope.maxBid = $scope.players[j].money;

                    // Jugador Forrado
                    $scope.jugadorForrado = j;
                }

                if ($scope.players[j].hand > $scope.maxHand) {
                    $scope.maxHand = $scope.players[j].hand;
                }
            }

            return $scope.maxBid;

        };

        $scope.bet = function(index, name, bid)
        {
            console.log('AVANZA APUESTA', index, name, bid, $scope.players[index].bank);


            /* v 0.0.2 */
            // Convierte a entero
            bid = Number(bid);

            // Calcula la apuesta máxima
            $scope.minBid = $scope.minBet();

            // Calcula la apuesta mínima
            $scope.maxBid = $scope.maxBet();

            // Partida NO empezada
            // Menú inicial que permite
            // Restituir cuantías de partidas empezadas
            if(($scope.bank === 0) && ($scope.money === 0) && ($scope.hand === 0)){
                // Dinero de ususario
                if(bid === 0){
                    bid = $scope.bid;
                }
                if($scope.players[index].money - bid >= 0) {
                    $scope.players[index].money -= bid;
                }
            }
            // Partida empezada
            else{
                // Partida solidaria!!!
                ///////////////////////
                /*if(($scope.minBid === $scope.maxBid) && ($scope.minBid < $scope.bid)){
                    console.log('AVANZA APUESTA SOLIDARIA!!!', $scope.minBid);
                    // TODO Partida Solidaria!!!
                    bid = $scope.minBid;

                }*/
                // Partida al corriente
                ///////////////////////
                /*else{*/
                    console.log('AVANZA APUESTA AL CORRIENTE');

                    // Actualiza Jugadores
                    // Mínima apuesta de la Mano
                    // Calcula la apuesta mínima de la Mano
                    $scope.minHand = $scope.miniHand();

                    // Máxima apuesta de la Mano
                    // Calcula la apuesta máxima de la Mano
                    $scope.maxHand = $scope.maxiHand();

                    // Voy igualando la apuesta
                    if(bid <= 0){
                        console.log('AVANZA IGUALANDO LA APUESTA');

                        // Calcula la apuesta que iguala la mano
                        bid = $scope.maxHand - $scope.players[index].hand;

                        // Dinero de ususario
                        if($scope.players[index].money - bid >= 0) {
                            console.log('JUGADOR OK');
                        }
                        else{
                            console.log('JUGADOR CANINO');
                            bid = $scope.players[index].money;
                        }

                        //Iguala apuesta
                        if(bid > 0)
                            // ALL IN de Jugador Canino
                            if($scope.players[index].money - bid === 0)
                                $scope.players[index].as = 5;
                            // IGUALO
                            else
                                $scope.players[index].as = 6;
                        // VOY CON LA MINIMA
                        else
                            $scope.players[index].as = 2;

                        $scope.players[index].money -= bid;
                        $scope.players[index].hand += bid;

                        // Banca de apuestas
                        $scope.bank = $scope.bank - bid;
                        $scope.money = $scope.money + bid;
                        $scope.hand = $scope.hand + bid;

                        // Dinero de ususario
                        if($scope.players[index].money === 0) {
                            // Jugador fuera -1 o Jugador All in 5
                            //$scope.players[index].as = -1;
                            $scope.players[index].as = 5;
                        }

                        // Avanza Turno
                        $scope.turn(index, name, $scope.maxHand);
                    }
                    // Voy subiendo la apuesta
                    else{
                        console.log('AVANZA LA APUESTA');

                        // Supera o Iguala la apuesta
                        if($scope.maxHand <= $scope.players[index].hand + bid){
                            console.log('AVANZA SUBIENDO LA APUESTA');

                            //Sube la apuesta
                            if($scope.players[index].money - bid >= 0) {
                                console.log('JUGADOR OK');
                            }
                            else{
                                console.log('JUGADOR CANINO');
                                bid = $scope.players[index].money;
                            }

                            // ESTOY EN LO MAS ALTO
                            if($scope.maxHand < $scope.players[index].hand + bid)
                                $scope.players[index].as = 3;
                            else
                                // ALL IN de Jugador Canino
                                if($scope.players[index].money - bid === 0)
                                    $scope.players[index].as = 5;
                                // VOY CON LA MINIMA
                                else
                                    $scope.players[index].as = 2;

                            $scope.players[index].money -= bid;
                            $scope.players[index].hand += bid;

                            // Banca de apuestas
                            $scope.bank = $scope.bank - bid;
                            $scope.money = $scope.money + bid;
                            $scope.hand = $scope.hand + bid;

                            // Dinero de ususario
                            if($scope.players[index].money === 0) {
                                // Jugador fuera -1 o Jugador All in 5
                                //$scope.players[index].as = -1;
                                $scope.players[index].as = 5;
                            }

                            // Actualiza la apuesta máxima
                            $scope.maxHand = $scope.players[index].hand;

                            // Avanza Turno
                            $scope.turn(index, name, $scope.players[index].hand);
                        }
                        // Apuesta menor que la mínima
                        // Por falta de fondos
                        else{
                            console.log('AVANZA MINIMA APUESTA JUGADOR CANINO');

                            // ALL IN
                            $scope.players[index].as = 5;

                            $scope.players[index].money -= $scope.bid;
                            $scope.players[index].hand += $scope.bid;

                            // Banca de apuestas
                            $scope.bank = $scope.bank - $scope.bid;
                            $scope.money = $scope.money + $scope.bid;
                            $scope.hand = $scope.hand + $scope.bid;

                            // Dinero de ususario
                            if($scope.players[index].money === 0) {

                                // Jugador fuera -1 o Jugador All in 5
                                //$scope.players[index].as = -1;
                                $scope.players[index].as = 5;
                            }

                            // Avanza Turno
                            $scope.turn(index, name, $scope.maxHand);
                        }

                    }

                /*}*/

            }
        };

        $scope.dealBet = function(index, name, bid) {
            console.log('REPARTE GANANCIAS', index, name, bid);

            // Convierte a entero
            bid = Number(bid);

            /* v 0.0.2 */
            // Reparte ganancias
            $scope.players[index].money += bid;

            // Inicia Dinero Jugadores
            for (var j = 0; j < $scope.players.length; j++) {
                console.log('REPARTE GANANCIAS', $scope.players[j]);
                // Oportunidad de apuesta
                if($scope.players[j] !== $scope.players[index]){
                    $scope.players[j].hand = 0;
                    $scope.players[j].bid = 0;
                    $scope.myMoney = 0;
                }
                if($scope.players[j].money === 0){
                    $scope.players[j].as = -1;
                }
            }

            // Comunica con la Vista
            // Reinicia una nueva Mano
            $scope.myHand = true;
            $scope.myCard = false;

        };

        $scope.initTurn = function()
        {
            console.log('INICIA TURNO');

            /* v 0.0.2 */
            //Avanzar repartidor de cartas

            //Vaciar la Banca, Apuesta y Mano

            //Vaciar al Total de la mano
            $scope.bank = $scope.bank;
            $scope.bid = $scope.bid;
            $scope.hand = $scope.hand;

            // Reiniciar apuestas

            // Actualiza Jugadores en Juego
            $scope.initPlayers();

        };

        $scope.turn = function(index, name, maxHand) {
            console.log('AVANZA TURNO', index, name, maxHand);

            /* v 0.0.2 */
            //Avanzar repartidor de cartas

            //Vaciar la Banca, Apuesta y Mano

            //Vaciar al Total de la mano
            $scope.bank = $scope.bank;
            $scope.bid = $scope.bid;
            $scope.hand = $scope.hand;

            // Reiniciar apuestas

            // Actualiza Jugadores en Juego
            $scope.turnPlayers(index, maxHand);

        };

        $scope.initDrop = function(index, name) {
            console.log('INICIA ABANDONA MANO', index, name);

        };

        $scope.drop = function(index, name)
        {
            console.log('ABANDON MANO', index, name);

            /* v 0.0.2 */
            //Avanzar repartidor de juego

            // Actualiza Jugadores en Juego
            $scope.deactivatePlayers(index, name);

        };

        $scope.reload = function($scope)
        {
            location.reload($scope);

            /* v 0.0.2 */
            $scope.sendMail("foo@bar.com","Mail Subject","Mail Body Message");

        };

        $scope.sendEmail = function(carta1, carta2){
            try{
                // Objeto Outlook
                var theApp = new ActiveXObject("Outlook.Application");

                // Jugadores
                for (var j = 0; j < $scope.players.length; j++) {
                    console.log('EMAIL REPARTE CARTAS', $scope.players[j]);

                    if($scope.players[j].as !== -1){
                        // Envía Email
                        var theMailItem = theApp.CreateItem(0); // value 0 = MailItem
                        theMailItem.to = ($scope.players[j].email);
                        theMailItem.Subject = ('Cartas Mano: ' + $scope.nHands);
                        theMailItem.Body = ('Van las Instrucciones, configuración, imágenes y tus Cartas adjuntas');
                        theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\README.txt");
                        theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\partials\\bets.json");
                        theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\Svg-cards-2.0.svg");
                        theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\table.png");
                        if($scope.players[j].dealer === 1){
                            theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\dealer.png");
                            theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\dealer.jpg");
                            theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\dealer.gif");
                        }
                        theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\empty.png");
                        theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\" + $scope.players[j].cards[0][0] + ".png");
                        theMailItem.Attachments.Add("C:\\Users\\FJ\\WebstormProjects\\ng-poker\\app\\img\\" + $scope.players[j].cards[0][1] + ".png");
                        theMailItem.display();
                    }
                }
            }
            catch (err) {
                alert(err.message);
            }
        };

        $scope.sendMail = function(emailId, subject, message, carta1, carta2){
            $scope.mailLink = "mailto:"+ emailId + "?subject=" + subject+"&body=" + message;
            open("mailto:"+ emailId + "?subject=" + subject + ' "" ' +
                "?adju=" + subject +
                "&body=                                                                               " +
                "                                  LAS INSTRUCCIONES                                  " +
                "                                  -----------------                                  " +
                "                                  Se juega con una baraja de 52 cartas sin comodines." +
                "                                  Se reparten 2 cartas entre los jugadores y luego   " +
                "                                  Se colocan 5 cartas sobre la mesa las tres primeras" +
                "                                  al descubierto.                                    " +
                "                                                                                     " +
                "                                  El puesto de Dealer se baraja igual que las cartas." +
                "                                  El Dealer reparte y supervisa el juego en su mano. " +
                "                                  La apuesta inicial se realiza automáticamente.     " +
                "                                                                                     " +
                "                                  Sólo se admiten apuestas que cualquier jugador de  " +
                "                                  la mesa pueda asumir.                              " +
                "                                                                                     " +
                "                                   CODIGO CARTAS:                                    " +
                "                                                  FIGURA  PALO                       " +
                "                                                    7      s     => SIETE PICAS      " +
                "                                                    t      c     => DIEZ TREBOLES    " +
                "                                                    a      h     => AS CORAZONES     " +
                "                                                    k      d     => REY DIAMANTES    " +
                "                                                                                     " +
                "                                   PALOS DE LAS CARTAS                               " +
                "                                       CORAZONES -> h <- HEARTS &hearts;             " +
                "                                       DIAMANTES -> d <- DIAMONDS &diams;            " +
                "                                       PICAS     -> s <- SPADES &spades;             " +
                "                                       TREBOLES  -> c <- CLUBS &clubs;               " +
                "                                                                                     " +
                "                                   FIGURAS DE LAS CARTAS                             " +
                "                                       CARTA 02 CARTA 2                              " +
                "                                       CARTA 03 CARTA 3                              " +
                "                                       CARTA 04 CARTA 4                              " +
                "                                       CARTA 05 CARTA 5                              " +
                "                                       CARTA 06 CARTA 6                              " +
                "                                       CARTA 07 CARTA 7                              " +
                "                                       CARTA 08 CARTA 8                              " +
                "                                       CARTA 09 CARTA 9                              " +
                "                                       CARTA 10 CARTA t                              " +
                "                                       CARTA SOTA  CARTA j                           " +
                "                                       CARTA REINA CARTA q                           " +
                "                                       CARTA REY   CARTA k                           " +
                "                                       CARTA AS    CARTA a                           " +
                "                                                                                     " +
                "                                                                                     " +
                "                                                                                     " +
                "                                                                                     " +
                "                                                                                     " +
                "                                                                                     " +
                "                             LAS CARTAS QUE TU JUEGAS SON:                           " +
                "                             ----------------------------                            " +
                "                                                                                     " +
                "                                       CARTA1: " + carta1 + "                        " +
                "                                       CARTA1: " + carta2 + "                        " +
                "                                                                                     " +
                "                                                                                     " +
                "                                                                                     " + message, "_self");

            // Mensajes
            $scope.$broadcast('topic', 'message');
            $scope.$emit('topic', 'message');

            // Mensajes
            console.log('ON:', 'topic');
            $scope.$on('topic', function (event, arg) {
                console.log('ON:', arg);
                $scope.receiver = 'got your ' + arg;
            });
        };

        // EJECUCCION
        // AL CARGAR LA PAGINA
        $scope.init();

    }]);

pokerControllers.controller('PokerPlayersCtrl', ['$rootScope', '$scope',
    function($rootScope, $scope) {

        // Mensajes
        console.log('ON:', 'topic');
        $scope.$on('topic', function (event, arg) {
            console.log('ON:', arg);
            $scope.receiver = 'got your ' + arg;
        });

        $scope.bid = [2,3,4,5,6];
        $scope.reparto = 'Poker (Texas Holdem)';
        $scope.names = 'Sala 1';
    }]);