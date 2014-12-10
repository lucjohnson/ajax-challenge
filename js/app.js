"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var reviewsUrl = 'https://api.parse.com/1/classes/reviews';

angular.module('ProductReviewer', ['ui.bootstrap'])
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'iDSvc8cI6s4At8tO8eoClYwe1ayjcmtC4NUSioYQ';
		$httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'S0KT2SK6UY5f2gGDVolwKK2WFNXDLZoV4dHjCeF9';
	})

	.controller('ReviewsController', function($scope, $http) {
		
		$scope.rating = 0;
		$scope.max = 5;

		// $scope.hoveringOver = function(value) {
		// 	$scope.overStar = value;
		// };

		$scope.ratingStates = [
			{stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
		];

		$scope.refreshReviews = function () {
			$scope.loading = true;
			$http.get(reviewsUrl)
				.success(function(responseData) {
					$scope.reviews = responseData.results;
				})
				.error(function(err) {
					console.log(err);
				})
				.finally(function() {
					$scope.loading = false;
				})
		}; //$scope.refreshReviews

		$http.get(reviewsUrl)
			.success(function(data) {
				$scope.reviews = data.results;
			})
			.error(function(err) {
				console.log(err);
			})

			$scope.refreshReviews();

			$scope.newReview = {score: 0};

			$scope.addReview = function(review) {
				$scope.inserting = true;
				$http.post(reviewsUrl, review)
					.success(function(responseData) {
						review.objectId = responseData.objectId;
						
						$scope.reviews.push(review);
					})
					.error(function(err) {
						console.log(err);
					})
					.finally(function() {
						$scope.inserting = false;
					})
			};

			$scope.upvote = function(review) {
				$http.put(reviewsUrl + '/' + review.objectId, review)
					.success(function() {
						$scope.review = {score: review.score++};
					})
			};

			$scope.downvote = function(review) {
				$http.put(reviewsUrl + '/' + review.objectId, review)
					.success(function() {
						if (review.score != 0) {
							$scope.review = {score: review.score--};
						}
					})
			}

			$scope.removeReview = function(review) {
				$scope.updating = true;
				$http.delete(reviewsUrl + '/' + review.objectId, review) 
					.success(function(responseData) {

					})
					.error(function(err) {
						console.log(err);
					})
					.finally(function() {
						$scope.updating = false;
						$scope.refreshReviews();
					})
			};
	});


