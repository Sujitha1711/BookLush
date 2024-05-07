function store_login() {
    var response = "";

    var jsonData = new Object();
    jsonData.email = document.getElementById("loginID").value;
    jsonData.password = document.getElementById("loginPassword").value;

    if (jsonData.email == "" || jsonData.password == "") {
        alert('All fields are required!'); return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/login", true);

    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.Count == 1 || response.length == 1) {
            if (response.length == 1) {
                sessionStorage.setItem("email", jsonData.email);
                sessionStorage.setItem("stores", JSON.stringify(response[0]));
                // console.log("Stored Store Object:", response[0]);
                console.log("Stored Store Object:", response[0]);
                console.log("Session Storage Email:", sessionStorage.getItem("email"));
                console.log("Session Storage Store:", sessionStorage.getItem("store"));
            }
            $('#loginForm').modal('hide');
            setNavBar();
            console.log('successful login');
            // console.log(response);
            // var name = response[0].name;
            // filllocation(name);
            AddBook();

        }
        else {
            alert('Error. Unable to login.');
        }
    };

    request.send(JSON.stringify(jsonData));
}

function GetStore(storesId) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/store/" + storesId, true);

    request.onload = function () {
        if (request.status === 200) {
            var response = JSON.parse(request.responseText);
            if (response.Count === 1) {
                // Assuming that the response contains the details of one store
                sessionStorage.setItem("store", JSON.stringify(response.Items[0]));
                console.log(response.Items[0]);


                // Call the filllocation function with the store's name
                // filllocation(response.Items[0].name);
            } else {
                alert('Error. Unable to get store details.');
            }
        } else {
            alert('Error. Unable to get store details.');
        }
    };

    request.send();
}



// function getBooksEdit(num) {
//     var request = new XMLHttpRequest();

//     request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

//     request.onload = function () {
//         var response = JSON.parse(request.responseText);
//         console.log(response); // Log the books array to the console

//         var html = "";

//         var max = num;
//         if (response.length < max) max = response.length;

//         for (var i = 0; i < max; i++) {
//             var book = response[i]; // Get the current book

//             // Determine the type of image and set the appropriate image source
//             var imageSrc;
//             if (book.image.startsWith("data:image/jpeg;base64") || book.image.startsWith("data:image/png;base64,")) {
//                 // If the image is already a data URI, use it as is
//                 imageSrc = book.image;
//             } else if (book.image.startsWith("/images/")) {
//                 // If it starts with "/images/", assume it's a relative path to the image folder
//                 imageSrc = book.image;
//             } else {
//                 // If it's not a data URI or relative path, it must be a regular image URL (e.g., hosted on a website)
//                 // In this case, you can directly use the image URL
//                 imageSrc = "/images/" + book.image;
//             }

//             // Create the HTML for each book card
//             var bookCard = '<div class="col-md-4 mb-4">' +
//                 '<div class="card">' +
//                 '<img class="card-img-top" src="' + imageSrc + '" alt="' + book.title + '">' +
//                 '<div class="card-body">' +
//                 '<h5 class="card-title">' + book.title + '</h5>' +
//                 '<p class="card-text">' + book.author + '</p>' +
//                 '<p class="card-text">$' + book.price + '</p>' +
//                 '<div>' +
//                 '<div class="justify-content-between align-items-center">' + // Removed the d-flex class
//                 '<button class="btn button2 btn-sm rounded-pill mr-2" onclick="fillBook(\'' + book.booksId + '\', \'' + book.quantity + '\', \'' + book.price + '\', \'' + book.location + '\', \'' + book.location2 + '\', \'' + book.location3 + '\')" data-toggle="modal" data-target="#editbook">Edit</button>' +
//                 '<button class="btn btn-danger btn-sm rounded-pill" onclick="deletebook(\'' + book.booksId + '\')">Delete</button>' +
//                 '</div>' +
//                 '</div>' +
//                 '</div>' +
//                 '</div>' +
//                 '</div>';

