angular.module('mainModule').service('authService', function($q, $http, $cookieStore){
	$cookieStore.put('currentUser', undefined);

	var getUser = function(){
		return $http.get('http://localhost:8000/api/user').then(function(data){
			$cookieStore.put('currentUser', data.data);
		});
	}

	this.getUser = function(){
		return $http.get('http://localhost:8000/api/user').then(function(data){
			$cookieStore.put('currentUser', data.data);
		});
	}

	this.auth = function(email, password){
		return $http.post('http://localhost:8000/api/auth', {email: email, password: password}).then(function(data){
			getUser();
		});
	}

	this.register = function(username, email, password){
		return $http.post('http://localhost:8000/api/register', {username: username, email: email, password: password}).then(function(data){
			getUser();
		});
	}

	this.logout = function(){
		return $http.get('http://localhost:8000/api/logout').then(function(data){
			$cookieStore.put('currentUser', undefined);
			this.currentUser = undefined;
		})
	}

	this.getSavedMovies = function(){
		if($cookieStore.get('currentUser') !== undefined){
			return $cookieStore.get('currentUser');
		}
		else {
			return $http.get('http://localhost:8000/api/user');
		}
	}

	this.saveListing = function(post) {
		console.log('service')
		console.log(post)
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: '/api/saveListing',
			data: {savedListings: post}
		})
		.then(function(response) {
			deferred.resolve(response.data)
		})
		.catch(function(response) {
			if (response.status === 400 || response.status === 401) {
				deferred.reject(response);
			}
		})
		return deferred.promise;
	}
});