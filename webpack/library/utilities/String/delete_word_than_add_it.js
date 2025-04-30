function delete_word_by_word_than_add_new_word(text_to_animate, sentences) {
  // Get the text content of the text_to_animate element
  let text = text_to_animate.textContent;
  // Split the text into an array of characters
  let text_array = text.split('');
  // Set up an interval to delete the text word by word
  let interval = setInterval(() => {
    // If the text array has more than 0 elements, remove the last element and update the text content of the text_to_animate element
    if (text_array.length > 0) {
      text_array.pop();
      text_to_animate.textContent = text_array.join('');
    } else {
      // Stop deleting words and choose a random sentence to add word by word
      clearInterval(interval);
      let random_sentence =
        sentences[Math.floor(Math.random() * sentences.length)];
      add_word_by_word(text_to_animate, random_sentence);
    }
  }, 50);
}

export default delete_word_by_word_than_add_new_word;