//             // Append the book card to the booklist container
//             html += bookCard;
//         }
//         document.getElementById("booklist1").innerHTML = html;
//     };
//     request.send();
// }
function getBooksEdit(num) {
    var request = new XMLHttpRequest();

    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

    request.onload = function () {
        var response = JSON.parse(request.responseText);
        console.log(response); // Log the books array to the console

        var html = "";

        var max = num;
        if (response.length < max) max = response.length;

        for (var i = 0; i < max; i++) {
            var book = response[i]; // Get the current book

            // Determine the type of image and set the appropriate image source
            var imageSrc;
            if (book.image.startsWith("data:image/jpeg;base64") || book.image.startsWith("data:image/png;base64,")) {
                // If the image is already a data URI, use it as is
                imageSrc = book.image;
            } else if (book.image.startsWith("/images/")) {
                // If it starts with "/images/", assume it's a relative path to the image folder
                imageSrc = book.image;
            } else {
                // If it's not a data URI or relative path, it must be a regular image URL (e.g., hosted on a website)
                // In this case, you can directly use the image URL
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
                '<div class="justify-content-between align-items-center">' + // Removed the d-flex class
                '<button class="btn button2 btn-sm rounded-pill mr-2" onclick="fillBook(\'' + book.booksId + '\', \'' + book.quantity + '\', \'' + book.price + '\', \'' + book.location + '\', \'' + book.location2 + '\', \'' + book.location3 + '\')" data-toggle="modal" data-target="#editbook">Edit</button>' +
                '<button class="btn btn-danger btn-sm rounded-pill" onclick="deletebook(\'' + book.booksId + '\')">Delete</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            // Append the book card to the booklist container
            html += bookCard;
        }
        document.getElementById("booklist1").innerHTML = html;
    };
    request.send();
}




function Editbook(booksId) {
    var response = "";
    // fillBook(booksId, quantity, price, location, location2, location3);
    var jsonData = {
        quantity: document.getElementById("edit-quantity").value,
        price: document.getElementById("edit-price").value,
        location: document.getElementById("edit-location").value,
        location2: document.getElementById("edit-location2").value,
        location3: document.getElementById("edit-location3").value,

    };

    if (jsonData.quantity == "") {
        alert('All fields are required!'); return;
    }
    var request = new XMLHttpRequest();
    request.open("PUT", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books/" + booksId, true);
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(request.responseText);
        if (response.affectedRows == 1) {
            $('#editbook').modal('hide');
            alert('Book Edited.');
            // Reload the page after adding the book to show the updated list of books
            location.reload();
            // fillBook(booksId, quantity, price, location, location2, location3);
        }
        else {
            alert('Error. Unable to edit book.');
        }
    };

    request.send(JSON.stringify(jsonData));
}
function increaseCount(a, b) {
    var input = b.previousElementSibling;
    var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
}

function decreaseCount(a, b) {
    var input = b.nextElementSibling;
    var value = parseInt(input.value, 10);
    if (value > 1) {
        value = isNaN(value) ? 0 : value;
        value--;
        input.value = value;
    }
}

function increaseCount(a, b) {
    var input = b.previousElementSibling;
    var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
}

function decreaseCount(a, b) {
    var input = b.nextElementSibling;
    var value = parseInt(input.value, 10);
    if (value > 1) {
        value = isNaN(value) ? 0 : value;
        value--;
        input.value = value;
    }
}


// // Function to handle image display
// function getImage() {
//     // Access the target property of the event object to determine which element triggered the event
//     const image = event.target;
//     // Check if the target element has the id attribute equal to "image_input"
//     if (image && image.id === "image") {
//         console.log(image.value);
//         console.log(image.id);

//         // Use FileReader object to get file
//         const reader = new FileReader();
//         reader.addEventListener("load", () => {
//             // Display the selected image
//             const display_image = document.getElementById("book-preview-image"); // Update the ID to "book-preview-image"
//             display_image.setAttribute("src", reader.result); // Set the src attribute to the base64-encoded image data
//         });
//         const file = image.files[0]; // Access the selected file
//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     }
// }

// // DOMContentLoaded ensures that the code executes only when the HTML document has finished loading
// document.addEventListener("DOMContentLoaded", function () {
//     document.addEventListener("change", getImage);
// });


// Function to handle image display
function getImage() {
    // Access the target property of the event object to determine which element triggered the event
    const image = event.target;
    // Check if the target element has the id attribute equal to "image_input"
    if (image && image.id === "image") {
        const fileName = image.value.replace(/^.*\\/, "");
        console.log(fileName);

        // Use FileReader object to get file
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            // Display the selected image
            const display_image = document.getElementById("book-preview-image"); // Update the ID to "book-preview-image"
            display_image.setAttribute("src", reader.result); // Set the src attribute to the base64-encoded image data
        });
        const file = image.files[0]; // Access the selected file
        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

// DOMContentLoaded ensures that the code executes only when the HTML document has finished loading
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("change", getImage);
});


