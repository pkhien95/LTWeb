var app = angular.module("linkedin", []);

app.controller("userProfile", function($scope, $http)
{
	$http.get("http://cors.io/?u=http://calculator.net23.net/profile.json")
	.success(function(response)
	{

		$scope.id = response.profile[0].id;
		$scope.name = response.profile[0].name;
		console.log($scope.name);
		$scope.summary = response.profile[0].summary;
		console.log($scope.summary);
		$scope.experience = response.profile[0].experience;
		console.log($scope.experience[0].company)
		$scope.project = response.profile[0].project;
		$scope.skills = response.profile[0].skills;
		$scope.education = response.profile[0].education;
	});

});
