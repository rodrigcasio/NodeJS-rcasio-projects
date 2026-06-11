'use strict';


/**
 * Returns a list of Greetings
 * Returns greetings in different languages
 *
 * no response value expected for this operation
 **/
exports.greetingsGET = function() {
  return new Promise(function(resolve, reject) {

    let hellos = {
      "English": "hello",
      "Hindi": "namastey",
      "Spanish": "hola",
      "French": "bonjour",
      "German": "guten tag",
      "Italian": "salve",
      "Chinese": "nǐn hǎo",
      "Portuguese": "olá",
      "Arabic": "asalaam alaikum",
      "Japanese": "konnichiwa",
      "Korean": "anyoung haseyo",
      "Russian": "Zdravstvuyte"
    }

    resolve(hellos);
  });
}

