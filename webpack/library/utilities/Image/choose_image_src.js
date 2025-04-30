function choose_image_src() {
  var img = document.querySelector('.img-fit');
  var sizes = JSON.parse(img.getAttribute('data-image_sizes'));
  var width = window.innerWidth;
  var src;

  if (width >= sizes.large_desktop && sizes.large_desktop) {
    src = img.getAttribute('data-large-desktop');
  } else if (width >= sizes.small_desktop && sizes.small_desktop) {
    src = img.getAttribute('data-small-desktop');
  } else if (width >= sizes.tablet && sizes.tablet) {
    src = img.getAttribute('data-tablet');
  } else if (sizes.mobile) {
    src = img.getAttribute('data-mobile');
  } else {
    src = img.getAttribute('src');
  }

  img.setAttribute('src', src);
}
