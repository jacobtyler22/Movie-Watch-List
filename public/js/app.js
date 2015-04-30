var app = angular.module('mainModule', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider){
	$routeProvider.when("/list", {
		templateUrl: "js/views/watch-list-view.html",
		controller: "watchListCtrl"
	}).when("/movies", {
		templateUrl: "js/views/movies-view.html",
		controller: "moviesCtrl"
	}).when("/login", {
		templateUrl: "js/views/login-view.html",
		controller: "loginCtrl"
	}).when("/register", {
		templateUrl: "js/views/register-view.html",
		controller: "registerCtrl"
	}).otherwise("/movies");
});

app.controller('toolbarCtrl', function($scope, $rootScope, $location, $cookieStore, authService){
	$scope.currentUser = authService.currentUser;

	$scope.$on('auth', function(){
		$scope.currentUser = authService.getUser();
	});

	$scope.logout = function(){
		authService.logout().then(function(){
			$scope.currentUser = authService.currentUser;
			$location.path('/movies');
		});
	}
});