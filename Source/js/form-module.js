var app = angular.module("calculator", []);

app.controller("validateCtrl", function($scope)
{
	$scope.op =
	{
		plus: false,
		sub: false,
		mult: false,
		div: false
	};

	$scope.number1 = "";
	$scope.number2 = "";
	$scope.result;
	$scope.note;
	$scope.n1Error = false;
	$scope.n1Success = false;
	$scope.n2Error = false;
	$scope.n2Success = false;

	$scope.AdjustCheckedState = function(op)	//Adjust others checkbox checked state when user click one of them.
	{
		$scope.note = "";
		switch(op)
		{
			case 1:
			$scope.op.sub = false;
			$scope.op.mult = false;
			$scope.op.div = false;
				break;
			case 2:
			$scope.op.plus = false;
			$scope.op.mult = false;
			$scope.op.div = false;
				break;
			case 3:
			$scope.op.plus = false;
			$scope.op.sub = false;
			$scope.op.div = false;
				break;
			case 4:
			$scope.op.plus = false;
			$scope.op.sub = false;
			$scope.op.mult = false;
				break;
		}
	}

	$scope.Calculate = function()
	{
		console.log($scope.op.plus);
		if(!CheckOp())
		{
			$scope.note = "Bạn chưa chọn loại phép tính.";
			return;
		}
		if(!CheckEmpty())
		{
			$scope.note = "Bạn phải nhập đủ 2 số.";
			return;
		}
		if($scope.op.plus)
		{
			$scope.result = +$scope.number1 + +$scope.number2;
		}
		if($scope.op.sub)
		{
			$scope.result = +$scope.number1 - +$scope.number2;
		}
		if($scope.op.mult)
		{
			$scope.result = +$scope.number1 * +$scope.number2;
		}
		if($scope.op.div)
		{
			if($scope.number2 == 0)
			{
				$scope.note = "Không thể chia cho 0."
				$scope.result = "Infinity"
				return;
			}
			$scope.result = +$scope.number1 / +$scope.number2;
		}
	}

	function CheckOp()
	{
		if (!$scope.op.plus && !$scope.op.sub && !$scope.op.mult && !$scope.op.div) 
        {
        	console.log($scope.note);
        	return false;
        } 
        return true;
	}

	function CheckEmpty()
	{
		if($scope.number1 == "" || $scope.number2 == "")
		{
			return false;
		}
		return true;
	}

	$scope.CheckNumber = function(number)
	{
		if(number == 1)
		{
			if(isNaN($scope.number1))
			{
				$scope.note = "Số thứ nhất không phải là số thực."
				$scope.n1Error = true;
				$scope.n1Success = false;
			}
			else
			{
				$scope.note = ""
				$scope.n1Error = false;
				$scope.n1Success = true;
			}

			if($scope.number1 == "")
			{
				$scope.n1Error = false;
				$scope.n1Success = false;
			}
		}
		else
		{
			if(isNaN($scope.number2))
			{
				$scope.note = "Số thứ hai không phải là số thực."
				$scope.n2Error = true;
				$scope.n2Success = false;
			}
			else
			{
				$scope.note = ""
				$scope.n2Error = false;
				$scope.n2Success = true;
			}

			if($scope.number2 == "")
			{
				$scope.n2Error = false;
				$scope.n2Success = false;
			}
		}
	}


	//Custom validation
	//Check if user has chose a operator
	// app.directive('check-op', function() 
	// {
	//   	return 
	//   	{
	//     	require: 'validateCtrl',
	//     	link: function(scope, element, attr, mCtrl) 
	//     	{
	// 	    	function myValidation() 
	// 	    	{
	// 		        if (!op.plus && !op.sub && !op.mult && !op.mult) 
	// 		        {
	// 		        	mCtrl.$setValidity('op', false);
	// 		        } 
	// 		        else 
	// 		        {
	// 		        	mCtrl.$setValidity('op', true);
	// 		        	$scope.note = "Bạn chưa chọn loại phép tính";
	// 		        }
	//     		}
	//    			 mCtrl.$parsers.push(myValidation);
	//     	}
	//   	};
	// });
});
