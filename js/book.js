// Function to get books and display them in a grid
function getBooks(num) {
  // Show the loader while books are being fetched
  document.getElementById("loader").style.display = "block";

  var request = new XMLHttpRequest();

  request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

  request.onload = function () {
    // Hide the loader and show the book container once the books are fetched
    document.getElementById("loader").style.display = "none";
    document.getElementById("booklist").style.display = "flex"; // You can use "flex" or "grid" as per your layout preference

    var response = JSON.parse(request.responseText);
    console.log(response); // Log the books array to the console

    var html = "";

    var max = num;
    if (response.length < max) max = response.length;

    for (var i = 0; i < max; i++) {
      var book = response[i]; // Get the current book

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
      // Check if the book is in the user's favorite list
      var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      var isFavorite = favorites.includes(book.booksId);
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
        '<a href="#" onclick="addToFavorites(this, ' + book.booksId + ')" class="favorite-icon" data-books-id="' + book.booksId + '" title="Save Book"><i class="fas fa-bookmark' + (isFavorite ? ' fa-solid' : ' fa-solid') + '" style="color: ' + (isFavorite ? '#d33c52' : '#000000') + ';"></i></a>' +
        // '<a href="#" onclick="deleteFavorites(' + book.booksId + ')" + " title="Remove Saved Book"><i class="fas fa-xmark" style="color:#000000;"></i></a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

      // Append the book card to the booklist container
      html += bookCard;
    }

    document.getElementById("booklist").innerHTML = html;
  };

  request.send();
}




function getSelectedBook(booksId) {
  getSuggestedBooks(3, booksId); // Pass the booksId argument here
  var request = new XMLHttpRequest();

  request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books/" + booksId, true);

  request.onload = function () {
    var response = JSON.parse(request.responseText);
    console.log(response);

    if (response.length > 0) {
      var book = response[0];
      document.getElementById("book-title").innerHTML = book.title;

      // Check if the image is base64 encoded
      if (book.image.startsWith("data:image/jpeg;base64,") || book.image.startsWith("data:image/png;base64,")) {
        // If the image is already a data URI, use it as is
        document.getElementById("book-image").setAttribute("src", book.image);
      } else {
        // If the image is not a data URI, assume it's a regular image URL
        // Check if the image URL starts with "/images/"
        if (book.image.startsWith("/images/")) {
          // If it does, use the relative path to the image folder
          document.getElementById("book-image").setAttribute("src", book.image);
        } else {
          // If it doesn't, construct the full URL to the image folder
          document.getElementById("book-image").setAttribute("src", "/images/" + book.image);
        }

      }
      var combinedLocations = book.location + ", " + book.location2 + ", " + book.location3;
      document.getElementById("book-author").innerHTML = book.author;
      document.getElementById("book-description").innerHTML = book.description;
      document.getElementById("book-category").innerHTML = book.category;
      document.getElementById("book-price").innerHTML = "$" + book.price;
      document.getElementById("book-quantity").innerHTML = book.quantity;
      document.getElementById("locations-row").textContent = combinedLocations;
      document.getElementById("book-published_date").innerHTML = book.published_date;

      // Call the getReview function with the book ID
      getReview(booksId);
      getSuggestedBooks(3);
    } else {
      console.log("Book not found.");
      // Handle the case where the book with the given ID is not found
    }
  };
  request.send();
}



