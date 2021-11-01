// There are fewer ways to pick a DOM node with legacy browsers
const form = document.getElementsByTagName('form')[0];
const email = document.getElementById('mail');

// The following is a trick to reach the next sibling Element node in the DOM
// This is dangerous because you can easily build an infinite loop.
// In modern browsers, you should prefer using element.nextElementSibling
let error = email;
while ((error = error.nextSibling).nodeType != 1);

// As per the HTML5 Specification
const emailRegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Many legacy browsers do not support the addEventListener method.
// Here is a simple way to handle this; it's far from the only one.
function addEvent(element, event, callback) {
  let previousEventCallBack = element['on' + event];
  element['on' + event] = function (e) {
    const output = callback(e);

    // A callback that returns `false` stops the callback chain
    // and interrupts the execution of the event callback.
    if (output === false) return false;

    if (typeof previousEventCallBack === 'function') {
      output = previousEventCallBack(e);
      if (output === false) return false;
    }
  };
}

// Now we can rebuild our validation constraint
// Because we do not rely on CSS pseudo-class, we have to
// explicitly set the valid/invalid class on our email field
addEvent(window, 'load', function () {
  // Here, we test if the field is empty (remember, the field is not required)
  // If it is not, we check if its content is a well-formed e-mail address.
  const test = email.value.length === 0 || emailRegExp.test(email.value);

  email.className = test ? 'valid' : 'invalid';
});

// This defines what happens when the user types in the field
addEvent(email, 'input', function () {
  const test = email.value.length === 0 || emailRegExp.test(email.value);
  if (test) {
    email.className = 'valid';
    error.textContent = '';
    error.className = 'error';
  } else {
    email.className = 'invalid';
  }
});

// This defines what happens when the user tries to submit the data
addEvent(form, 'submit', function () {
  const test = email.value.length === 0 || emailRegExp.test(email.value);

  if (!test) {
    email.className = 'invalid';
    error.textContent = 'I expect an e-mail, darling!';
    error.className = 'error active';

    // Some legacy browsers do not support the event.preventDefault() method
    return false;
  } else {
    email.className = 'valid';
    error.textContent = '';
    error.className = 'error';
  }
});

// Year
// Get Year
let year = new Date().getFullYear();
document.querySelector('.year').innerHTML = `${year}`;

// Like/Dislike
var color1 = document.getElementsByClassName('fa-thumbs-up')[0];
var color2 = document.getElementsByClassName('fa-thumbs-down')[0];

function like() {
  if (color1.style.color == '#0d6efd') {
    color1.style.color = 'black';
  } else {
    color1.style.color = '#0d6efd';
  }
  color2.style.color = 'black';
}

function dislike() {
  if (color2.style.color == '#0d6efd') {
    color2.style.color = 'black';
  } else {
    color2.style.color = '#0d6efd';
  }
  color1.style.color = 'black';
}
// Price Compare Modal

// Cart
/* get cart total from session on load */
updateCartTotal();

/* button event listeners */
document.getElementById('emptycart').addEventListener('click', emptyCart);
var btns = document.getElementsByClassName('addtocart');
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function () {
    addToCart(this);
    this.disabled = true;
  });
}

/* ADD TO CART functions */

function addToCart(elem) {
  //init
  var sibs = [];
  var getprice;
  var getproductName;
  var cart = [];
  var stringCart;
  //cycles siblings for product info near the add button
  while ((elem = elem.previousSibling)) {
    if (elem.nodeType === 3) continue; // text node
    if (elem.className == 'price') {
      getprice = elem.innerText;
    }
    if (elem.className == 'productname') {
      getproductName = elem.innerText;
    }
    sibs.push(elem);
  }
  //create product object
  var product = {
    productname: getproductName,
    price: getprice,
  };
  //convert product data to JSON for storage
  var stringProduct = JSON.stringify(product);
  /*send product data to session storage */

  if (!sessionStorage.getItem('cart')) {
    //append product JSON object to cart array
    cart.push(stringProduct);
    //cart to JSON
    stringCart = JSON.stringify(cart);
    //create session storage cart item
    sessionStorage.setItem('cart', stringCart);
    addedToCart(getproductName);
    updateCartTotal();
  } else {
    //get existing cart data from storage and convert back into array
    cart = JSON.parse(sessionStorage.getItem('cart'));
    //append new product JSON object
    cart.push(stringProduct);
    //cart back to JSON
    stringCart = JSON.stringify(cart);
    //overwrite cart data in sessionstorage
    sessionStorage.setItem('cart', stringCart);
    addedToCart(getproductName);
    updateCartTotal();
  }
}
/* Calculate Cart Total */
function updateCartTotal() {
  //init
  var total = 101500;
  var price = 0;
  var items = 0;
  var productname = '';
  var carttable = '';
  if (sessionStorage.getItem('cart')) {
    //get cart data & parse to array
    var cart = JSON.parse(sessionStorage.getItem('cart'));
    //get no of items in cart
    items = cart.length;
    //loop over cart array
    for (var i = 0; i < items; i++) {
      //convert each JSON product in array back into object
      var x = JSON.parse(cart[i]);
      //get property value of price
      price = parseFloat(x.price.split('৳')[1]);
      productname = x.productname;
      //add price to total
      carttable += '<tr><td>' + productname;
      total += price;
    }
  }
  //update total on website HTML
  document.getElementById('total').innerHTML = total.toFixed(2);
  //insert saved products to cart table
  document.getElementById('carttable').innerHTML = carttable;
  //update items in cart on website HTML
  document.getElementById('itemsquantity').innerHTML = items;
}
//user feedback on successful add
function addedToCart(pname) {
  var message = pname + ' was added to the cart';
  var alerts = document.getElementById('alerts');
  alerts.innerHTML = message;
  if (!alerts.classList.contains('message')) {
    alerts.classList.add('message');
  }
}
/* User Manually empty cart */
function emptyCart() {
  //remove cart session storage object & refresh cart totals
  if (sessionStorage.getItem('cart')) {
    sessionStorage.removeItem('cart');
    updateCartTotal();
    //clear message and remove class style
    var alerts = document.getElementById('alerts');
    alerts.innerHTML = '';
    if (alerts.classList.contains('message')) {
      alerts.classList.remove('message');
    }
  }
}
