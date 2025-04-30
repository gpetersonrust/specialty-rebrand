class TimeUtilityClass {
    convert_time_stated_to_milliseconds(time_stated) {
      const regex = /(\d+)\s*(year|day|hour|minute|second)s?/g;
      const matches = [...time_stated.matchAll(regex)];
 
      const factors = {
        year: 365 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
        second: 1000,
      };
      return matches.reduce((total, match) => {
        const [_, number, unit] = match;
        return total + number * factors[unit];
      }, 0);
    }
 
    convert_milliseconds_to_time_stated(milliseconds) {
    const factors = {
      year: 31536000000,
      day: 86400000,
      hour: 3600000,
      minute: 60000,
      second: 1000,
    };
    const time = {};
    for (const unit in factors) {
      time[unit] = Math.floor(milliseconds / factors[unit]);
      milliseconds %= factors[unit];
    }
    return time;
  }
 
  get_time_difference_in_milliseconds(date1, date2) {
   const difference_in_milliseconds =  date1 - date2;
   return difference_in_milliseconds;
 }
 
 statement_to_military_time(string){
     let time = string.split(' ');
     let time_of_day = time[1];
     let time_split = time[0].split(':');
     let hours = time_split[0];
     let minutes = time_split[1];
     let seconds = time_split[2];
     if(time_of_day === 'PM'){
         hours = parseInt(hours) + 12;
     }
     // if hours, seconds or minutes are undefined then set them to 0
     if(hours === undefined){
         hours = '00';
     }
     if(minutes === undefined){
         minutes = '00';
     }
     if(seconds === undefined){
         seconds = '00';
     }
           
     return `${hours}:${minutes}:${seconds}`;
 }
 
 militaryTimeToMilliseconds(militaryTime){
     let time_split = militaryTime.split(':');
     let hours = time_split[0];
     let minutes = time_split[1];
     let seconds = time_split[2];
     let total_milliseconds = 0;
     total_milliseconds += parseInt(hours) * 60 * 60 * 1000;
     total_milliseconds += parseInt(minutes) * 60 * 1000;
     total_milliseconds += parseInt(seconds) * 1000;
     return total_milliseconds;
 
 }
 
 is_time_between(first_time_span, second_time_span) {
   const [first_time_span_start, first_time_span_end] =
     first_time_span.split(' - ');
   const [second_time_span_start, second_time_span_end] =
     second_time_span.split(' - ');
   const [first_time_span_start_milliseconds, first_time_span_end_milliseconds] =
     [first_time_span_start, first_time_span_end].map((time) =>
       militaryTimeToMilliseconds(statement_to_military_time(time))
     );
   const [
     second_time_span_start_milliseconds,
     second_time_span_end_milliseconds,
   ] = [second_time_span_start, second_time_span_end].map((time) =>
     militaryTimeToMilliseconds(statement_to_military_time(time))
   );
   return (
     (second_time_span_start_milliseconds >=
       first_time_span_start_milliseconds &&
       second_time_span_start_milliseconds <=
         first_time_span_end_milliseconds) ||
     (second_time_span_end_milliseconds >= first_time_span_start_milliseconds &&
       second_time_span_end_milliseconds <= first_time_span_end_milliseconds) ||
     (first_time_span_start_milliseconds >=
       second_time_span_start_milliseconds &&
       first_time_span_start_milliseconds <=
         second_time_span_end_milliseconds) ||
     (first_time_span_end_milliseconds >= second_time_span_start_milliseconds &&
       first_time_span_end_milliseconds <= second_time_span_end_milliseconds)
   );
 }
  }