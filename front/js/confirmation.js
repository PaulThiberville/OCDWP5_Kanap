import { getParams } from "./utils.js";
import { deleteCart, getCart } from "./services/cartService.js";
import { postOrder } from "./services/productsService.js";

const orderIdElement = document.getElementById("orderId"); //orderId element
const awaitedUrlParams = ["firstName", "lastName", "address", "city", "email"];
const params = getParams(); // url params

// Call the async function Init() on load
(async () => {
  await init();
})();

/**
 * Call functions to try to order if contact from UrlsParams and products from cart are valid then display orderId
 */
async function init() {
  if (awaitedUrlParamsExist() === true) {
    const contact = getContact();
    const products = getProducts();
    if (isOrderValid(contact, products)) {
      const response = await postOrder(contact, products);
      orderIdElement.textContent = response.orderId;
      deleteCart();
      return;
    }
  }

  //If contact doesn't exist, is not valid or cart is empty, redirecting user to index page
  window.alert(
    "Une erreure s'est produite. Vous allez être redirigé vers la page d'accueil"
  );
  window.location.href = "/front/html/index.html";
}

/**
 * Check if url contain awaited contact parameters to process order
 * * return false if at least one of these parameters doesn't exist in UrlParams
 * @returns { boolean }
 */
function awaitedUrlParamsExist() {
  let theyAllExist = true;
  awaitedUrlParams.forEach((value) => {
    if (!params[value]) {
      theyAllExist = false;
    }
  });
  return theyAllExist;
}

/**
 * Create and return contact object for order request based on the value of each url param named like each awaitedUrlParams
 * @returns {Object}
 */
function getContact() {
  let contact = {};
  awaitedUrlParams.forEach((value) => {
    contact[value] = params[value];
  });
  return contact;
}

/**
 * Create and return products array for order request based on cart saved in localStorage;
 * @return { Object }
 */
function getProducts() {
  const cart = getCart();
  let products = [];
  cart.forEach((product) => {
    for (let i = 0; i < product.quantity; i++) {
      products.push(product.product._id);
    }
  });
  return products;
}

/**
 * Return true if order is valid
 * @param { Object } _contact
 * @param { Array } _products
 * @returns { Boolean }
 */
function isOrderValid(_contact, _products) {
  let isValid = true;
  if (!_products[0]) {
    isValid = false;
  }
  const stringRegex = new RegExp(
    "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
  );
  const stringAndNumbersRegex = new RegExp(
    "^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
  );
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  if (!_contact.firstName.match(stringRegex)) {
    isValid = false;
  }
  if (!_contact.lastName.match(stringRegex)) {
    isValid = false;
  }
  if (!_contact.address.match(stringAndNumbersRegex)) {
    isValid = false;
  }
  if (!_contact.city.match(stringAndNumbersRegex)) {
    isValid = false;
  }
  if (!_contact.email.match(emailRegex)) {
    isValid = false;
  }
  return isValid;
}
