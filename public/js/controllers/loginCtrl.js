angular.module('mainModule').controller('loginCtrl', function($scope, $rootScope, $location, $cookieStore, authService){
	
	$scope.login = function(){
		authService.auth($scope.emailLoginField, $scope.passwordLoginField).then(function(){
			$scope.loginStatus = 'You are successfully logged in!';
			console.log($scope.loginStatus);
			$scope.loginStatusColor = 'green';
			$rootScope.$broadcast('auth');
			$location.path('/movies');
		}, function(err){
			$scope.loginStatus = 'Incorrect Information';
			$scope.loginStatusColor = 'red';
		});
	}
});