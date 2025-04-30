/**
 *  This function is used to d ynamically scroll through elements
 *  It takes in three parameters:
 * 
 * @param {string} el  - The selector of the elements to scroll through
 * @param {string} par 
 * @param {Int} interval - The selector of the parent element of the elements to scroll through
 * 
 * 
 */

function dynamicScroll(el, par, interval) {
  // Select all elements with the specified selector
  var elements = document.querySelectorAll(el);
  // Find the parent element of the first selected element with the specified selector
  var parent = elements[0].closest(par);
  // Get the gap between the elements
  let gap = window.getComputedStyle(parent).getPropertyValue('gap');
  // Extract the numerical value of the gap
  let gap_number = +gap.replace('px', '');
  // Get the bounding rectangle of the parent element
  let parentBox = parent.getBoundingClientRect();
  // Get the bounding rectangle of the first selected element
  let element_to_get_width = elements[0];
  let elementBox = element_to_get_width.getBoundingClientRect();
  // Extract the width of the first selected element
  let { width: width_to_multiply_by } = elementBox;
  // Initialize variables to keep track of how much the parent element should be moved and which elements have been on the screen
  let move_parent_by = 0;
  let been_on_screen = [];
  let tracker = 0;

  // Set up an interval that runs every specified number of milliseconds
  setInterval(() => {
    // Get the bounding rectangle of the last selected element
    var last_element = elements[elements.length - 1];
    var last_element_rect = last_element.getBoundingClientRect();

    // Loop through all selected elements and check if each element is on the screen
    for (var i = 0; i < elements.length; i++) {
      var rect = elements[i].getBoundingClientRect();
      if (rect.left >= parentBox.left && rect.right <= window.innerWidth) {
        // Increment the tracker variable if the element is on the screen
        tracker++;
      }
    }

    // If the last element is on the screen, reset the position of the parent element to its original position
    if (
      last_element_rect.left >= parentBox.left &&
      last_element_rect.right <= window.innerWidth
    ) {
      parent.style.transform = `translateX(0px)`;
      move_parent_by = 0;
    } else {
      // Calculate how much the parent element should be moved based on the width of the first element, the gap between the elements, and the number of elements that have been on the screen
      move_parent_by += (width_to_multiply_by + gap_number) * tracker;
      // Move the parent element by setting its transform property
      parent.style.transform = `translateX(-${move_parent_by}px)`;
    }
    // Reset the tracker variable to 0
    tracker = 0;
  }, interval);
}


export default dynamicScroll;