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
		//enables star ratings in add a comment
		$scope.rating = 0;
		$scope.max = 5;
		$scope.ratingStates = [
			{stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
		];

		//initializes new comment's score to 0
		$scope.newReview = {score: 0};

		//refreshes current reviews for user to view (highest score on top)
		$scope.refreshReviews = function () {
			$scope.loading = true;
			$http.get(reviewsUrl + '?order=-score')
				.success(function(responseData) {
					$scope.reviews = responseData.results;
					if (responseData.results.length == 0) {
						document.getElementById("no-comments").innerHTML = "No comments yet. Be the first to review this!";
					} else {
						document.getElementById("no-comments").innerHTML = "";
					}
				})
				.error(function(err) {
					console.log(err);
				})
				.finally(function() {
					$scope.loading = false;
				})
		}; //$scope.refreshReviews

		//retrieves data from Parse
		$http.get(reviewsUrl)
			.success(function(data) {
				$scope.reviews = data.results;
			})
			.error(function(err) {
				console.log(err);
			})

			$scope.refreshReviews();

			//adds a user's comment if they fill in all fields
			$scope.addReview = function(review) {
				$scope.inserting = true;
				if (review.name !== undefined && review.title !== undefined && review.body !== undefined && review.rating !== undefined) {
					$http.post(reviewsUrl, review)
						.success(function(responseData) {
							review.objectId = responseData.objectId;
							
							$scope.reviews.push(review);

							$scope.newReview = {score: 0};
						})
						.error(function(err) {
							console.log(err);
						})
						.finally(function() {
							$scope.inserting = false;
							document.getElementById('message').innerHTML = ""; 
							$scope.refreshReviews();
						})
				} else {
					$scope.inserting = false;
					document.getElementById('message').innerHTML = "Please fill in all fields"; 
				}
			};

			//increases a comment's score by 1
			$scope.upvote = function(review) {
				$scope.review = {score: review.score++};
				$http.put(reviewsUrl + '/' + review.objectId, review)
					.success(function() {

					})
					.error(function(err) {
						console.log(err);
					})
			};

			//decreases a comment's score by 1
			$scope.downvote = function(review) {
				if (review.score != 0) {
					$scope.review = {score: review.score--};
				}
				$http.put(reviewsUrl + '/' + review.objectId, review)
					.success(function() {

					})
					.error(function(err) {
						console.log(err);
					})
			}

			//allows a user to delete a review from the page and Parse
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


