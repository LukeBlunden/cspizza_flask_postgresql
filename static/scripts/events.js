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

function checkBoxHandler(e) {
  e.preventDefault();
  const box = e.target.children[0];
  box.checked = !box.checked;
  console.log(box.checked)
  box.checked == false ? e.target.style.backgroundColor = "initial" : e.target.style.backgroundColor = "#f9cc9d";
  // e.target.style.backgroundColor = "#9df9cc"
}

const stepperBtns = document.querySelectorAll(".stepper-button");
for (let button of stepperBtns) {
  button.addEventListener("click", stepperHandler);
}

const addCartBtns = document.querySelectorAll(".add-cart");
for (let button of addCartBtns) {
  button.addEventListener("click", addCartHandler);
}

const checkBoxLabels = document.querySelectorAll(".checkbox-label");
for (let label of checkBoxLabels) {
  label.addEventListener("click", checkBoxHandler);
}

const dropdownButton = document.querySelector(".dropdown-button");
if (dropdownButton) {
  dropdownButton.addEventListener("click", () => {
    const content = document.querySelector(".dropdown-content");
    content.style.display === "none" || !content.style.display ? content.style.display = "flex" : content.style.display = "none";
  })
}

const cartDropdownButton = document.querySelector(".cart-dropdown-button");
if (cartDropdownButton) {
  cartDropdownButton.addEventListener("click", (e) => {
    const button = e.target;
    button.src === `${window.location.protocol}//${window.location.host}/static/assets/pizza.png` ? button.src = `${window.location.protocol}//${window.location.host}/static/assets/pizzaopen.png` : button.src = `${window.location.protocol}//${window.location.host}/static/assets/pizza.png`;
    const cartContent = document.querySelector("#cart-container");
    cartContent.style.display === "none" || !cartContent.style.display ? cartContent.style.display = "block" : cartContent.style.display = "none";
  })
}