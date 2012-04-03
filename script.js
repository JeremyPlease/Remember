var cookie = new evercookie();
var userData;

//Check if logged into Facebook
function authCheck(){
    FB.getLoginStatus(function(response){
        if(response.status === 'connected'){
            getUserDataFromFB();
        }else{
            getUserDataFromStorage();
        }
    },
    true);
}

//Get current logged in user's Facebook infromation
function getUserDataFromFB(){
    $('#user-info').html('Thanks for connecting with Facebook! Please wait while I get to know you...');
    FB.api('/me',
    	function(response){
	        response['facebook_id'] = response['id'];
	        userData = response;
	        saveUserData(response);
	    }
	);
}

//Prompt user to connect with Facebook
function FBLogin(){
	FB.login(
		function(response){
			if(response.authResponse){
				getUserDataFromFB();
			}else{
				$('#user-info').html("Don't want to connect with Facebook? Let's see if I can remember you. Please wait...");
				getUserDataFromStorage();
			}
		},
		{ scope: 'user_about_me,user_birthday,user_hometown,user_location,user_relationships,user_relationship_details,email' }
	);
    return false;
}

//Save some of the user's Facebook data to the evercookie
function saveUserData(userData){
    var dataToSave = new Object;
    dataToSave.name = userData.name;
    dataToSave.id = userData.id;
    dataToSave.email = userData.email;
    dataToSave.birthday = userData.birthday;
    dataToSave.hometown = userData.hometown;
    dataToSave.location = userData.location;
    dataToSave.gender = userData.gender;
    dataToSave.relationship_status = userData.relationship_status;
    cookie.set('data', JSON.stringify(dataToSave));
    getUserDataFromStorage();
}

//Attempt to get user's information from current javascript variable or evercookie
function getUserDataFromStorage(){
    $('#user-info').html("Hm... Let's see if I can remember anything about you...");
    if(userData !== null && userData !== undefined){
        $('#user-info').append(outputData('Your info', userData));
    }else{
        $('#user-info').append("<br />Let's see...")
        cookie.get("data",
        	function(data){
				try{
					var data = JSON.parse(data.replace(/\\/g, ""));
				}catch(err){
					iDontRemember();
				}
				if(typeof data != 'object' || data.size == 0){
					iDontRemember();
				}else{
					$('#user-info').append(outputData('Your info', data));
				}
			}
		);
	}
}

//Called if nothing can be found about the current user
function iDontRemember(){
    $('#user-info').html("Sorry, it looks like I don't remember you! Please <a href='javascript:FBLogin()' id='login-button'>connect to Facebook</a> so I can learn more about you.");
}

function outputData(key, value){
	if((typeof value) !== 'object'){
		return '<li>' + key + ': ' + value + '</li>';
	}else{
		info = '';
		$.each(value,
			function(key2, value2){
				info += outputData(key2, value2);
			}
		);
		return '<li>' + key + ': </li><ul>' + info + '</ul>';
	}
}

// Initialize connection to facebook
window.fbAsyncInit = function(){
    FB.init({
        appId: '328966320489801',
        status: true,
        cookie: true,
        xfbml: true,
        oauth: false,
    });
    authCheck();
};

//Function to connect to Facebook Graph API
 (function(d, s, id){
    var js,
    fjs = d.getElementsByTagName(s)[0];
    if(d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=APP_ID";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')
);