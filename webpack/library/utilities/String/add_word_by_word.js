function add_word_by_word(text_to_animate, sentence) {
  //  split the sentence into an arry of characters

  let text_array = sentence.split('');
  let interval = setInterval(() => {
    if (text_array.length > 0) {
      text_to_animate.textContent += text_array.shift();
    } else {
      clearInterval(interval);
      setTimeout(() => {
        delete_word_by_word_than_add_new_word(text_to_animate, sentences);
      }, 2000);
    }
  }, 100);
}
