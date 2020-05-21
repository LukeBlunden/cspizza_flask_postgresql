const makeMoney = (number) => `$${number.toFixed(2)}`;

function stepperHandler(e) {
  if (e.target.innerText === "+") {
    const prevEl = e.target.previousElementSibling;
    prevEl.children[0].value++;
  } else {
    const nextEl = e.target.nextElementSibling;
    if (nextEl.children[0].value > 0) nextEl.children[0].value--;
  }
}

function setCartTotal(number) {
  const totalEl = document.querySelector("#cart-total-price");
  const totalInput = document.querySelector("#totalPriceInput");
  let total = parseFloat(totalEl.dataset.price);
  total += parseFloat(number);
  totalEl.dataset.price = totalInput.value = total;
  totalEl.innerText = makeMoney(total);
}

function addCartHandler(e) {
  // Get values
  const { pizzaName, price } = e.target.dataset;
  const quantity = e.target.previousElementSibling.children[1].children[0];

  if (parseInt(quantity.value) === 0) return;

  const cart = document.querySelector("#cart-items");
  // Check if item already exists
  for (let item of cart.children) {
    if (
      item.querySelector("#itemName") &&
      item.querySelector("#itemName").innerText === pizzaName
    ) {
      // Update the cart items quantity and price
      const newQuantity =
        parseFloat(item.querySelector("#itemQuantity").innerText) +
        parseFloat(quantity.value);
      item.querySelector("#itemQuantity").innerText = newQuantity;
      item.querySelector("#itemPrice").innerText = makeMoney(
        newQuantity * parseFloat(price)
        );
      // Update form input values
      item.querySelector("#itemQuantityInput").value = newQuantity;
      item.querySelector("#itemPriceInput").value = newQuantity * parseFloat(price);
      // Update cart total and reset stepper count
      setCartTotal(parseFloat(quantity.value) * parseFloat(price));
      quantity.value = "0";
      return;
    }
  }

  // Create item from template
  const itemTemplate = document.getElementById("cart-item-template");
  const itemContent = itemTemplate.content;
  const itemName = itemContent.getElementById("itemName");
  const itemQuantity = itemContent.getElementById("itemQuantity");
  const itemPrice = itemContent.getElementById("itemPrice");

  // Get form fields
  const itemNameInput = itemContent.getElementById("itemNameInput");
  const itemQuantityInput = itemContent.getElementById("itemQuantityInput");
  const itemPriceInput = itemContent.getElementById("itemPriceInput");

  // Set template values and form input values
  itemName.innerText = itemNameInput.value = pizzaName;
  itemQuantity.innerText = itemQuantityInput.value = quantity.value;
  itemPrice.innerText = makeMoney(
    parseFloat(quantity.value) * parseFloat(price)
  );
  itemPriceInput.value = parseFloat(quantity.value) * parseFloat(price);

  // Clone template and append into cart
  const contentClone = document.importNode(itemContent, true);
  cart.appendChild(contentClone);
  // Set cart total price and reset stepper count
  setCartTotal(parseFloat(quantity.value) * parseFloat(price));
  quantity.value = "0";
}

const stepperBtns = document.querySelectorAll(".stepper-button");
for (let button of stepperBtns) {
  button.addEventListener("click", stepperHandler);
}

const addCartBtns = document.querySelectorAll(".add-cart");
for (let button of addCartBtns) {
  button.addEventListener("click", addCartHandler);
}