/**
 * This function creates a Netflix-style slider with an infinite scroll effect.
 * @param {string} slideQuery - The selector for the slides.
 * @param {number} time - The time interval in milliseconds at which the slides should transition (default is 5000).
 */
function netflixDynamicSlider(slideQuery, time = 5000) {
  // Initialize an empty array to keep track of used slides
  let slides_used = [];

  // Select all the slides and add a data-slide_index attribute to each slide
  let slides = [...document.querySelectorAll(slideQuery)].map((slide, i) => {
    slide.setAttribute('data-slide_index', i);
    return slide;
  });

  // Initialize some variables
  let index;
  let activeSlide;
  let timer;

  // Define a function to transition to the next slide
  function nextSlide(num) {
    // Remove the active class from the current slide
    activeSlide && activeSlide.classList.remove('active');

    if (num) {
      // Transition to the slide with the specified index
      index = num;
      activeSlide = slides[index];
      activeSlide.classList.add('active');

      // Add the index to the slides_used array if it's not already there
      if (!slides_used.includes(num)) {
        slides_used.push(num);
      }

      return;
    }

    if (slides_used.length == slides.length) {
      // Reset the slides_used array if all slides have been used
      slides_used = [];
    }

    // Randomly select a slide that hasn't been used before
    let insideArray = true;
    while (insideArray) {
      index = Math.floor(Math.random() * slides.length);
      if (!slides_used.includes(index)) {
        slides_used.push(index);
        insideArray = false;
      }
    }

    // Transition to the selected slide
    activeSlide = slides[index];
    activeSlide.classList.add('active');
  }

  // Transition to the first slide and start the interval timer
  nextSlide();
  timer = setInterval(() => {
    nextSlide();
  }, time);

  // Add event listeners to each slide to pause and resume the interval timer
  for (const slide of slides) {
    slide.addEventListener('mouseenter', () => {
      clearInterval(timer);
      nextSlide(slide.getAttribute('data-slide_index'));
    });
    slide.addEventListener('mouseleave', () => {
      timer = setInterval(() => {
        nextSlide();
      }, time);
    });
  }
}

// export 
export default netflixDynamicSlider;