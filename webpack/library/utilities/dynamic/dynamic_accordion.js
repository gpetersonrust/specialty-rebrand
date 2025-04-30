/**
 * This function creates an accordion effect on a set of elements.
 * @param {string} parentQuery - The selector for the parent elements.
 * @param {string} targetQuery - The selector for the target elements.
 * @param {string} eventType - The type of event to listen for ('hover' or 'click').
 * @param {string} classToAdd - The class to add to the target container when it is expanded.
 */
function dynamicAccordion(parentQuery, targetQuery, eventType, classToAdd) {
  // Select all parent elements with the specified selector
  let parentElements = document.querySelectorAll(parentQuery);
  // Loop through each parent element
  for (const parent of parentElements) {
    // Find the target element inside the parent element using the specified selector
    let target = parent.querySelector(targetQuery);
    // Get the parent element of the target element
    let targetContainer = target.parentElement;

    // If the target element has a height, set it to 0
    if (target?.style?.height) {
      target.style.height = 0;
    }

    // Add event listeners based on the specified event type
    if (eventType == 'hover') {
      parent.addEventListener('mouseenter', growAccordion);
      parent.addEventListener('mouseleave', shrinkAccordion);
    } else if (eventType == 'click') {
      parent.addEventListener('click', () => {
        if (target.style.height == 0) {
          growAccordion();
        } else {
          shrinkAccordion();
        }
      });
    }

    // Function to grow the accordion
    function growAccordion() {
      // Get the height of the target element
      let targetBox = target.getBoundingClientRect();
      let targetHeight = targetBox.height;
      // Set the maximum height of the target container to the height of the target element
      targetContainer.style.maxHeight = `${targetHeight}px`;
      // Add the specified class to the target container
      targetContainer.classList.add(classToAdd);
    }

    // Function to shrink the accordion
    function shrinkAccordion() {
      // Wait for 500 milliseconds before removing the specified class from the target container and setting its maximum height to 0
      setTimeout(() => {
        targetContainer.classList.remove(classToAdd);
        targetContainer.style.maxHeight = 0;
      }, 500);
    }
  }
}


export default dynamicAccordion;