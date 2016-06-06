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
		$scope.experience = [];
		$scope.headline = "";
		$scope.current = [];
		$scope.previous = [];
		$scope.project = "";
		$scope.skills = "";
		$scope.education = "";
		$scope.index = 0;
		var newUser = true;
		var ref = new Firebase('https://cvcreator.firebaseio.com/profile');
		var data = $firebaseArray(ref);
		ref.onAuth(authDataCallback);
		var userID;
		var userIndex;
		//Get current user 
		function authDataCallback(authData) 
		{
			if (authData) 
			{
				userID = authData.uid;
	
				//Start loading user profile.
				
				data.$loaded().then(function(tasks)
				{
					console.log("Number of users: " + data.length);
					userIndex = findProfile(data, userID);	//Find current auth user and load his/her profile.
					console.log("User userIndex: " + userIndex);
					if(userIndex == -1)	//This is a new user
					{
						$scope.name = "Unidentifed";
						//$scope.summary = "Unidentifed";
						newUser = true;
						data.$add({
							"id": userID,
							name: "Unidentifed",
							"avatar": "",
							"address": "",
							"industry": "",
							"summary": "",
							"experience": "",
							"project": "",
							"skills": "",
							"education": ""
						});
					}
					else //This user has a profile
					{
						console.log(userIndex);
						$scope.name = data[userIndex].name;
						$scope.avatar = data[userIndex].avatar;
						$scope.address = data[userIndex].address;
						$scope.industry = data[userIndex].industry;
						//if (data[userIndex].summary == null)
							//data[userIndex].summary = "Add summary";
						$scope.summary = data[userIndex].summary;
						$scope.experience = data[userIndex].experience;
						$scope.project = data[userIndex].project;
						$scope.skills = data[userIndex].skills;
						$scope.education = data[userIndex].education;
						newUser = false;
					}
					updateExp();
				});

			}
			else
			{
				console.log("User is logged out");
			}
		}

		

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

		function findProfile(data, userID)
		{
			for(var i = 0; i < data.length; i++)
			{
				if(data[i].id == userID)
				{
					return i;
				}
			}
			return -1;
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
			if(newUser)
			{
				var user = data[data.length - 1];
				user.avatar = $scope.avatar;
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.avatar = $scope.avatar;
				data.$save(user);
			}
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
			//var index = findProfile(data, userID);
			switch(element)
			{
				case "summary":
					$scope.editting = true;
					$scope.summaryTextFocusing = false;
					$scope.summaryTextLeft = false;
					$scope.lostFocus = false;
					//$scope.summary = "Add summary";
					$scope.summary = document.getElementById("summaryTextEdit").innerHTML;
					$("#editSummaryButton").hide();
					$("#summaryText").hide();
					$("#summaryTextEditContainer").addClass("slide-show");
					break;

			}
		}

		$scope.save = function(element)
		{
			//var index = findProfile(data, userID);
			//var useref = ref.child("profile");
			//var hopperef = useref.child("id");
			switch(element)
			{
				case "summary":
					$scope.editting = false;
					$scope.summaryTextFocusing = true;
					$scope.summaryTextLeft = false;
					$scope.lostFocus = true;
					$scope.summary = document.getElementById("summaryTextEdit").value;
					document.getElementById("summaryText").innerHTML = $scope.summary;
					//hopperef.update({"summary":$scope.summary});
					if(newUser)
					{
						var user = data[data.length - 1];
						user.summary = $scope.summary;
						data.$save(user);
						console.log("Saved new name");
					}
					else
					{
						var user = data[userIndex];
						user.summary = $scope.summary;
						data.$save(user);
					}
					$("#editSummaryButton").hide();
					$("#summaryText").show();
					$("#summaryTextEditContainer").removeClass("slide-show");
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
			if(newUser)
			{
				var user = data[data.length - 1];
				user.name = $scope.name;
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.name = $scope.name;
				data.$save(user);
			}
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
			/*if(newUser)
			{
				var user = data[data.length - 1];
				user.headline = $scope.name;
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.name = $scope.name;
				data.$save(user);
			}*/
			
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
			$("#textAdress").val($scope.address);
			$("#textIndustry").val($scope.industry);
			$("#editAddress").hide();
			$("#textAdress").show();
			$("#editIndustry").hide();
			$("#textIndustry").show();
			if(newUser)
			{
				var user = data[data.length - 1];
				user.address = $scope.address;
				user.industry = $scope.industry;
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.address = $scope.address;
				user.industry = $scope.industry;
				data.$save(user);
			}
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
			if(newUser)
			{
				var user = data[data.length - 1];
				user.experience[index].company = $scope.experience[index].company;
				user.experience[index].position = $scope.experience[index].position;
				user.experience[index].duration = $scope.experience[index].duration;
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.experience[index].company = $scope.experience[index].company;
				user.experience[index].position = $scope.experience[index].position;
				user.experience[index].duration = $scope.experience[index].duration;
				data.$save(user);
			}
			$scope.index = index;
			console.log($scope.index);
			
			
		}

		$scope.deleteExp = function(index)
		{
			$scope.experience.splice(index, 1);
			console.log($scope.experience);
			if(newUser)
			{
				var user = data[data.length - 1];
				user.experience.splice(index, 1);
				data.$save(user);
				$scope.experience = data[data.length - 1].experience;
			}
			else
			{
				var user = data[userIndex];
				user.experience.splice(index, 1);
				data.$save(user);
				$scope.experience = data[userIndex].experience;
			}
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
				// $scope.experience.push(temp);
				if(newUser)
				{
					var user = data[data.length - 1];
					user.experience = [];
					user.experience.push(temp);
					data.$save(user);
					$scope.experience = data[data.length - 1].experience;
				}
				else
				{
					var user = data[userIndex];
					user.experience.push(temp);
					data.$save(user);
					$scope.experience = data[userIndex].experience;
				}
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
			
			if(newUser)
			{
				var user = data[data.length - 1];
				user.experience[$scope.index].company = $scope.experience[$scope.index].company;
				user.experience[$scope.index].position = $scope.experience[$scope.index].position;
				user.experience[$scope.index].duration = $scope.experience[$scope.index].duration;
				
				data.$save(user);
			}
			else
			{
				var user = data[userIndex];
				user.experience[$scope.index].company = $scope.experience[$scope.index].company;
				user.experience[$scope.index].position = $scope.experience[$scope.index].position;
				user.experience[$scope.index].duration = $scope.experience[$scope.index].duration;
				data.$save(user);
			}
		}

		$scope.addExperience = function()
		{
			$("#editCompany").val("");
			$("#editPosition").val("");
			$("#editDuration").val("");
			$("#modalExperience").modal('show');
			
			$scope.index = -1;
			
			
		}
		
		function updateProj()
		{
			$scope.current.length = 0;
			$scope.previous.length = 0;
			for(var i = 0; i < $scope.project.length; i++)
			{
				if($scope.project[i].current == "true" || $scope.project[i].current == true)
				{
					$scope.current.push($scope.project[i]);
				}
				else
				{
					$scope.previous.push($scope.project[i]);
				}
			}
		}
		
		function updateSkill()
		{
			$scope.current.length = 0;
			$scope.previous.length = 0;
			for(var i = 0; i < $scope.skills.length; i++)
			{
				if($scope.skills[i].current == "true" || $scope.skills[i].current == true)
				{
					$scope.current.push($scope.skills[i]);
				}
				else
				{
					$scope.previous.push($scope.skills[i]);
				}
			}
		}
		
		function updateEdu()
		{
			$scope.current.length = 0;
			$scope.previous.length = 0;
			for(var i = 0; i < $scope.education.length; i++)
			{
				if($scope.education[i].current == "true" || $scope.education[i].current == true)
				{
					$scope.current.push($scope.education[i]);
				}
				else
				{
					$scope.previous.push($scope.education[i]);
				}
			}
		}
		

		$scope.editProject = function(index)
		{
			$("#editProjectName").val($scope.project[index].name);
			$("#editProjectDetail").val($scope.project[index].detail);
			
			if(newUser)
			{
				var user = data[data.length - 1];
				user.project[index].name = $scope.project[index].name;
				user.project[index].detail = $scope.project[index].detail;
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.project[index].name = $scope.project[index].name;
				user.project[index].detail = $scope.project[index].detail;
				data.$save(user);
			}
			
			$("#modalProject").modal('show');
			$scope.index = index;
		}

		$scope.deleteProject = function(index)
		{
			$scope.project.splice(index, 1);
			
			//$scope.experience.splice(index, 1);
			console.log($scope.project);
			if(newUser)
			{
				var user = data[data.length - 1];
				user.project.splice(index, 1);
				data.$save(user);
				$scope.project = data[data.length - 1].project;
			}
			else
			{
				var user = data[userIndex];
				user.project.splice(index, 1);
				data.$save(user);
				$scope.project = data[userIndex].project;
			}
			updateProj();
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
				//$scope.project.push(temp);
				
				if(newUser)
				{
					var user = data[data.length - 1];
					user.project = [];
					user.project.push(temp);
					data.$save(user);
					$scope.project = data[data.length - 1].project;
				}
				else
				{
					var user = data[userIndex];
					user.project.push(temp);
					data.$save(user);
					$scope.project = data[userIndex].project;
				}
				updateProj();
				
				console.log("added")
				return;
			}
			$scope.project[$scope.index].name = $("#editProjectName").val();
			$scope.project[$scope.index].detail = $("#editProjectDetail").val();
			$("#modalProject").modal('hide');
			updateProj();
			if(newUser)
			{
				var user = data[data.length - 1];
				user.project[$scope.index].name = $scope.project[$scope.index].name;
				user.project[$scope.index].detail = $scope.project[$scope.index].detail;
				
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.project[$scope.index].name = $scope.project[$scope.index].name;
				user.project[$scope.index].detail = $scope.project[$scope.index].detail;
				data.$save(user);
			}
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
			
			console.log($scope.skills);
			if(newUser)
			{
				var user = data[data.length - 1];
				user.skills.splice(index, 1);
				data.$save(user);
				$scope.skills = data[data.length - 1].skills;
			}
			else
			{
				var user = data[userIndex];
				user.skills.splice(index, 1);
				data.$save(user);
				$scope.skills = data[userIndex].skills;
			}
			updateSkill();
		}

		$scope.newSkill = function()
		{

			$("#editSkillName").val("");
			$("#modalSkill").modal('show');
			$scope.index = -1;
		}

		$scope.addSkill = function()
		{
			if($scope.index == -1) //Need to add
			{
				var temp = 
				{
					"name" : $("#editSkillName").val()
				};
				if(newUser)
				{
					var user = data[data.length - 1];
					user.skills = [];
					user.skills.push(temp);
					data.$save(user);
					$scope.skills = data[data.length - 1].skills;
				}
				else
				{
					var user = data[userIndex];
					user.skills.push(temp);
					data.$save(user);
					$scope.skills = data[userIndex].skills;
				}
				updateSkill();
				
				console.log("added")
				return;
			}
			//$scope.skills.push(temp);
			
			$scope.skills[$scope.index].name = $("#editSkillName").val();
			
			$("#modalSkill").modal('hide');
			updateSkill();
			if(newUser)
			{
				var user = data[data.length - 1];
				user.skills[$scope.index].name = $scope.skills[$scope.index].name;
				
				
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.skills[$scope.index].name = $scope.skills[$scope.index].name;
				data.$save(user);
			}
		}

		$scope.editSchool= function(index)
		{
			$("#editSchool").val($scope.education[index].school);
			$("#editCertificate").val($scope.education[index].certificate);
			$("#editSchoolDuration").val($scope.education[index].duration);
			$("#modalEducation").modal('show');
			
			if(newUser)
			{
				var user = data[data.length - 1];
				user.education[index].school = $scope.education[index].school;
				user.education[index].certificate = $scope.education[index].certificate;
				user.education[index].duration = $scope.education[index].duration;
				data.$save(user);
				console.log("Saved new name");
			}
			else
			{
				var user = data[userIndex];
				user.education[index].school = $scope.education[index].school;
				user.education[index].certificate = $scope.education[index].certificate;
				user.education[index].duration = $scope.education[index].duration;
				data.$save(user);
			}
			
			console.log($scope.current);
			$scope.index = index;
			
		}

		$scope.deleteSchool = function(index)
		{
			$scope.education.splice(index, 1);
			
			console.log($scope.education);
			if(newUser)
			{
				var user = data[data.length - 1];
				user.education.splice(index, 1);
				data.$save(user);
				$scope.education = data[data.length - 1].education;
			}
			else
			{
				var user = data[userIndex];
				user.education.splice(index, 1);
				data.$save(user);
				$scope.education = data[userIndex].education;
			}
			updateEdu();
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
				//$scope.education.push(temp);
				if(newUser)
				{
					var user = data[data.length - 1];
					user.education = [];
					user.education.push(temp);
					data.$save(user);
					$scope.education = data[data.length - 1].education;
				}
				else
				{
					var user = data[userIndex];
					user.education.push(temp);
					data.$save(user);
					$scope.education = data[userIndex].education;
				}
				updateEdu();
				
				console.log("added")
				return;
			}
			else
			{
				$scope.education[$scope.index].school = $("#editSchool").val();
				$scope.education[$scope.index].certificate = $("#editCertificate").val();
				$scope.education[$scope.index].duration = $("#editSchoolDuration").val();
				$("#modalEducation").modal('hide');
				
				updateEdu();
				if(newUser)
				{
					var user = data[data.length - 1];
					user.education[$scope.index].school = $scope.education[$scope.index].school;
					user.education[$scope.index].certificate = $scope.education[$scope.index].certificate;
					user.education[$scope.index].duration = $scope.education[$scope.index].duration;
					data.$save(user);
					console.log("Saved new name");
				}
				else
				{
					var user = data[userIndex];
					user.education[$scope.index].school = $scope.education[$scope.index].school;
					user.education[$scope.index].certificate = $scope.education[$scope.index].certificate;
					user.education[$scope.index].duration = $scope.education[$scope.index].duration;
					data.$save(user);
				}
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
