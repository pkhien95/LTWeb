var app = angular.module("linkedin", ["firebase"]);

app.controller("userProfile", ["$scope", "$firebaseArray",
	function($scope, $firebaseArray) 
	{
		$scope.summaryTextFocusing = false;
		$scope.summaryTextLeft= true;
		$scope.editting = false;
		$scope.lostFocus = true;
		$scope.id = "";
		$scope.name = "";
		$scope.avatar = "";
		$scope.address = "";
		$scope.industry = "";
		$scope.summary = "";
		$scope.experience = "";
		$scope.current = [];
		$scope.previous = [];
		$scope.project = "";
		$scope.skills = "";
		$scope.education = "";
		$scope.index = 0;
		
		var ref = new Firebase('https://cvcreator.firebaseio.com/profile');
		var data = $firebaseArray(ref);
		// $scope.name = $scope.data.$getRecord('name');
		data.$loaded().then(function(tasks) 
		{
			$scope.name = data[0].name;
			$scope.avatar = data[0].avatar;
			$scope.address = data[0].address;
			$scope.industry = data[0].industry;
			$scope.summary = data[0].summary;
			$scope.experience = data[0].experience;
			$scope.project = data[0].project;
			$scope.skills = data[0].skills;
			$scope.education = data[0].education;


			// for(var i = 0; i < $scope.experience.length; i++)
			// {
			// 	if($scope.experience[i].current == "true" || $scope.experience[i].current == true)
			// 	{
			// 		$scope.current.push($scope.experience[i]);
			// 	}
			// 	else
			// 	{
			// 		$scope.previous.push($scope.experience[i]);
			// 	}
			// }
			updateExp();
		});

		function updateExp()
		{
			$scope.current.length = 0;
			$scope.previous.length = 0;
			for(var i = 0; i < $scope.experience.length; i++)
			{
				if($scope.experience[i].current == "true" || $scope.experience[i].current == true)
				{
					$scope.current.push($scope.experience[i]);
				}
				else
				{
					$scope.previous.push($scope.experience[i]);
				}
			}
		}

		$scope.editPhoto = function()
		{
			console.log("Edit Photo");
	        // $("#changePhotoInput").trigger('click'); // opening dialog
	        // console.log(document.getElementById("changePhotoInput").value);
	        // return false; // avoiding navigation

	        $("#editPhotoURL").val("");
			$("#modalFile").modal('show');
		}

		$scope.uploadPhoto = function()
		{
			console.log("Uploading Photo");
			$scope.avatar = $("#editPhotoURL").val();

			console.log($("#editPhotoURL").val());
		}



		$('#changePhotoInput').on('change', function()
        {
            var filePath = $(this).val();
            console.log(filePath);
        });

		$scope.summaryTextMouseOver = function()
		{
			if(!$scope.editting)
			{
				$scope.summaryTextFocusing = true;
				$scope.summaryTextLeft = false;
			}
			$("#editSummaryButton").show();
		}

		$scope.summaryTextMouseLeave = function()
		{
			if(!$scope.editting)
			{
				$scope.summaryTextFocusing = false;
				$scope.summaryTextLeft = true;
			}
			$("#editSummaryButton").hide();
		}

		$scope.edit = function(element)
		{
			switch(element)
			{
				case "summary":
					$scope.editting = true;
					$scope.summaryTextFocusing = false;
					$scope.summaryTextLeft = false;
					$scope.lostFocus = false;
					$scope.summary = document.getElementById("summaryTextEdit").innerHTML;
					
					break;
			}
		}

		$scope.save = function(element)
		{
			switch(element)
			{
				case "summary":
					$scope.editting = false;
					$scope.summaryTextFocusing = true;
					$scope.summaryTextLeft = false;
					$scope.lostFocus = true;
					$scope.summary = document.getElementById("summaryTextEdit").value;
					document.getElementById("summaryText").innerHTML = $scope.summary;
					$("#editSummaryButton").hide();
					break;
			}
		}

		$scope.cancelSummary = function(element)
		{
			$scope.editting = false;
			$scope.summaryTextFocusing = true;
			$scope.summaryTextLeft = false;
			$scope.lostFocus = true;
		}

		$scope.nameMouseOver = function()
		{
			console.log("Name mouse over");
			$("#editNameButton").show();
			$("#textName").css("background-color", "#75cbff");
		}

		$scope.nameMouseLeave = function()
		{
			console.log("Name mouse leave");
			$("#editNameButton").hide();
			$("#textName").css("background-color", "white");
		}

		$scope.textNameClick = function()
		{
			$("#editTextName").show();
			$("#textName").hide();
			$("#editNameButton").hide();
		}

		$scope.completeEditTextName = function()
		{
			$scope.name = $("#editTextName").val();
			$("#textName").val($scope.name);

			$("#editTextName").hide();
			$("#textName").show();
		}

		$scope.scrollTo = function(element)
		{
			switch(element)
			{
				case 'experience':
					$('html, body').animate({
		        	scrollTop: $("#bg_experience").offset().top
		    		}, 500);
					break;
				case 'education':
					$('html, body').animate({
		        	scrollTop: $("#bg_education").offset().top
		    		}, 500);
					break;
			}
		}

		$scope.headlineMouseOver = function()
		{
			$("#editHeadlineButton").show();
			$("#textHeadline").css("background-color", "#75cbff");
		}

		$scope.headlineMouseLeave = function()
		{
			console.log("headline mouse leave");
			$("#editHeadlineButton").hide();
			$("#textHeadline").css("background-color", "white");
		}

		$scope.textHeadlineClick = function()
		{
			$("#editTextHeadline").show();
			$("#textHeadline").hide();
			$("#editHeadlineButton").hide();
		}

		$scope.completeEditTextHeadline = function()
		{
			$("#textHeadline").text($("#editTextHeadline").val());
			console.log($("#editTextHeadline").val());
			$("#editTextHeadline").hide();
			$("#textHeadline").show();
		}

		$scope.locationMouseOver = function()
		{
			$("#locationEditButton").css("background-color", "#75cbff");
			$("#locationEditButton").show();
		}

		$scope.locationMouseLeave = function()
		{
			$("#locationEditButton").hide();
		}

		$scope.saveLocation = function()
		{
			$scope.address = $("#editAddress").val();
			$scope.industry = $("#editIndustry").val();
			("#textAdress").val($scope.address);
			("#textIndustry").val($scope.industry);
		}

		$scope.currentMouseOver = function()
		{
			$("#currentEditButton").css("background-color", "#75cbff");
			$("#currentEditButton").show();
		}

		$scope.currentMouseLeave = function()
		{
			$("#currentEditButton").hide();
		}

		$scope.previousMouseOver = function()
		{
			$("#previousEditButton").css("background-color", "#75cbff");
			$("#previousEditButton").show();
		}

		$scope.previousMouseLeave = function()
		{
			console.log("previous mouse leave");
			$("#previousEditButton").hide();
		}

		$scope.educationMouseOver = function()
		{
			$("#educationEditButton").css("background-color", "#75cbff");
			$("#educationEditButton").show();
		}

		$scope.educationMouseLeave = function()
		{
			$("#educationEditButton").hide();
		}

		$scope.editExp = function(index)
		{
			$("#editCompany").val($scope.experience[index].company);
			$("#editPosition").val($scope.experience[index].position);
			$("#editDuration").val($scope.experience[index].duration);
			if($scope.experience[index].current == "true")
				$("#editCurrent").prop('checked', true);
			else
				$("#editCurrent").prop('checked', false);
			$("#modalExperience").modal('show');
			$scope.index = index;
			console.log($scope.index);
		}

		$scope.deleteExp = function(index)
		{
			$scope.experience.splice(index, 1);
			console.log($scope.experience);
			updateExp();
		}

		$scope.saveExperience = function()
		{
			var current = "";
			if($("#editCurrent").is(":checked") == true)
			{
				current = "true";
			}
			else
			{
				current = "false";
			}

			if($scope.index == -1) //Need to add
			{
				var temp = 
				{
					"company" : $("#editCompany").val(),
					"current" : current,
					"position" : $("#editPosition").val(),
					"duration" : $("#editDuration").val(),
				};
				$scope.experience.push(temp);
				updateExp();
				console.log("added")
				return;
			}
			$scope.experience[$scope.index].company = $("#editCompany").val();
			$scope.experience[$scope.index].position = $("#editPosition").val();
			$scope.experience[$scope.index].duration = $("#editDuration").val();
			$scope.experience[$scope.index].current = $("#editCurrent").is(":checked");
			
			$("#modalExperience").modal('hide');

			console.log($scope.experience);
			//update
			updateExp();
			console.log($scope.current);
		}

		$scope.addExperience = function()
		{
			$("#editCompany").val("");
			$("#editPosition").val("");
			$("#editDuration").val("");
			$("#modalExperience").modal('show');
			$scope.index = -1;
		}

		$scope.editProject = function(index)
		{
			$("#editProjectName").val($scope.project[index].name);
			$("#editProjectDetail").val($scope.project[index].detail);
			$("#modalProject").modal('show');
			$scope.index = index;
		}

		$scope.deleteProject = function(index)
		{
			$scope.project.splice(index, 1);
		}

		$scope.saveProject = function()
		{
			if($scope.index == -1) //Need to add
			{
				var temp = 
				{
					"name" : $("#editProjectName").val(),
					"detail" : $("#editProjectDetail").val()
				};
				$scope.project.push(temp);
				console.log("added")
				return;
			}
			$scope.project[$scope.index].name = $("#editProjectName").val();
			$scope.project[$scope.index].detail = $("#editProjectDetail").val();
			$("#modalProject").modal('hide');
		}

		$scope.addProject = function()
		{
			$("#editProjectName").val("");
			$("#editProjectDetail").val("");
			$("#modalProject").modal('show');
			$scope.index = -1;
		}

		$scope.deleteSkill = function(index)
		{
			$scope.skills.splice(index, 1);
		}

		$scope.newSkill = function()
		{

			$("#editSkillName").val("");
			$("#modalSkill").modal('show');
			$scope.index = -1;
		}

		$scope.addSkill = function()
		{
			var temp = 
				{
					"name" : $("#editSkillName").val()
				};
			$scope.skills.push(temp);
		}

		$scope.editSchool= function(index)
		{
			$("#editSchool").val($scope.education[index].school);
			$("#editCertificate").val($scope.education[index].certificate);
			$("#editSchoolDuration").val($scope.education[index].duration);
			$("#modalEducation").modal('show');
			console.log($scope.current);
			$scope.index = index;
		}

		$scope.deleteSchool = function(index)
		{
			$scope.education.splice(index, 1);
		}

		$scope.saveSchool = function()
		{
			console.log($scope.current);
			if($scope.index == -1) //Need to add
			{
				var temp = 
				{
					"school" : $("#editSchool").val(),
					"certificate" : $("#editCertificate").val(),
					"duration" : $("#editSchoolDuration").val(),
				};
				$scope.education.push(temp);
				
			}
			else
			{
				$scope.education[$scope.index].school = $("#editSchool").val();
				$scope.education[$scope.index].certificate = $("#editCertificate").val();
				$scope.education[$scope.index].duration = $("#editSchoolDuration").val();
				$("#modalEducation").modal('hide');
			}
		}

		$scope.addSchool = function()
		{
			$("#editSchool").val("");
			$("#editCertificate").val("");
			$("#editSchoolDuration").val("");
			$("#modalEducation").modal('toggle');
			$scope.index = -1;
		}

	}
])
.directive('bindFile', [function () {
    return {
        require: "ngModel",
        restrict: 'A',
        link: function ($scope, el, attrs, ngModel) {
            el.bind('change', function (event) {
                ngModel.$setViewValue(event.target.files[0]);
                $scope.$apply();
                console.log($("#changePhotoInput").val());
            });
            
            $scope.$watch(function () {
                return ngModel.$viewValue;
            }, function (value) {
                if (!value) {
                    el.val("");
                }
            });
        }
    };
}]);

// app.controller("userProfile", function($scope)
// {
	
// });
