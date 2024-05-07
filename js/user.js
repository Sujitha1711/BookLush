function register() {
    var response = "";

    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.email = document.getElementById("email").value;
    jsonData.username = document.getElementById("username").value;
    jsonData.contactno = document.getElementById("contactno").value;
    jsonData.password = document.getElementById("password").value;

    if (jsonData.name == "" || jsonData.email == "" || jsonData.username == "" ||
        jsonData.contactno == "" || jsonData.password == "") {
        alert('All fields are required!'); return;
    }

    if (jsonData.password != document.getElementById("confirm-password").value) {
        alert('Password and confirm password must be the same!'); return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/user-register", true);

    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "User added and subscribed to topic") {
            alert('Email for subscription has been send please confirm it in 3 mins so that you can view pre-order details.');
            $('#registerForm').modal('hide');
            $('#loginForm').modal('show');
            document.getElementById("loginID").value = document.getElementById("username").value
        }
        else {
            alert('Error. Unable to register user.');
        }
    };
    request.send(JSON.stringify(jsonData));
}

function user_login() {
    var response = "";

    var jsonData = new Object();
    jsonData.username = document.getElementById("loginID").value;
    jsonData.password = document.getElementById("loginPassword").value;

    if (jsonData.username == "" || jsonData.password == "") {
        alert('All fields are required!');
        return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/user-login", true);

    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.Count == 1 || response.length == 1) {
            if (response.Count == 1) {
                sessionStorage.setItem("username", jsonData.username);
                sessionStorage.setItem("user", JSON.stringify(response.Items[0]));
                console.log(sessionStorage.getItem("username"));
                console.log('Response:', response);
            }

            $('#loginForm').modal('hide');

            setNavBar();

            console.log('successful login');

        }
        else {
            alert('Error. Wrong password or username.');
        }
    };

    request.send(JSON.stringify(jsonData));
}
// document.addEventListener("DOMContentLoaded", function () {
//     function clearForm() {
//       var form = document.getElementById("register");
//       if (form) {
//         form.reset();
//       }
//     }
// });

// Function to handle image display
function ShowImage() {
    const profilepic = event.target;
    if (profilepic && profilepic.id === "profilePicInput") {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const display_profilepic = document.getElementById("importedProfilePic");
            display_profilepic.setAttribute("src", reader.result);
        });
        const file = profilepic.files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

// DOMContentLoaded ensures that the code executes only when the HTML document has finished loading
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("change", ShowImage);
});

// function updateProfile() {
//     var jsonData = new Object();
//     jsonData.username = sessionStorage.getItem("username");
//     jsonData.email = document.getElementById("email").value;
//     jsonData.contactno = document.getElementById("contactno").value;
//     jsonData.name = document.getElementById("name").value;
//     jsonData.password = document.getElementById("password").value;

//     // Handle the new profile picture
//     const profilepic = document.getElementById("profilePicInput");
//     const file = profilepic.files[0];
//     if (jsonData.contactno === "" || jsonData.password === "") {
//         alert("All fields are required!");
//         return;
//     }
//      // Check if the selected file is an image
//      if (!file.type.startsWith("image/")) {
//         alert("Please select a valid image file.");
//         return;
//     }
//     // Create FileReader object to read the selected image
//     const reader = new FileReader();
//     reader.addEventListener("load", () => {
//         // Convert the uploaded image to base64 and include it in the JSON data
//         jsonData.profilepic = reader.result;

//         var request = new XMLHttpRequest();
//         request.open("PUT", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/user-profile/" + jsonData.username, true);
//         request.onload = function () {
//             var response = JSON.parse(request.responseText);
//             alert("User edited successfully");

//             var user = JSON.parse(sessionStorage.getItem("user"));
//             user.email = jsonData.email;
//             user.contactno = jsonData.contactno;
//             user.name = jsonData.name;
//             user.password = jsonData.password;
//             user.profilepic = jsonData.profilepic;

//             sessionStorage.setItem("user", JSON.stringify(user));
//             $("#editProfileModal").modal("hide");
//             location.reload();
//         };

//         request.send(JSON.stringify(jsonData));
//     });
//     // Handle FileReader error event
//     reader.onerror = function () {
//         alert("Error reading the image file. Please try again.");
//     };

//     // Read the image file as a data URL
//     reader.readAsDataURL(file);
// }

