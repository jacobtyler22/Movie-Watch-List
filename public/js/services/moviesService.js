angular.module('mainModule').service('movieService', function($q, $http){
	this.getMovieList = function(name, page){
		var dfd = $q.defer();
		$http.get('http://localhost:8000/api/' + name + '/' + page.toString()).then(function(data){
			dfd.resolve(data);
		}, function(err){
			dfd.reject(err);
		});
		return dfd.promise;
	}
});