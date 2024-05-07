function toggleRole() {
	var currLabel = document.getElementById("loginLabelID").innerHTML;
	if (currLabel === "Username") {
		document.getElementById("loginLabelID").innerHTML = "Store Email";
	} else {
		document.getElementById("loginLabelID").innerHTML = "Username";
	}
}

function setNavBar() {
	if (sessionStorage.getItem("username") == null && sessionStorage.getItem("email") == null) {
		document.getElementById("navUser").innerHTML = '<a class="nav-link" href="#" data-toggle="modal" data-target="#loginForm">Login/Signup</a>';
	} else if (sessionStorage.getItem("username") != null) {
		document.getElementById("navUser").innerHTML = '<a class="nav-editlink" href="Saved.html">Saved</a>' +
			' <span class="nav-link-spacing"></span> ' + '<a class="nav-editlink" href="profile.html">Profile</a>' + ' <span class="nav-link-spacing"></span> ' +
			'<a class="nav-logoutlink" href="#" data-toggle="modal" data-target="#logoutConfirm">Logout</a>'; // Call the modal when clicking "Logout"
	} else if (sessionStorage.getItem("email") != null) {
		document.getElementById("navUser").innerHTML = '<div class="row align-items-center">' +
			'<a class="nav-link" href="Store.html"> Store Profile</a>' +
			'<span class="nav-link-spacing"></span>' +
			'<a class="nav-logoutlink" href="#" data-toggle="modal" data-target="#logoutConfirm">Logout</a>' + // Call the modal when clicking "Logout"
			'</div>';
	}
}

// Function to show the Logout Confirmation modal and perform logout
function logout() {
	$('#logoutConfirm').modal('show');
}

// When the user clicks "Logout" in the modal, this function will be called
function performLogout() {
	// Clear the session storage
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("user");
	sessionStorage.removeItem("email");
	sessionStorage.removeItem("store");

	// Redirect to the index.html page or your desired landing page
	window.location = "index.html";
}

function fillProfile() {
	if (sessionStorage.getItem("username") != null) {
		var jsonData = JSON.parse(sessionStorage.getItem("user"));
		document.getElementById("Username").value = jsonData.username;
		document.getElementById("name").value = jsonData.name;
		document.getElementById("email").value = jsonData.email;
		document.getElementById("contactno").value = jsonData.contactno;
		document.getElementById("password").value = jsonData.password;

		var profilePicPreview = document.getElementById("currentProfilePic");
		if (jsonData.profilepic) {
			if (jsonData.profilepic.startsWith("data:image/jpeg;base64,") || jsonData.profilepic.startsWith("data:image/png;base64,")) {
				// If the image is already a data URI, use it as is
				profilePicPreview.setAttribute("src", jsonData.profilepic);
			} 
		} else {
			// If profile picture is not provided or empty, use the default profile picture
			profilePicPreview.setAttribute("src", "/images/guest2.jpg");
		}
	}
}


function login() {
	if (document.getElementById("loginLabelID").innerHTML == "Username") {
		user_login();
	}
	else {
		store_login();
	}
}

// function fillBook(booksId, quantity, price, location, location2, location3) {
//     document.getElementById("edit-quantity").value = quantity;
//     document.getElementById("edit-price").value = price;
//     document.getElementById("edit-location").value = location;
//     document.getElementById("edit-location2").value = location2;
//     document.getElementById("edit-location3").value = location3;
//     document.getElementById("editbookButton").setAttribute("onclick", 'Editbook(' + booksId + ')');
//     $('#editbook').modal('show');
// }
function fillBook(booksId, quantity, price, location, location2, location3) {
    console.log("Location:", location);
    console.log("Location2:", location2);
    console.log("Location3:", location3);

    document.getElementById("edit-quantity").value = quantity;
    document.getElementById("edit-price").value = price;

    var locationDropdown1 = document.getElementById("edit-location");
    selectDropdownOption(locationDropdown1, location);

    // Set the value for Location 2 dropdown
    var locationDropdown2 = document.getElementById("edit-location2");
    selectDropdownOption(locationDropdown2, location2);

    // Set the value for Location 3 dropdown
    var locationDropdown3 = document.getElementById("edit-location3");
    selectDropdownOption(locationDropdown3, location3);

    // Set the onclick event for the Save Changes button
    document.getElementById("editbookButton").setAttribute("onclick", 'Editbook("' + booksId + '")');

    // Show the modal
    $('#editbook').modal('show');
}

function selectDropdownOption(dropdown, value) {
    for (var i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].value === value) {
            dropdown.selectedIndex = i;
            break;
        }
    }
}
// function fillReview(booksId, username, review, rating, reviewId) {
//     document.getElementById("edit-review").value = review;
//     document.getElementById("edit-rating").value = rating;

//     // Add the 'editReview' function call with appropriate arguments
//     document.getElementById("editReviewButton").setAttribute("onclick", 'editReview("' + booksId + '", "' + username + '", "' + reviewId + '")');

//     // Show the modal after populating the fields
//     $('#editReview').modal('show');
// }
function fillReview(booksId, username, review, rating, reviewId) {
	document.getElementById("edit-review").value = review;

	// Set the selected rating value to the hidden input field
	document.getElementById("edit-rating").value = rating;

	// Display the stars based on the rating
	const stars = document.querySelectorAll("#editReview .star");
	stars.forEach((star, index) => {
		if (index < rating) {
			star.classList.add("active");
		} else {
			star.classList.remove("active");
		}
	});

	// Add the 'editReview' function call with appropriate arguments
	document.getElementById("editReviewButton").setAttribute("onclick", 'editReview("' + booksId + '", "' + username + '", "' + reviewId + '")');

	// Show the modal after populating the fields
	$('#editReview').modal('show');
}


// function fillPrice(booksId) {
// 	// Make an AJAX call to fetch the book's price based on the booksId
// 	// Replace the URL below with the actual endpoint to get the book price
  
// 	// Make the AJAX call
// 	var request = new XMLHttpRequest();
// 	request.open("GET", + "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/" + "/price", true);
  
// 	request.onload = function () {
// 	  if (request.status === 200) {
// 		var bookData = JSON.parse(request.responseText);
// 		var price = bookData.price; // Assuming the API response returns the price
// 		document.getElementById("order.price").value = price;
// 	  } else {
// 		console.error("Error fetching book price");
// 	  }
// 	};
  
// 	request.onerror = function () {
// 	  console.error("Error fetching book price");
// 	};
  
// 	request.send();
//   }
  