function updateProfile() {
    var jsonData = new Object();
    jsonData.username = sessionStorage.getItem("username");
    jsonData.email = document.getElementById("email").value;
    jsonData.contactno = document.getElementById("contactno").value;
    jsonData.name = document.getElementById("name").value;
    jsonData.password = document.getElementById("password").value;
  
    // Check if the required fields are filled
    if (jsonData.contactno === "" || jsonData.password === "") {
      alert("All fields are required!");
      return;
    }
  
    // Handle the new profile picture (if selected)
    const profilepic = document.getElementById("profilePicInput");
    if (profilepic.files.length > 0) {
      const file = profilepic.files[0];
      // Check if the selected file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
  
      // Create FileReader object to read the selected image
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        // Convert the uploaded image to base64 and include it in the JSON data
        jsonData.profilepic = reader.result;
        updateUserProfile(jsonData); // Call the function to update the profile
      });
  
      // Handle FileReader error event
      reader.onerror = function () {
        alert("Error reading the image file. Please try again.");
      };
  
      // Read the image file as a data URL
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, update the profile without the profilepic
      updateUserProfile(jsonData);
    }
  }
  
  function updateUserProfile(jsonData) {
    var request = new XMLHttpRequest();
    request.open(
      "PUT",
      "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/user-profile/" +
        jsonData.username,
      true
    );
    request.onload = function () {
      var response = JSON.parse(request.responseText);
      alert("User edited successfully");
  
      var user = JSON.parse(sessionStorage.getItem("user"));
      user.email = jsonData.email;
      user.contactno = jsonData.contactno;
      user.name = jsonData.name;
      user.password = jsonData.password;
  
      if (jsonData.profilepic) {
        user.profilepic = jsonData.profilepic;
      }
  
      sessionStorage.setItem("user", JSON.stringify(user));
      $("#editProfileModal").modal("hide");
      location.reload();
    };
  
    request.send(JSON.stringify(jsonData));
  }


function clearForm() {
    // Get the form element by its ID
    var form = document.getElementById("myForm");

    // Reset the form to clear the input fields
    form.reset();

    // Reset the profile picture
    var profilePicInput = document.getElementById("profilePicInput");
    profilePicInput.value = ""; // This will clear the selected file from the input field
    document.getElementById("currentProfilePic").src = ""; // This will clear the current profile picture
    document.getElementById("importedProfilePic").src = ""; // This will clear the imported profile picture
    fillProfile();
}

function GetUser() {
    var request = new XMLHttpRequest();
    var username = sessionStorage.getItem("username");

    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/user/" + username, true);

    request.onload = function () {
        try {
            var response = JSON.parse(request.responseText);
            var user = response.Items[0]; // Get the first user object from the 'Items' array

            // Check if the user object is not null and contains the required properties
            if (user && user.username && user.email && user.name && user.contactno && user.password) {
                var profile = "/images/guest2.jpg"; // Default profile picture URL

                if (user.profilepic && (user.profilepic.startsWith("data:image/jpeg;base64,") || user.profilepic.startsWith("data:image/png;base64,"))) {
                    profile = user.profilepic;
                }

                var html = '<div class="profile-info-container">' +
                    '<div class="profile-pic-container text-center">' +
                    '<div class="profile-pic-circle">' +
                    '<img class="profile-pic" src="' + profile + '" alt="' + user.username + '">' +
                    '</div>' +
                    '<div class="username-box">' +
                    '<p class="username">' + user.username + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="user-details">' +
                    '<div class="info-box">' +
                    '<label>Email</label>' +
                    '<p class="card-text">' + user.email + '</p>' +
                    '</div>' +
                    '<div class="info-box">' +
                    '<label>Name</label>' +
                    '<p class="card-text">' + user.name + '</p>' +
                    '</div>' +
                    '<div class="info-box">' +
                    '<label>Contact No.</label>' +
                    '<p class="card-text">' + user.contactno + '</p>' +
                    '</div>' +
                    '<div class="info-box">' +
                    '<label>Password</label>' +
                    '<p class="card-text">' + user.password + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                document.getElementById("UserProfile").innerHTML = html;
                // fillProfile();
            } else {
                console.error("Invalid user data format. Missing properties.");
            }
        } catch (error) {
            console.error("Error parsing API response:", error);
        }
    };

    request.onerror = function () {
        console.error("Error making the API request.");
        // Handle the error or display a message to the user
    };

    request.onabort = function () {
        console.error("Request aborted.");
        // Handle the error or display a message to the user
    };

    request.send();
}



function togglePasswordVisibility() {
    const passwordField = document.getElementById('loginPassword');
    const eyeIcon = document.querySelector('.fa-eye');

    if (passwordField.getAttribute('type') === 'password') {
        passwordField.setAttribute('type', 'text');
        // eyeIcon.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
        passwordField.setAttribute('type', 'password');
        // eyeIcon.innerHTML = '<i class="fa fa-eye"></i>';
    }
}

// function resetForm() {
//     document.getElementById("editProfileForm").reset();
//   }