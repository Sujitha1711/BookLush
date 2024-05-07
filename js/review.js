// // Function to get reviews by booksId
// function getReview(booksId) {
//     var request = new XMLHttpRequest();

//     request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/review/" + booksId, true);

//     request.onload = function () {
//         var response = JSON.parse(request.responseText);
//         console.log(response);

//         var html = "";
//         var max = response.Items.length;

//         for (var i = 0; i < max; i++) {
//             var reviewData = response.Items[i];
//             html += '<div class="col-md-3 box">' +
//                 '<h3>' + reviewData.review + '</h3>' +
//                 '<p>' + reviewData.rating + '</p>' +
//                 '<p>' + reviewData.date + '</p>' +
//                 '<p>' + reviewData.username + '</p>' +
//                 '</div>';
//         }

//         document.getElementById("Reviewlist").innerHTML = html;
//     };

//     request.send();
// }

function getReview(booksId) {
  var request = new XMLHttpRequest();

  request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/review/" + booksId, true);

  request.onload = function () {
    var response = JSON.parse(request.responseText);
    console.log(response);

    var html = "";
    var max = response.Items ? response.Items.length : 0; // Check if response.Items exists
    var loggedInUsername = sessionStorage.getItem("username");

    var userHasReview = false;
    for (var i = 0; i < max; i++) {
      var reviewData = response.Items[i];
      var reviewUsername = reviewData.username;

      if (loggedInUsername === reviewUsername) {
        userHasReview = true;
        break;
      }
    }

    var addReviewButton = document.getElementById("addReviewButton");
    if (userHasReview) {
      addReviewButton.disabled = true;
    } else {
      addReviewButton.disabled = false;
    }

    // If there are no reviews yet, display a message
    if (max === 0) {
      html = "<p>No reviews yet.</p>";
    } else {
      for (var i = 0; i < max; i++) {
        var reviewData = response.Items[i];
        var reviewUsername = reviewData.username;
        var editButtonHtml = "";
        var deleteButtonHtml = "";

        // Check if the review username matches the logged-in username
        if (loggedInUsername === reviewUsername) {
          // Add the edit button HTML here
          editButtonHtml = '<button class="btn button" onclick="fillReview(\'' + booksId + '\', \'' + reviewUsername + '\', \'' + reviewData.review + '\', \'' + reviewData.rating + '\', \'' + reviewData.reviewId + '\')">Edit</button>';
          deleteButtonHtml = '<button class="btn btndelete" onclick="deleteReview(\'' + booksId + '\', \'' + reviewUsername + '\')" data-toggle="modal" data-target="#deleteConfirmationReview">Delete</button>';
        }

        html += '<div class="edu-comment">' +
          '<div class="comment-content">' +
          '<div class="comment-top">' +
          '<h6 class="title">' + reviewUsername + '</h6>' +
          '<div class="rating">';
        // Generate rating stars dynamically based on the reviewData.rating
        var ratingValue = parseInt(reviewData.rating);
        for (var j = 0; j < ratingValue; j++) {
          html += '<i class="fa fa-star" aria-hidden="true"></i>';
        }
        html += '</div>' +
          '</div>' +
          '<span class="subtitle">“' + reviewData.review + '”</span>' +
          '<p>' + reviewData.date + '</p>' +
          '<div class="button-container">' +
          editButtonHtml + 
          '<span class="button-spacing"></span>' + 
          deleteButtonHtml + 
          '</div>' +
          '</div>';
      }
    }

    document.getElementById("Reviewlist").innerHTML = html;
  };

  request.send();
}

var rating = 0;

function rateIt(element) {
  var num = element.getAttribute("value");
  var classname = element.getAttribute("class");
  var stars = document.getElementsByClassName(classname);
  var classTarget = "." + classname;
  rating = parseInt(num);
  console.log("Selected rating:", rating); // Add this line to log the selected rating
  changeStarImage(rating, classTarget);
}

function changeStarImage(num, classTarget) {
  const starImage = "images/stars.png";
  const starsBWImage = "images/stars_bw.png";

  console.log("Selected rating:", num);
  console.log("starImage:", starImage);
  console.log("starsBWImage:", starsBWImage);

  for (let i = 1; i <= 5; i++) {
    const star = document.querySelector(classTarget + "[value='" + i + "']");
    if (i <= num) {
      star.setAttribute("src", starImage + "?v=" + Date.now());
    } else {
      star.setAttribute("src", starsBWImage + "?v=" + Date.now());
    }
  }
}



