// ************************************************
// Shopping Cart API
// ************************************************

const shoppingCart = (function () {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];

  // Constructor
  function Item(name, price, count, imgSrc, brand) {
    this.name = name;
    this.price = price;
    this.count = count;
    this.imgSrc = imgSrc;
    this.brand = brand;
  }

  // Save cart
  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};

  // Add to cart
  obj.addItemToCart = function (name, price, count, imgSrc, brand) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    const item = new Item(name, price, count, imgSrc, brand);
    cart.push(item);
    saveCart();
  };
  // Set count from item
  obj.setCountForItem = function (name, count) {
    for (i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function (name) {
    for (item in cart) {
      if (cart[item].name === name) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  obj.removeItemFromCartAll = function (name) {
    for (item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  // Count cart
  obj.totalCount = function () {
    let totalCount = 0;
    for (item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = function () {
    let totalCart = 0;
    for (item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  // List cart
  obj.listCart = function () {
    let cartCopy = [];
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };
  return obj;
})();

// *****************************************
// Triggers / Events
// *****************************************

// Show modal(cart)
$("#btn").on("click", function () {
  $("#cart").modal("show");
});

// Order popup
$("#modal2").on("click", function () {
  if (cart != null && cart.length != 0) {
    alert("Order placed successfully");
  } else {
    alert(`Cart is empty. Add items.`);
  }
});

// Hide modal(cart)
$(".close").on("click", function () {
  $("#cart").modal("hide");
});

// Add product to cart
$(".add-to-cart").click(function (event) {
  event.preventDefault();
  const name = $(this).data("name");
  const price = Number($(this).data("price"));
  const imgSrc = $(this).data("image");
  const brand = $(this).data("brand");
  shoppingCart.addItemToCart(name, price, 1, imgSrc, brand);
  displayCart();
});

// Clear all items in the cart
$(".clear-cart").click(function () {
  shoppingCart.clearCart();
  displayCart();
});

// function to display cart item(s)
function displayCart() {
  const cartArray = shoppingCart.listCart();
  let output = "";
  for (i in cartArray) {
    output += `<tr>
    <td>
        <div class="d-flex align-items-center">
            <img
            src="./images/${cartArray[i].imgSrc}"
            alt="${cartArray[i].imgSrc}"
            style="width: 45px; height: 45px"
            class="rounded-circle"
            />
            <div class="ms-3">
                <p class="fw-bold mb-1">${cartArray[i].name}</p>
                <p class="text-muted mb-0">${cartArray[i].brand}</p>
            </div>
      </div>
    </td>
    <td class='align-items-center'>
        <input type='number' class='item-count form-control' min=1 data-name='${cartArray[i].name}' value='${cartArray[i].count}'>
    </td>
    <td>
        <a class='delete-item text-danger' data-name='${cartArray[i].name}'>
            <i class="fas fa-trash fa-2x"></i>
        </a>
    </td>
    <td class='fs-5'>R ${cartArray[i].total}</td> 
    </tr>`;
  }
  $(".show-cart").html(output);
  $(".total-cart").html(shoppingCart.totalCart().toFixed(2));
  $(".total-count").html(shoppingCart.totalCount());
}

// Delete cart item
$(".show-cart").on("click", ".delete-item", function (event) {
  const name = $(this).data("name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
});

// Quantity decrement
$(".show-cart").on("click", ".minus-item", function (event) {
  const name = $(this).data("name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});

// Quantity increment
$(".show-cart").on("click", ".plus-item", function (event) {
  const name = $(this).data("name");
  shoppingCart.addItemToCart(name);
  displayCart();
});

// Item count input
$(".show-cart").on("change", ".item-count", function (event) {
  const name = $(this).data("name");
  const count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
