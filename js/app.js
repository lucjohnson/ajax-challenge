"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var tasksUrl = 'https://api.parse.com/1/classes/';

angular.module('ProductReviewer', [])
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'iDSvc8cI6s4At8tO8eoClYwe1ayjcmtC4NUSioYQ';
		$httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'S0KT2SK6UY5f2gGDVolwKK2WFNXDLZoV4dHjCeF9';
	})

	.controller('ReviewsController', function($scope, $http) {

	});