function filterBooksByPrice() {
  // Uncheck the "Filter By Latest" radio buttons
  var newRadio = document.getElementById("newRadio");
  var oldRadio = document.getElementById("oldRadio");
  newRadio.checked = false;
  oldRadio.checked = false;

  // // // Uncheck the "Filter By Category" radio buttons
  // var AllRadio = document.getElementById("AllRadio");
  // var ChildrenRadio = document.getElementById("ChildrenRadio");
  // var ComicsRadio = document.getElementById("ComicsRadio");
  // var RomanceRadio = document.getElementById("RomanceRadio");
  // var ScienceRadio = document.getElementById("ScienceRadio");
  // var FictionRadio = document.getElementById("FictionRadio");
  // var PoetryRadio = document.getElementById("PoetryRadio");
  // var OtherRadio = document.getElementById("OtherRadio");
  // AllRadio.checked = false;
  // ChildrenRadio.checked = false;
  // ComicsRadio.checked = false;
  // RomanceRadio.checked = false;
  // ScienceRadio.checked = false;
  // FictionRadio.checked = false;
  // PoetryRadio.checked = false;
  // OtherRadio.checked = false;

  // otherRadio.checked = false;
  var highestPriceRadio = document.getElementById("highestPriceRadio");
  var lowestPriceRadio = document.getElementById("lowestPriceRadio");

  if (highestPriceRadio.checked && lowestPriceRadio.checked) {
    // Both checkboxes are checked, do nothing or display an error message
    return;
  }

  var endpoint = "";

  if (highestPriceRadio.checked) {
    endpoint = "highest";
  } else if (lowestPriceRadio.checked) {
    endpoint = "lowest";
  } else {
    // No checkbox is checked, display all books
    getBooks(40);
    return;
  }

  var request = new XMLHttpRequest();

  request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books_price/" + endpoint, true);

  request.onload = function () {
    if (request.status === 200) {
      var response = JSON.parse(request.responseText);
      console.log(response); // Check the response in the console

      if (response && response.length > 0) {
        displayBooks(response); // Update the displayed books
      } else {
        // No filtered books found, display all books instead
        getBooks(50);
      }
    } else {
      console.log(request.status); // Check the status code in the console
      alert('Error. Unable to filter.');
    }
  };

  request.onerror = function () {
    console.log(request.status); // Check the status code in the console
    alert('Error. Unable to filter.');
  };

  request.send();
}

// Modify the getBooksByCategory function
function getBooksByCategory(category) {
  // Uncheck the "Filter By Latest" radio buttons
  var newRadio = document.getElementById("newRadio");
  var oldRadio = document.getElementById("oldRadio");
  newRadio.checked = false;
  oldRadio.checked = false;
  // Uncheck the "Filter By Price" radio buttons
  var highestPriceRadio = document.getElementById("highestPriceRadio");
  var lowestPriceRadio = document.getElementById("lowestPriceRadio");
  highestPriceRadio.checked = false;
  lowestPriceRadio.checked = false;

  var request = new XMLHttpRequest();

  request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books_category/" + category, true);
  request.onload = function () {
    if (request.status === 200) {
      var response = JSON.parse(request.responseText);
      console.log(response); // Check the response in the console

      if (response && response.length > 0) {
        displayBooks(response); // Update the displayed books
      } else {
        // document.getElementById("booklist").innerHTML = '<p>No books found in this category.</p>';
        getBooks(50); // Display all books
      }
    } else {
      console.log(request.status); // Check the status code in the console
      alert('Error. Unable to fetch books by category.');
    }
  };

  request.onerror = function () {
    console.log(request.status); // Check the status code in the console
    alert('Error. Unable to fetch books by category.');
  };

  request.send();
}

function getBooksByLatest(latest) {
  var request = new XMLHttpRequest();

  request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books_new/" + latest, true);
  request.onload = function () {
    if (request.status === 200) {
      var response = JSON.parse(request.responseText);
      console.log(response); // Check the response in the console

      if (response && response.length > 0) {
        displayBooks(response); // Update the displayed books
      } else {
        // No books found for the selected filter, display all books instead
        getBooks(50); // Display all books
      }
    } else {
      console.log(request.status); // Check the status code in the console
      alert('Error. Unable to fetch books by latest.');
    }
  };

  request.onerror = function () {
    console.log(request.status); // Check the status code in the console
    alert('Error. Unable to fetch books by latest.');
  };

  request.send();
}

