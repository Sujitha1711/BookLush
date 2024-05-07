function placeOrder(booksId) {
    if (sessionStorage.getItem("username") == null) {
        alert("You need to be a registered user to place an order!");
        $("#loginForm").modal("show");
    } else {
        var user = JSON.parse(sessionStorage.getItem("user"));
        console.log(user);
       // Get the current date
       var currentDate = new Date().toISOString().split('T')[0];
        
       // Show the pre-order modal and set the current date in the date field
       $("#PreOrder").modal("show");
       document.getElementById("order.date").value = currentDate;
        // // Show the pre-order modal
        // $("#PreOrder").modal("show");

        var request = new XMLHttpRequest();
        request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books/" + booksId, true);

        request.onload = function () {
            var response = JSON.parse(request.responseText);
            console.log(response);
            if (response.length > 0) {
                var book = response[0];
                var individualPrice = book.price;
                var quantity = parseInt(document.getElementById("order.quantity").value);
                var totalPrice = individualPrice * quantity;
                document.getElementById("order.price").value = totalPrice.toFixed(2);
                $("#PreOrder").modal("show");
            }
        };

        // Send the GET request to fetch book information
        request.send();

        // Add an event listener to the "Apply" button inside the pre-order modal
        document.getElementById("applyButton").addEventListener("click", function () {
            // Get the user input from the form modal
            var store_name = document.getElementById("order.store_name").value;
            var name = document.getElementById("order.name").value;
            var quantity = parseInt(document.getElementById("order.quantity").value);
            var price = parseFloat(document.getElementById("order.price").value);
            var date = document.getElementById("order.date").value;

      

      
            var jsonData = {
                username: user.username,
                booksId: booksId,
                store_name: store_name,
                name: name,
                quantity: quantity,
                price: price, // Use the 'price' variable here, not 'book.price'
                date: date,
            };

            var request = new XMLHttpRequest();

            request.open("POST", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/order/" + user.username + "/" + booksId, true);

            request.onload = function () {
                response = JSON.parse(request.responseText);
                console.log(response.message);
                if (response.message == "Order successfully placed") {
                    alert('Order placed successfully. Email of the order has been sent.');
                    alert('Please collect within 3 days or else your order will be automatically removed.');
                } else {
                    alert('Error. Unable to pre-order. Please check that you have not ordered this book and it has not been delivered yet.');
                }
            };

            request.onerror = function () {
                alert('Error. Unable to add book to favorites. Please try again.');
            };

            // Send the POST request with order details
            request.send(JSON.stringify(jsonData));
        });
    }
}






function GetOrder() {
    var response = "";
    var request = new XMLHttpRequest();
    var username = sessionStorage.getItem("username");

    request.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/order/" + username, true);

    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = "";

        // Check if the 'Items' array exists and has a length
        if (response && response.length > 0) {
            // Loop through the response and generate the order HTML dynamically
            for (var i = 0; i < response.length; i++) {
                var booksId = response[i].booksId;
                var orderName = response[i].name;
                var orderDate = response[i].date;

                // Fetch book data based on booksId
                var bookRequest = new XMLHttpRequest();
                bookRequest.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books/" + booksId, false);
                bookRequest.send();

                if (bookRequest.status === 200) {
                    var bookData = JSON.parse(bookRequest.responseText)[0];

                    var imageSrc;
                    if (bookData && bookData.image) {
                        if (bookData.image.startsWith("data:image/png;base64,") || bookData.image.startsWith("data:image/jpeg;base64,")) {
                            // If the image is base64 encoded, use the image data URI directly
                            imageSrc = bookData.image;
                        } else {
                            // Otherwise, construct the URL to the image folder
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
                        orderStatus = 'Your order has been cancelled.';
                    } else {
                        // If within 3 days, show the countdown message
                        orderStatus = 'Please collect within ' + daysDifference + ' days or else your order will be automatically removed.';
                    }

                    html += '<div class="col-md-12 order-container">' +
                        '<div class="row">' +
                        '<div class="col-md-4">' +
                        '<div class="order-item-image-container">' +
                        '<img class="order-item-image" src="' + imageSrc + '" alt="Book Image">' +
                        '</div>' +
                        '</div>' +
                        '<div class="col-md-8">' +
                        '<div class="order-item-header">Pre-Order Details</div>' +
                        '<div class="order-item-data">' +
                        '<div class="row">' +
                        '<div class="col-md-6 order-info">' +
                        '<div class="order-item-name">Name: ' + orderName + '</div>' +
                        '<div class="order-item-date">Date: ' + orderDate + '</div>' +
                        '<div class="order-status">' + orderStatus + '</div>' + // Adding the order status here
                        '</div>' +
                        '<div class="col-md-6">' +
                        '<div class="d-flex justify-content-between">' +
                        '<button type="button" class="btn button" onclick="GetOrderById(\'' + username + '\', \'' + booksId + '\')" data-toggle="modal" data-target="#selectedOrder">Order info</button>' +
                        '<button type="button" class="btn btndelete" data-toggle="modal" data-target="#deleteConfirmationOrder" onclick="confirmDelete(\'' + username + '\', \'' + booksId + '\')">Collected</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                }
            }
        } else {
            // Handle the case where 'response' is not defined or empty
            html = "No orders found.";
        }

        // Append the generated HTML to the "orderlist" div
        document.getElementById("orderlist").innerHTML = html;
    };

    request.send();
}




function GetOrderById(username, booksId) {
    var response = "";
    var username = sessionStorage.getItem("username");
    console.log(username);

    var orderRequest = new XMLHttpRequest();
    var bookRequest = new XMLHttpRequest();

    orderRequest.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/order_id/" + username + "/" + booksId, true);
    bookRequest.open("GET", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/books/" + booksId, true);

    orderRequest.onload = function () {
        response = JSON.parse(orderRequest.responseText);
        console.log(response);

        // Update the modal content with the fetched order data
        document.getElementById("order-store_name").innerHTML = response[0].store_name;
        document.getElementById("order-name").innerHTML = response[0].name;
        document.getElementById("order-quantity").innerHTML = response[0].quantity;
        document.getElementById("order-price").innerHTML = response[0].price;
        document.getElementById("order-date").innerHTML = response[0].date;
        document.getElementById("order-username").innerHTML = response[0].username;

        // Trigger the modal display
        $('#selectedOrder').modal('show');
    };

    bookRequest.onload = function () {
        var bookResponse = JSON.parse(bookRequest.responseText);
        console.log(bookResponse);

        // Update the modal content with the fetched book data
        document.getElementById("book-title").innerHTML = bookResponse[0].title;

        // Check if the image is base64 encoded
        var bookImage = bookResponse[0].image; // Retrieve the image from the response

        if (bookImage.startsWith("data:image/jpeg;base64,") || bookImage.startsWith("data:image/png;base64,")) {
            // If the image is already a data URI, use it as is
            document.getElementById("book-image").setAttribute("src", bookImage);
        } else {
            // If the image is not a data URI, assume it's a regular image URL
            // Check if the image URL starts with "/images/"
            if (bookImage.startsWith("/images/")) {
                // If it does, use the relative path to the image folder
                document.getElementById("book-image").setAttribute("src", bookImage);
            } else {
                // If it doesn't, construct the full URL to the image folder
                document.getElementById("book-image").setAttribute("src", "/images/" + bookImage);
            }
        }

        // Trigger the modal display after both requests are completed
        $('#selectedOrder').modal('show');
    };

    orderRequest.send();
    bookRequest.send();
}





function confirmDelete(username, booksId) {
    // Store the username and booksId in the global variables
    window.usernameToDelete = username;
    window.booksIdToDelete = booksId;
}

function DeleteOrder() {
    // Check if the usernameToDelete and booksIdToDelete are set
    if (window.usernameToDelete && window.booksIdToDelete) {
        var response = "";
        var request = new XMLHttpRequest();

        request.open("DELETE", "https://9r8z6ga3s9.execute-api.us-east-1.amazonaws.com/order/" + window.usernameToDelete + "/" + window.booksIdToDelete, true);

        request.onload = function () {
            response = JSON.parse(request.responseText);
            console.log(response.message);
            if (response.message == "order deleted") {
                alert('Thank you for using our platform to pre-order book! Enjoy your book!');
                location.reload();
            } else {
                alert('Error. Unable to delete order');
            }
        };

        request.send();
    } else {
        alert("Error. No order selected to delete.");
    }
}