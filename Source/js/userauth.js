// Create a callback which logs the current auth state
function authDataCallback(authData) {
	if (authData) 
	{
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		$("#summaryInfo").show();
		$("#backgroundInfo").show();
		loggedIn = true;

		//Show current user
		$(".currentUser").show();
		$("#username").html(getName(ref.getAuth()));

		//Hide "Change password" item dropdown if user logged in with other provider
		if(ref.getAuth.provider != "password")
		{
			$("#changePassword").hide();
		}
		else
		{
			console.log("Show change password");
			$("#changePassword").show();
		}
	} 
	else 
	{
		console.log("User is logged out");
		loggedIn = false;
	}
}
// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://cvcreator.firebaseio.com");
var loggedIn = false;
ref.onAuth(authDataCallback);

$(document).ready(function()
{
	//Logout
	$("#logOut").on("click", function()
	{
		console.log("Log out request");
		ref.unauth();

		//Hide all element until user is logged in.
		$("#summaryInfo").hide();
		$("#backgroundInfo").hide();
		$(".currentUser").hide();
		
		//Show log in modal
		$("#modalLogin").modal("show");
	});

	console.log("Page loaded");
	if(loggedIn)
	{
		//Show current user
		console.log(getName(ref.getAuth()));
		$(".currentUser").show();
		$("#username").html(getName(ref.getAuth()));
		
	}
	else
	{
		//Hide all element until user is logged in.
		$("#summaryInfo").hide();
		$("#backgroundInfo").hide();
		$(".currentUser").hide();

		//Show log in modal
		$("#modalLogin").modal("show");
	}


	//Login
	$("#loginBtn").on("click", function()
	{
		console.log("Login request");
		var emailInput = $("#editLogEmail").val();
		var passwordInput = $("#editLogPassword").val();
		var persisting = "sessionOnly";
		if($("#checkboxRemember").is(":checked") == true)
		{
			persisting = "default";
		}
		console.log(persisting);
		ref.authWithPassword({
			email    : emailInput,
			password : passwordInput
		}, 
		function(error, authData) 
		{
		  	if (error) 
		  	{
		    	switch (error.code) 
		    	{
					case "INVALID_EMAIL":
		        		console.log("The specified user account email is invalid.");
		        		$("#loginError").text("Email is incorrect");
		        		break;
		     		case "INVALID_PASSWORD":
		        		console.log("The specified user account password is incorrect.");
		        		$("#loginError").text("Password is incorrect");
		        		break;
		      		case "INVALID_USER":
		        		console.log("The specified user account does not exist.");
		        		$("#loginError").text("Email is incorrect");
		        		break;
		      		default:
		        		console.log("Error logging user in:", error);
		        		$("#loginError").text(error);
		    	}
		  	} 
		  	else 
		  	{
		    	console.log("Authenticated successfully with payload:", authData);
		    	$("#modalLogin").modal("hide");
		    	$(".currentUser").show();
		    	$("#changePassword").show();
		  	}
		}, 
		{
			remember: persisting
		});
	});


	//Reset password
	$("#resetPassword").on("click", function()
	{
		console.log("Reset password request");
		$("#modalReset").modal("show");

		$("#getNewPassBtn").on("click", function()
		{
			var emailInput = $("#editResetEmail").val();
			ref.resetPassword({
				email: emailInput
			}, 
			function(error) 
			{
			  	if (error) 
			  	{
				    switch (error.code) 
				    {
				      	case "INVALID_USER":
				        	console.log("The specified user account does not exist.");
				        	$("#resetResult").text("This email is not a registered email");
				        	$("#resetResult").css("color", "red");
				        	break;
				      	default:
				        	console.log("Error resetting password:", error);
				        	$("#resetResult").text(error);
				        	$("#resetResult").css("color", "red");
				    }
			  	} 
			  	else 
			  	{
			    	console.log("Password reset email sent successfully !");
			    	$("#resetResult").text("Password reset email sent successfully !");
			    	$("#resetResult").css("color", "#0066d8");
			  	}
			});
		});

		//Close reset password modal and reopen login modal
		$("#closeResetModalBtn").on("click", function()
		{
			$("#modalLogin").modal("show");
		});
	});

	//Register
	$("#registerBtn").on("click", function()
	{
		console.log("Register request");
		$("#modalRegister").modal("show");

		$("#submitAccBtn").on("click", function()
		{	
			if(checkRegister() == 1)
			{
				$("#regisResult").css("color", "red");
				$("#regisResult").text("Confirm email does not match.");
				return;
			}
			else if(checkRegister() == 2)
			{
				$("#regisResult").css("color", "red");
				$("#regisResult").text("Confirm password does not match.");
				return;
			}
			var emailInput = $("#editRegisEmail").val();
			var passwordInput = $("#editRegisPassword").val();
			console.log("Request creating user: " + emailInput + ", " + passwordInput);
			ref.createUser({
				email: emailInput,
				password: passwordInput
			}, 
			function(error, userData) 
			{
				if (error) 
				{
					$("#regisResult").css("color", "red");
					switch (error.code) 
					{
						case "EMAIL_TAKEN":
							console.log("The new user account cannot be created because the email is already in use.");
							$("#regisResult").text("This email is already in use.");
							break;
						case "INVALID_EMAIL":
							console.log("The specified email is not a valid email.");
							$("#regisResult").text("Invalid email.");
							break;
						default:
							console.log("Error creating user:", error);
							$("#regisResult").text(error);
					}
				} 
				else 
				{
					$("#regisResult").css("color", "#0066d8");
					$("#regisResult").text("Created user account successfully.");
					console.log("Successfully created user account with uid:", userData.uid);
				}
			});
		});

		//Close the register modal and reopen login modal
		$("#cancelRegisBtn").on("click", function()
		{
			$("#modalLogin").modal("show");
		});

		$("#confirmRegisEmail").blur(function()
		{
			if($(this).val() == $("#editRegisEmail").val())
			{
				$(this).parent().removeClass("has-error").addClass("has-success");
			}
			else
			{
				$(this).parent().removeClass("has-success").addClass("has-error");
			}
		});

		$("#confirmRegisPassword").blur(function()
		{
			if($(this).val() == $("#editRegisPassword").val())
			{
				$(this).parent().removeClass("has-error").addClass("has-success");
			}
			else
			{
				$(this).parent().removeClass("has-success").addClass("has-error");
			}
		});
	});


	//Change password
	$("#changePassword").on("click", function()
	{
		console.log("Change password request");
		$("#currentUserEmail").val(ref.getAuth().password.email);
		$("#modalChangePassword").modal("show");

		$("#confirmNewPassword").blur(function()
		{
			if($(this).val() == $("#editNewPassword").val())
			{
				$(this).parent().removeClass("has-error").addClass("has-success");
			}
			else
			{
				$(this).parent().removeClass("has-success").addClass("has-error");
			}
		});

		$("#saveNewPassword").on("click", function()
		{
			if(checkChangePassword() == 1)
			{
				$("#changePasswordResult").css("color", "red");
				$("#changePasswordResult").text("Confirm new password does not match.");
			}
			else
			{
				var emailInput = $("#currentUserEmail").val();
				var oldPasswordInput = $("#editOldPassword").val();
				var newPasswordInput = $("#editNewPassword").val();
				ref.changePassword({
					email: emailInput,
					oldPassword: oldPasswordInput,
					newPassword: newPasswordInput
				}, 
				function(error) 
				{
					if (error) 
					{
						$("#changePasswordResult").css("color", "red");
						switch (error.code) 
						{
							case "INVALID_PASSWORD":
								console.log("The specified user account password is incorrect.");
								$("#changePasswordResult").text("Invalid old password.");
								break;
							case "INVALID_USER":
								console.log("The specified user account does not exist.");
								$("#changePasswordResult").text("Invalid user.");
								break;
							default:
								console.log("Error changing password:", error);
								$("#changePasswordResult").text(error);
						}
					} 
					else 
					{
						$("#changePasswordResult").css("color", "#0066d8");
						$("#changePasswordResult").text("Change password successfully.");
						console.log("User password changed successfully!");

					}
				});
			}
		})
	})

	//Login with Facebook
	$("#facebookLoginBtn").on("click", function()
	{
		console.log("Login with Facebook request");
		ref.authWithOAuthPopup("facebook", function(error, authData) 
		{
			if (error) 
			{
				console.log("Login Failed!", error);
				$("#modalLogin").modal("show");
			} 
			else
			{
				console.log("Authenticated successfully with payload:", authData);
				$("#modalLogin").modal("hide");
			}
		});
	});
	
	//Login with Google
	$("#googleLoginBtn").on("click", function()
	{
		console.log("Login with Google request");
		ref.authWithOAuthPopup("google", function(error, authData) 
		{
			if (error) 
			{
				console.log("Login Failed!", error);
				$("#modalLogin").modal("show");
			} 
			else
			{
				console.log("Authenticated successfully with payload:", authData);
				$("#modalLogin").modal("hide");
				$("#username").html(getName(ref.getAuth()));
			}
		});
	});
	
});

function checkRegister()
{
	var email = $("#editRegisEmail").val();
	var password = $("#editRegisPassword").val();
	var confirmEmail = $("#confirmRegisEmail").val();
	var confirmPassword = $("#confirmRegisPassword").val();

	if(email != confirmEmail)
	{
		return 1;
	}

	if(password != confirmPassword)
	{
		return 2;
	}
	return 0;
}

function checkChangePassword()
{
	var password = $("#editNewPassword").val();
	var confirmPassword = $("#confirmNewPassword").val();
	if(password != confirmPassword)
	{
		return 1;
	}
	return 0;
}

// find a suitable name based on the meta info given by each provider
function getName(authData) 
{
	switch(authData.provider) 
	{
		case 'password':
			return authData.password.email.replace(/@.*/, '');
		case 'google':
			return authData.google.displayName;
		case 'facebook':
			return authData.facebook.displayName;
	}
}