function hoverStar(element) {
  console.log("Hovering over star:", element.getAttribute("value")); // Log the value of the hovered star
  var num = element.getAttribute("value");
  var classname = element.getAttribute("class");
  var stars = document.getElementsByClassName(classname);
  var classTarget = "." + classname;

  // Change the star images up to the hovered star
  for (let i = 1; i <= num; i++) {
    const star = document.querySelector(classTarget + "[value='" + i + "']");
    star.setAttribute("src", "images/stars.png");
  }

  // Reset star images after the hovered star
  for (let i = parseInt(num) + 1; i <= 5; i++) {
    const star = document.querySelector(classTarget + "[value='" + i + "']");
    star.setAttribute("src", "images/stars_bw.png");
  }
}






function addReview(booksId) {
  if (sessionStorage.getItem("username") == null) {
    alert('You need to be a registered user to add a review!');
    $('#loginForm').modal('show');
  } else {
    // The user is logged in, proceed with showing the Add Review modal
    $('#AddReview').modal('show');
    var username = sessionStorage.getItem("username");
    console.log("username:", username);

    document.getElementById("postReviewButton").addEventListener("click", function () {
      // Get the review content from the form modal
      var reviewContent = document.getElementById("review").value;

      // Construct the jsonData object with user input
      var jsonData = {
        username: username,
        review: reviewContent,
        rating: rating,
        date: new Date().toISOString(),
      };

      var request = new XMLHttpRequest();

      request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/review/" + booksId, true);

      request.onload = function () {
        var response = JSON.parse(request.responseText);
        if (response.message == "Review has been added") {
          alert('Review added successfully.');
          $('#AddReview').modal('hide');
        } else {
          alert('Error. Unable to add the review.');
        }
        // Refresh the reviews after adding a new one
        getReview(booksId);
      };

      request.send(JSON.stringify(jsonData));
    });
  }
}





function openEditModal(booksId, reviewUsername, reviewText, rating, reviewId) {
  // Populate the fields in the edit modal with the existing review data
  document.getElementById("edit-review-username").innerText = reviewUsername;
  document.getElementById("edit-review").value = reviewText;
  document.getElementById("edit-rating").value = rating;

  // Add event listener to the "Save Changes" button in the edit modal
  document.getElementById("saveChangesButton").addEventListener("click", function () {
    // Call the editReview function with the updated review data
    editReview(booksId, reviewUsername, reviewId);
    // Close the edit modal after saving changes
    $('#editReview').modal('hide');
  });

  // Show the edit modal
  $('#editReview').modal('show');
}

// Function to close the edit modal
function closeEditModal() {
  $('#editReview').modal('hide');
}

function setEditRating(rating) {
  // Update the hidden input field for the rating
  document.getElementById("edit-rating").value = rating;

  // Display the stars based on the selected rating
  const stars = document.querySelectorAll("#editReview .star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}


function editReview(booksId, username, reviewId) {
  var response = "";
  const reviewText = document.getElementById("edit-review").value;
  const rating = document.getElementById("edit-rating").value;

  var jsonData = new Object();
  var loggedInUsername = sessionStorage.getItem("username");

  // Check if the logged-in username matches the review's username
  if (loggedInUsername !== username) {
    alert('You are not authorized to edit this review.');
    return;
  }

  jsonData.review = document.getElementById("edit-review").value;
  jsonData.rating = parseInt(document.getElementById("edit-rating").value);
  jsonData.date = new Date().toISOString();

  if (jsonData.review == "" || isNaN(jsonData.rating)) {
    alert('All fields are required!');
    return;
  }

  var request = new XMLHttpRequest();

  // Use the appropriate URL format
  request.open("PUT", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/review/" + booksId + "/" + username, true);

  request.onload = function () {
    response = JSON.parse(request.responseText);
    if (response.message == "review edited") {
      alert('Review edited successfully.');
      // Refresh the reviews after editing the review
      getReview(booksId);
      // Clear the modal content and close the modal
      document.getElementById("edit-review").value = "";
      document.getElementById("edit-rating").value = "";
      closeEditModal();
    } else {
      alert('Error. Unable to edit review.');
    }
  };

  request.send(JSON.stringify(jsonData));
}


function deleteReview(booksId, username) {
  // Show the delete confirmation modal
  $('#deleteConfirmationReview').modal('show');

  // Add a click event listener to the "Delete" button in the modal
  document.getElementById("confirmDeleteButtonReview").addEventListener("click", function () {
    var response = "";
    var request = new XMLHttpRequest();

    request.open("DELETE", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/review/" + booksId + "/" + username, true);

    request.onload = function () {
      response = JSON.parse(request.responseText);

      if (response.message == "successfully deleted review") {
        alert('Review deleted successfully.');
        location.reload();
      } else {
        alert('Error. Unable to delete review.');
      }
    };

    request.send();
  });
}




