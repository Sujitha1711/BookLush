// // Function to add a book to favorites
// function addToFavorites(element, booksId) {
//     if (sessionStorage.getItem("username") == null) {
//         alert('You need to be a registered user to like a book!');
//         $('#loginForm').modal('show');
//     } else {
//         var user = JSON.parse(sessionStorage.getItem("user"));
//         console.log(user);

//         var jsonData = {
//             username: user.username,
//             booksId: booksId
//         };

//         var request = new XMLHttpRequest();

//         request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/favourite", true);

//         request.onload = function () {
//             var response = JSON.parse(request.responseText);
//             console.log(response.message);
//             if (response.message === "book has been added") {
//                 // Update the heart icon classes to reflect the selected state
//                 // var iconElement = document.querySelector("[data-books-id='" + booksId + "']");
//                 element.querySelector("i").classList.remove("fa-light");
//                 element.querySelector("i").classList.add("fa-solid");
//                 element.querySelector("i").style.color = "#d33c52"; // Change the color to the selected color
//                 alert('Book has been saved.');
//             } else {
//                 alert('Error. Unable to add book to favorites. Please try again.');
//             }
//         };

//         request.onerror = function () {
//             alert('Error. Unable to add book to favorites. Please try again.');
//         };

//         request.send(JSON.stringify(jsonData));
//     }
// }
function addToFavorites(element, booksId) {
    if (sessionStorage.getItem("username") == null) {
        alert('You need to be a registered user to like a book!');
        $('#loginForm').modal('show');
    } else {
        var user = JSON.parse(sessionStorage.getItem("user"));
        console.log(user);

        var jsonData = {
            username: user.username,
            booksId: booksId
        };

        var request = new XMLHttpRequest();

        request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/favourite", true);

        request.onload = function () {
            var response = JSON.parse(request.responseText);
            console.log(response.message);
            if (response.message === "book has been added") {
                // Update the heart icon classes to reflect the selected state
                // element.querySelector("i").classList.remove("fa-light");
                element.querySelector("i").classList.add("fa-solid");
                // element.querySelector("i").style.color = "#d33c52"; // Change the color to the selected color
                alert('Book has been saved.');

                // // Save the book as a favorite in Local Storage
                // saveBookAsFavorite(booksId);
            } else if (response.message === " already been added") {
                alert('You have this book in your Saved!');
            }
        };

        request.onerror = function () {
            alert('Error. Unable to add book to favorites. Please try again.');
        };

        request.send(JSON.stringify(jsonData));
    }
}

// // Function to save a book as a favorite in Local Storage
// function saveBookAsFavorite(booksId) {
//     var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
//     if (!favorites.includes(booksId)) {
//         favorites.push(booksId);
//         localStorage.setItem("favorites", JSON.stringify(favorites));
//     }
// }
function displayUserFavorites() {
    // Check if the user is logged in
    if (sessionStorage.getItem("username")) {
        // Call the function to fetch favorite books for the logged-in user
        getFavBooks();
    } else {
        console.log("User not logged in.");
        // Handle the case where the user is not logged in.
    }
}
function getFavBooks() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/favourite/" + sessionStorage.getItem("username"), true);

    request.onload = function () {
        var response = JSON.parse(request.responseText);
        console.log(response);

        if (response.Items.length > 0) {
            var booksIds = response.Items.map(item => item.booksId);
            // Fetch book details for the list of booksIds using the "books" API
            fetchBookDetails(booksIds);
            // var booksIds = response.Items.map(item => item.booksId);
            // // Fetch book details for the list of booksIds using the "books" API
            // fetchBookDetails(booksIds);
        } else {
            console.log("No saved books found.");
            // Handle the case where there are no favorite books
            var noSavedBooksMessage = document.getElementById("noSavedBooksMessage");
            // Check if the element exists before trying to access its style property
            if (noSavedBooksMessage) {
                noSavedBooksMessage.style.display = "block";
            }
        }
    };

    request.onerror = function () {
        console.log("Error. Unable to fetch saved books.");
    };

    request.send();
}

// Function to fetch book details based on booksIds
function fetchBookDetails(booksIds) {
    var request = new XMLHttpRequest();
    // var url = "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books";

    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);
    request.onload = function () {
        if (request.status === 200) {
            var response = JSON.parse(request.responseText);
            console.log(response);

            // Filter the response based on the booksIds in the favorite list
            var favoriteBooks = response.filter(book => booksIds.includes(book.booksId));
            console.log("Favorite Books:", favoriteBooks);

            var html = "";
            for (var i = 0; i < favoriteBooks.length; i++) {
                var book = favoriteBooks[i];
                // Get the image data URI prefix (e.g., "data:image/jpeg;base64," or "data:image/png;base64,")
                // Determine the type of image and set the appropriate image source
                var imageSrc;
                if (book.image.startsWith("data:image/jpeg;base64,") || book.image.startsWith("data:image/png;base64,")) {
                    // If the image is already a data URI, use it as is
                    imageSrc = book.image;
                } else if (book.image.startsWith("/images/")) {
                    // If it starts with "/images/", assume it's a relative path to the image folder
                    imageSrc = book.image;
                } else {
                    // If it's a regular image URL, construct the full URL to the image folder
                    imageSrc = "/images/" + book.image;
                }

                // Create the HTML for each book card
                var bookCard = '<div class="col-md-4 mb-4">' +
                    '<div class="card">' +
                    '<img class="card-img-top" src="' + imageSrc + '" alt="' + book.title + '">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title">' + book.title + '</h5>' +
                    '<p class="card-text">' + book.author + '</p>' +
                    '<p class="card-text">$' + book.price + '</p>' +
                    '<div>' +
                    '<div class="card-footer d-flex justify-content-between align-items-center">' +
                    '<a href="details.html?booksId=' + book.booksId + '" class="view-more" style="color: #333232;">View more</a>' +
                    '<a href="#" onclick="addToFavorites(this, ' + book.booksId + ')" class="favorite-icon" data-books-id="' + book.booksId + '"><i class="fas fa-solid fa-bookmark style="color: #d33c52;""></i></a>' +
                    '<a href="#" onclick="deleteFavorites(' + book.booksId + ')" + " title="Remove Saved Book"><i class="fas fa-xmark" style="color:#000000;"></i></a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                // Append the book card to the booklist container
                html += bookCard;
            }

            document.getElementById("favoriteBooks").innerHTML = html;
        } else {
            console.log("Error. Unable to fetch book details.");
        }
    };

    request.onerror = function () {
        console.log("Error. Unable to fetch book details.");
    };

    request.send();
}


// Function to remove a book from favorites
function deleteFavorites(booksId) {
    $('#deleteFavorites').modal('hide');
    var user = JSON.parse(sessionStorage.getItem("user"));
    var request = new XMLHttpRequest();
    request.open("DELETE", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/favourite/" + booksId + "/" + user.username, true);

    request.onload = function () {
        var response = JSON.parse(request.responseText);
        console.log(response);
        if (response.message === " removed from favourite") {
            console.log(response);
            // Update the heart icon classes to reflect the default state
            alert('Book removed from favorites.');
            removeFavlocStorage(booksId);
            getFavBooks();
            location.reload();
        } else {
            alert('Error. Unable to remove book from favorites. Please try again.');
        }
    };

    request.onerror = function () {
        alert('Error. Unable to remove book from favorites. Please try again.');
    };

    request.send();
}

// Function to remove a book's booksId from favorites in Local Storage
function removeFavlocStorage(booksId) {
    var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(booksId)) {
        favorites = favorites.filter(item => item !== booksId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}