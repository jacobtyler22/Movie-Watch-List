angular.module('mainModule').controller('moviesCtrl', function($scope, movieService){
	$scope.pageNum = 1;
	$scope.movieList = [];
	$scope.getMovies = function(num){
		if(num)$scope.pageNum = num;
		movieService.getMovieList($scope.searchName, $scope.pageNum).then(function(data){
			$scope.movieList = data.data.results;
		});
		console.log($scope.movieList);
	}

	$scope.nextPage = function(){
		$scope.pageNum++;
		$scope.getMovies();
	}

	$scope.previousPage = function(){
		if($scope.pageNum > 1){
			$scope.pageNum--;
			$scope.getMovies();
		}
	}

	$scope.addToList = function(){
		
	}
	
	$scope.getMovies();
});