// Function to add a new book
function AddBook() {
    var store = JSON.parse(sessionStorage.getItem("stores"));
    console.log("Retrieved Store Object:", store);
    var Booklocation = store.name;
    var title = document.getElementById("book-title").value;
    var author = document.getElementById("book-author").value;
    var category = document.getElementById("book-category").value;
    var description = document.getElementById("book-description").value;
    var price = document.getElementById("book-price").value;
    var quantity = document.getElementById("book-quantity").value;
    var location = store.name;
    var published_date = document.getElementById("book-published_date").value;

    // Convert the "yyyy-mm-dd" format to "mm/dd/yyyy" format
    var parts = published_date.split("-");
    var formatted_date = parts[1] + "-" + parts[2] + "-" + parts[0];
    console.log("Formatted Date:", formatted_date);

    const image = document.getElementById("image");
    const file = image.files[0];
    console.log(file);

    // Check if all required fields are filled
    if (!title || !author || !category || !description || !price || !quantity || !published_date || !file) {
        alert('All fields are required!');
        return;
    }

    // Check if the selected file is an image
    if (!file.type.startsWith("image/")) {
        alert('Please select a valid image file.');
        return;
    }

    // Create FileReader object and use it to read contents of selected file
    const reader = new FileReader();

    // Use the load event to handle what happens after an image is successfully read
    reader.addEventListener("load", () => {
        // Convert the uploaded image to base64 and include it in the JSON data
        var jsonData = {
            title: title,
            author: author,
            category: category,
            description: description,
            price: price,
            quantity: quantity,
            location: location,
            published_date: formatted_date,
            image: reader.result
            //.split(",")[1], // Set the base64-encoded image data
        };

        var request = new XMLHttpRequest();

        request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

        request.onload = function () {
            response = JSON.parse(request.responseText);
            console.log(response);
            if (response.affectedRows == 1) {
                alert('Book Added.');
                $('#addBookModal').modal('hide');
                console.log("Before reloading the page");
                location.reload();
                // fillBook(booksId, quantity, price, location, location2, location3);
            } else {
                alert('Error. Unable to add new Book.');
            }
        };

        request.onerror = function () {
            alert('Error sending the request. Please try again later.');
        };

        request.send(JSON.stringify(jsonData));
    });

    // Handle FileReader error event
    reader.onerror = function () {
        alert('Error reading the image file. Please try again.');
    };

    // Read the image file as a data URL
    reader.readAsDataURL(file);
}

// // Function to add a new book
// function AddBook() {
//     var store = JSON.parse(sessionStorage.getItem("stores"));
//     console.log("Retrieved Store Object:", store);

//     var title = document.getElementById("book-title").value;
//     var author = document.getElementById("book-author").value;
//     var category = document.getElementById("book-category").value;
//     var description = document.getElementById("book-description").value;
//     var price = document.getElementById("book-price").value;
//     var quantity = document.getElementById("book-quantity").value;
//     var location = store.name;
//     var published_date = document.getElementById("book-published_date").value;

//     // Convert the "yyyy-mm-dd" format to "mm/dd/yyyy" format
//     var parts = published_date.split("-");
//     var formatted_date = parts[1] + "-" + parts[2] + "-" + parts[0];
//     console.log("Formatted Date:", formatted_date);

//     const image = document.getElementById("image");
//     const file = image.files[0];
//     console.log(file);

