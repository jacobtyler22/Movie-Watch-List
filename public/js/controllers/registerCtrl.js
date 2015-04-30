angular.module('mainModule').controller('registerCtrl', function($scope, $rootScope, $location, $cookieStore, authService){
	
	$scope.register = function(){
		authService.register($scope.usernameRegisterField, $scope.emailRegisterField, $scope.passwordRegisterField).then(function(){
			$scope.registerStatus = 'Your account has been registered!';
			console.log($scope.registerStatus);
			$scope.registerStatusColor = 'green';
			$rootScope.$broadcast('auth');
			$location.path('/movies')
		}, function(err){
			$scope.registerStatus = 'Invalid Information';
			$scope.registerStatusColor = 'red';
		});
	}
});