function displayBooks(books) {
  var html = "";
  var max = books.length;

  for (var i = 0; i < max; i++) {
    var book = books[i]; // Get the current book object from the array

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
    // Check if the book is in the user's favorite list
    var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    var isFavorite = favorites.includes(book.booksId);

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
        '<a href="#" onclick="addToFavorites(this, ' + book.booksId + ')" class="favorite-icon" data-books-id="' + book.booksId + '" title="Save Book"><i class="fas fa-bookmark' + (isFavorite ? ' fa-solid' : ' fa-light') + '" style="color: ' + (isFavorite ? '#d33c52' : '#000000') + ';"></i></a>' +
        // '<a href="#" onclick="deleteFavorites(' + book.booksId + ')" + " title="Remove Saved Book"><i class="fas fa-xmark" style="color:#000000;"></i></a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

      // Append the book card to the booklist container
      html += bookCard;
  }
  document.getElementById("booklist").innerHTML = html;
}
function clearFilters() {
  // Uncheck the "Filter By Price" radio buttons
  var highestPriceRadio = document.getElementById("highestPriceRadio");
  var lowestPriceRadio = document.getElementById("lowestPriceRadio");
  highestPriceRadio.checked = false;
  lowestPriceRadio.checked = false;

  // Uncheck the "Filter By Latest" checkbox
  var newRadio = document.getElementById("newRadio");
  var oldRadio = document.getElementById("oldRadio");
  newRadio.checked = false;
  oldRadio.checked = false;

  // // Uncheck the "Filter By Category" radio buttons
  var AllRadio = document.getElementById("AllRadio");
  var ChildrenRadio = document.getElementById("ChildrenRadio");
  var ComicsRadio = document.getElementById("ComicsRadio");
  var RomanceRadio = document.getElementById("RomanceRadio");
  var ScienceRadio = document.getElementById("ScienceRadio");
  var FictionRadio = document.getElementById("FictionRadio");
  var PoetryRadio = document.getElementById("PoetryRadio");
  var OtherRadio = document.getElementById("OtherRadio");
  AllRadio.checked = false;
  ChildrenRadio.checked = false;
  ComicsRadio.checked = false;
  RomanceRadio.checked = false;
  ScienceRadio.checked = false;
  FictionRadio.checked = false;
  PoetryRadio.checked = false;
  OtherRadio.checked = false;

  // Display all books
  getBooks(40);
}

function performSearch() {
  var searchInput = document.getElementById("searchInput");
  var searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    // If the search query is empty, show all items (similar to the getInventory() function)
    getBooks(40);
  } else {
    var request = new XMLHttpRequest();
    //   var url = "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books_search/" + searchTerm;

    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books_search/" + searchTerm, true);

    request.onload = function () {
      if (request.status === 200) {
        var response = JSON.parse(request.responseText);
        console.log(response); // Check the response in the console

        if (response && response.length > 0) {
          displayBooks(response); // Update the displayed books
        } else {
          // No books found for the search term
          var html = '<div class="col-md-12">No books found for the search term.</div>';
          document.getElementById("booklist").innerHTML = html;
        }
      } else {
        console.log(request.status); // Check the status code in the console
        alert('Error. Unable to perform the search.');
      }
    };

    request.onerror = function () {
      console.log(request.status); // Check the status code in the console
      alert('Error. Unable to perform the search.');
    };

    request.send();
  }
}


// function getSuggestedBooks(num, booksId) {
//   var request = new XMLHttpRequest();

//   request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

//   request.onload = function () {
//     document.getElementById("suggestedBooks").style.display = "flex";

//     var response = JSON.parse(request.responseText);
//     console.log(response);

//     var html = "";

//     var max = num;
//     if (response.length < max) max = response.length;

//     // Get the current book's category (you can access it from your existing code)
//     var currentBookCategory = "Romance"; 

//     // Filter the suggested books based on the current book's category
//     var suggestedBooks = response.filter(function (book) {
//       return book.category === currentBookCategory;
//     });

//     // Shuffle the suggested books to display random suggestions
//     shuffleArray(suggestedBooks);

//     for (var i = 0; i < max; i++) {
//       var book = suggestedBooks[i];

//       // Add a check to ensure that the book object is defined and contains the 'image' property
//       if (book && book.image) {
//         // Determine the type of image and set the appropriate image source
//         var imageSrc;
//         if (book.image.startsWith("data:image/jpeg;base64,") || book.image.startsWith("data:image/png;base64,")) {
//           // If the image is already a data URI, use it as is
//           imageSrc = book.image;
//         } else if (book.image.startsWith("/images/")) {
//           // If it starts with "/images/", assume it's a relative path to the image folder
//           imageSrc = book.image;
//         } else {
//           // If it's a regular image URL, construct the full URL to the image folder
//           imageSrc = "/images/" + book.image;
//         }