//     // Check if all required fields are filled
//     if (!title || !author || !category || !description || !price || !quantity || !published_date || !file) {
//         alert('All fields are required!');
//         return;
//     }

//     // Check if the selected file is an image
//     if (!file.type.startsWith("image/")) {
//         alert('Please select a valid image file.');
//         return;
//     }

//     // Create FileReader object and use it to read contents of selected file
//     const reader = new FileReader();

//     // Use the load event to handle what happens after an image is successfully read
//     reader.addEventListener("load", () => {
//         // Convert the uploaded image to base64 and include it in the JSON data
//         var jsonData = {
//             title: title,
//             author: author,
//             category: category,
//             description: description,
//             price: price,
//             quantity: quantity,
//             location: location,
//             published_date: formatted_date,
//             image: reader.result,
//             //.split(",")[1], // Set the base64-encoded image data
//         };

//         var request = new XMLHttpRequest();

//         request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

//         request.onload = function () {
//             response = JSON.parse(request.responseText);
//             console.log(response);
//             if (response.affectedRows == 1) {
//                 alert('Book Added.');
//                 $('#addBookModal').modal('hide');
//                 // fillBook(booksId, quantity, price, location, location2, location3);
//             } else {
//                 alert('Error. Unable to add new Book.');
//             }
//         };

//         request.onerror = function () {
//             alert('Error sending the request. Please try again later.');
//         };

//         request.send(JSON.stringify(jsonData));
//     });

//     // Handle FileReader error event
//     reader.onerror = function () {
//         alert('Error reading the image file. Please try again.');
//     };

//     // Read the image file as a data URL
//     reader.readAsDataURL(file);
// }


// function AddBook() {

//     var response = "";
//     var jsonData = new Object();
//     jsonData.title = document.getElementById("book-title").value;
//     jsonData.author = document.getElementById("book-author").value;
//     jsonData.category = document.getElementById("book-category").value;
//     jsonData.description = document.getElementById("book-description").value;
//     jsonData.price = document.getElementById("book-price").value;
//     jsonData.quantity = document.getElementById("book-quantity").value;
//     jsonData.location = document.getElementById("book-location").value;
//     jsonData.image = document.getElementById("book-image").value;
//     console.log(jsonData.title);
//     if (jsonData.title == "" || jsonData.author == "" || jsonData.category == "" || jsonData.description == "" || jsonData.price == "" || jsonData.quantity == "") {
//         alert('All fields are required!');
//         return;
//     }

//     var request = new XMLHttpRequest();

//     request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books", true);

//     request.onload = function () {
//         response = JSON.parse(request.responseText);
//         console.log(response);
//         if (response.affectedRows == 1) {
//             $('#addBookModal').modal('hide');
//             alert('Book Added.');
//             location.reload();
//             console.log(request.responseText);
//         } else {
//             alert('Error. Unable to add new Book.');
//         }
//     };

//     request.send(JSON.stringify(jsonData));
// }

