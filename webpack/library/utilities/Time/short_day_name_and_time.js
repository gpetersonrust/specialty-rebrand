export default function  (inputString) {
    // Create a new Date object from the input string
    const date = new Date(inputString);
  
    // Define options for formatting the date
    const options = { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
  
    // Format the date to a string with the desired format
    const formattedDate = date.toLocaleString('en-US', options);
  
    // Return the formatted date string
    return formattedDate;
  }