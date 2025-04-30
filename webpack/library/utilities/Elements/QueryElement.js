/**
 * This function is used to select elements. And it can be used to select multiple elements or a single element.
 * It also adds an el() function to the element(s) that can be used to add event listeners.
 * 
 * @param {string} selector 
 * @param {boolean} single 
 * @returns 
 */

function $(selector, single = false) {
  // If the selector starts with a period, use querySelectorAll if single is false, or use querySelector if single is true
  // If the selector starts with a hash, use getElementById
  // If neither a period nor a hash is found, return an error
  let element;
  if (!selector.includes('.') && !selector.includes('#')) {
    throw new Error('Selector must contain . or #');
  }
  switch (selector[0]) {
    case '.':
      if (single) {
        element = document.querySelector(selector);
      } else {
        element = document.querySelectorAll(selector);
      }
      break;
    case '#':
      element = document.getElementById(selector.slice(1));
      break;
    default:
      if (single) {
        element = document.querySelector(selector);
      } else {
        element = document.querySelectorAll(selector);
      }
      break;
  }
  // Add the el() function to the element and return it
  element.el = el;
  return element;
}

function el(eventListener, cb) {
  let element = this;
  // Check if the element exists
  if (!element) {
    throw new Error('Element does not exist');
  }
  // Check if eventListener is a string
  if (typeof eventListener !== 'string') {
    throw new Error('Event listener must be a string');
  }
  // Check if cb is a function
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function');
  }
  // Check if eventListener is a valid event
  if (!element[eventListener]) {
    throw new Error('Event listener must be a valid event');
  }
  // Add the event listener to the element and return it
  return element.addEventListener(eventListener, cb);
}

// Export the $() function and the el() function as an object
export default {
  $,
};