function deletebook(booksId) {
    // Open the delete confirmation modal
    $('#deleteConfirmationModal').modal('show');

    // Handle the user's response from the modal
    $('#confirmDeleteButton').on('click', function () {
        $('#deleteConfirmationModal').modal('hide');

        var request = new XMLHttpRequest();

        request.open("DELETE", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books/" + booksId, true);

        request.onload = function () {
            var response = JSON.parse(request.responseText);

            if (response.affectedRows == 1) {
                alert('Book deleted successfully.');
                location.reload();
            }
        };

        request.onerror = function () {
            alert('Error. Unable to delete the book.');
        };

        request.send();
    });
}

// store.js
// Function to get stores details
function getStores(num) {
    var request = new XMLHttpRequest();

    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/stores", true);

    request.onload = function () {
        var response = JSON.parse(request.responseText);
        console.log(response);

        var html = "";

        var max = num;
        if (response.length < max) max = response.length;

        for (var i = 0; i < max; i++) {
            var stores = response[i];
            var storeNumber = i + 1; // Add 1 to i to make the numbering start from 1

            html += '<div class="col-md-3 box">' +
                '<h4 style="white-space: nowrap;">' + storeNumber + '. ' + stores.name + '</h4>' +
                '<p style="white-space: nowrap;">' +
                '<i class="fas fa-map-marker-alt"></i> ' +
                '<a class="address-link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(stores.address) + '" target="_blank">' +
                stores.address + '</a> | ' +
                '<a class="email-link" href="mailto:' + stores.email + '"><i class="far fa-envelope"></i> ' + stores.email + '</a> | ' +
                '<i class="fas fa-phone"></i> ' + stores.phone + ' | ' + // Add phone number here
                '<i class="far fa-clock"></i> ' + stores.timing +
                '</p>' +
                '</div>';
        }

        document.getElementById("Storeslist").innerHTML = html;
    };

    request.send();
}

function GetOrderByStoreName() {
    var response = "";
    var request = new XMLHttpRequest();
    var store = JSON.parse(sessionStorage.getItem("stores"));
    console.log("Retrieved Store Object:", store);
    var store_name = store.name;
    console.log("Store Name: " + store_name);

    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/order_store" + "/" + store_name, true);

    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = "";


        // Check if the 'Items' array exists and has a length
        if (response && response.length > 0) {
            // Loop through the response and generate the order HTML dynamically
            for (var i = 0; i < response.length; i++) {
                var booksId = response[i].booksId;
                // var orderUsername = response[i].username
                var orderName = response[i].name;
                var orderDate = response[i].date;
                var orderQuantity = response[i].quantity;
                var orderStoreName = response[i].store_name;
                console.log(request.responseText);
                var username = response[i].username;

                var bookRequest = new XMLHttpRequest();
                bookRequest.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books/" + booksId, false);
                bookRequest.send();

                var bookData = JSON.parse(bookRequest.responseText)[0];

                var imageSrc;
                if (bookData && bookData.image) {
                    if (bookData.image.startsWith("data:image/png;base64,") || bookData.image.startsWith("data:image/jpeg;base64,")) {
                        imageSrc = bookData.image;
                    } else {
                        imageSrc = "/images/" + bookData.image;
                    }
                }

                // Convert orderDate to a valid Date object
                var date = new Date(Date.parse(orderDate));

                // Calculate the number of days until the expiration date (order date + 3 days)
                var expirationDate = new Date(date.getTime() + (3 * 24 * 60 * 60 * 1000)); // Adding 3 days in milliseconds
                var currentDate = new Date();
                var timeDifference = expirationDate.getTime() - currentDate.getTime();
                var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

                // Check if the order is within the 3-day collection window
                var orderStatus;
                if (daysDifference <= 0) {
                    // If the countdown has ended, show the cancellation message
                    orderStatus = 'Cancel this order';
                } else {
                    // If within 3 days, show the countdown message
                    orderStatus = 'Customer has ' + daysDifference + ' days left to collect thier book.';
                }

                html += '<div class="col-md-12 order-container">' +
                    '<div class="row">' +
                    '<div class="col-md-4">' +
                    '<div class="order-item-image-container" style="width: 200px; height: 200px;">' +
                    '<img class="order-item-image " src="' + imageSrc + '" alt="Book Image" style="width: 400%; height: 400%;">' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-8">' +
                    '<div class="order-item-header">Pre-Order Details</div>' +
                    '<div class="order-item-data">' +
                    '<div class="col-md-8 order-info">' +
                    '<div class="order-item-date">Title: ' + bookData.title + '</div>' +
                    '<div class="order-item-name">Name: ' + orderName + '</div>' +
                    '<div class="order-item-name">Quantity: ' + orderQuantity + '</div>' +
                    '<div class="order-item-date">Store Name: ' + orderStoreName + '</div>' +
                    '<div class="order-item-date">Date: ' + orderDate + '</div>' +
                    '<div class="order-status" style="white-space: nowrap;">' + orderStatus + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        } else {
            // Handle the case where 'response' is not defined or empty
            html = "No orders found.";
        }

        // Append the generated HTML to the "orderlist" div
        document.getElementById("StoreOrder").innerHTML = html;
    };

    request.send();
}