//         // Check if the book is in the user's favorite list
//         var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
//         var isFavorite = favorites.includes(book.booksId);

//         // Create the HTML for each book item with a custom class "suggested-book-item"
//         var bookItem = '<div class="col-md-4 lg-5 mb-8 suggested-book-item d-flex">' +
//           '<div class="card">' +
//           '<img class="card-img-top" src="' + imageSrc + '" alt="' + book.title + '">' +
//           '<div class="card-body">' +
//           '<h5 class="card-title">' + book.title + '</h5>' +
//           '<p class="card-text">' + book.author + '</p>' +
//           '<p class="card-text">$' + book.price + '</p>' +
//           '<div>' +
//           '<div class="card-footer d-flex justify-content-between align-items-center">' +
//           '<a href="details.html?booksId=' + book.booksId + '" class="view-more" style="color: #333232;">View more</a>' +
//           '<a href="#" onclick="addToFavorites(this, ' + book.booksId + ')" class="favorite-icon" data-books-id="' + book.booksId + '" title="Save Book"><i class="fas fa-bookmark' + (isFavorite ? ' fa-solid' : ' fa-light') + '" style="color: ' + (isFavorite ? '#d33c52' : '#000000') + ';"></i></a>' +
//           // '<a href="#" onclick="deleteFavorites(' + book.booksId + ')" + " title="Remove Saved Book"><i class="fas fa-xmark" style="color:#000000;"></i></a>' +
//           '</div>' +
//           '</div>' +
//           '</div>' +
//           '</div>' +
//           '</div>';

//         // Append the book item to the suggestedBooks container
//         html += bookItem;
//       }
//     }

//     document.getElementById("suggestedBooks").innerHTML = html;
//   };

//   request.send();
// }

// // Helper function to shuffle an array (Fisher-Yates shuffle)
// function shuffleArray(array) {
//   for (var i = array.length - 1; i > 0; i--) {
//     var j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
// }

function getSuggestedBooks(num, booksId) {
  var request = new XMLHttpRequest();

  request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

  request.onload = function () {
    document.getElementById("suggestedBooks").style.display = "flex";

    var response = JSON.parse(request.responseText);
    console.log(response);

    var html = "";

    var max = num;
    if (response.length < max) max = response.length;

    // Shuffle all books to display random suggestions
    shuffleArray(response);

    for (var i = 0; i < max; i++) {
      var book = response[i];

      // Add a check to ensure that the book object is defined and contains the 'image' property
      if (book && book.image) {
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

        // Check if the book is in the user's favorite list
        var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        var isFavorite = favorites.includes(book.booksId);

        // Create the HTML for each book item with a custom class "suggested-book-item"
        var bookItem = '<div class="col-md-4 lg-5 mb-8 suggested-book-item d-flex">' +
          '<div class="card">' +
          '<img class="card-img-top" src="' + imageSrc + '" alt="' + book.title + '">' +
          '<div class="card-body">' +
          '<h5 class="card-title">' + book.title + '</h5>' +
          '<p class="card-text">' + book.author + '</p>' +
          '<p class="card-text">$' + book.price + '</p>' +
          '<div>' +
          '<div class="card-footer d-flex justify-content-between align-items-center">' +
          '<a href="details.html?booksId=' + book.booksId + '" class="view-more" style="color: #333232;">View more</a>' +
          '<a href="#" onclick="addToFavorites(this, ' + book.booksId + ')" class="favorite-icon" data-books-id="' + book.booksId + '" title="Save Book"><i class="fas fa-bookmark' + (isFavorite ? ' fa-solid' : ' fa-light') + '" style="color: ' + (isFavorite ? '#d33c52' : '#000000') + ';"></i></a>' +
          // '<a href="#" onclick="deleteFavorites(' + book.booksId + ')" + " title="Remove Saved Book"><i class="fas fa-xmark" style="color:#000000;"></i></a>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';

        // Append the book item to the suggestedBooks container
        html += bookItem;
      }
    }

    document.getElementById("suggestedBooks").innerHTML = html;
  };

  request.send();
}

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
