import weighting from './weighting.js'
import './sass/style.sass';

// This projekt is for a german commiunity, so all comments are german.

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const consonants = "BCDFGHJKLMNPQRSTVXZß"; // alle deutschen Konsonanten
/**
 * Überprüft ob der übergebene Buchstabe ein Konsonant ist.
 * @param {String} char
 * @return {Bollean} is consanant
 */
let isConsonant = (char) => {
  if (char.length > 1) {
    throw 'given parameter is not a single char';
  }
  consonants.includes(char);
}

let showError = (msg) => {
  output.innerHTML = msg;

  // setzt Klasse "false" um den output mittels css zu stylen
  output.classList.add(false);
}

let calc_eTIN = function(evt) {
  /**
   * Gibt den eTIN über p#output aus.
   */

  // prevent reload
  evt.preventDefault();

  // der angegebene Name
  let [lastname, firstname, bday, output] = [
    document.getElementById("lastname").value.trim().toUpperCase(), // der angegebene Name
    document.getElementById("name").value.trim().toUpperCase(), // der angegebene Vorname
    document.getElementById("bday").value.trim(), // das angegebene Geburtsdatum
    document.getElementById("output") // die Ausgabe
  ];

  // Falls vorhanden wird Klasse "false" entfernt
  output.classList.remove(false);

  // Falls eines der auszufüllenden Felder nicht ausgefüllt ist,
  // wird der Nutzer darauf hingewiesen alle auszufüllen.
  if (!(lastname && firstname && bday)) {
    showError("Bitte fülle ALLE Felder aus.");
    return null;
  };

  // Falls ein Buchstabe nicht im Alphabet enthalten ist, Error anzeigen.
  let knowChars = lastname.concat(firstname).split('').find( (char) => {
    if (!(alphabet.includes(char))) {
      showError(`Unbekannter Buchstabe angegeben. Bitte benutze nur
        ${alphabet.split('').join(', ')}. Ö, Ä und Ü werden zu OE, AE oder UE.`);
      return true;
    } else {
      return false;
    }
  });

  if (knowChars) {
    return false;
  }

  // Stellen 1-4 des eTIN
  let a = handle_name(lastname);
  // Stellen 4-8 des eTIN
  let b = handle_name(firstname);
  // Stellen j(9-10) m(11) t(12-13)
  let [j, m, t] = handle_bday(bday);
  // 14. Stelle des eTIN

  // Prüfziffer p
  let p = calc_p(a + b + j + m + t);
  // gib den eTIN über p#output aus
  document.getElementById("output").innerHTML = `${a} ${b} ${j} ${m} ${t} ${p}`;
  return false;
}

let handle_name = (name) => {
  /**
   * Berechnet die Stellen 1-4 4-8 mittels des Namens
   * @param {String} name
   * @return {String} Bestandteil des eTIN
   */

  let ret = "";
  // geht durch jeden Buchstaben im Namen
  for (let i = 0; i < name.length; i++) {
    let char = name[i];
    // Ist der Buchstabe ein Konsonant?
    if (isConsonant(char)) {
      // Falls der Buchstabe ein ß ist wird er zu SS umgewandelt.
      if (char === "ß") {
        char = "SS"
      }
      // Falls die nächste Buchstabenfolge SCH ist wird der Buchstabe auf Y gestzt
      // und die nächsten Buchstaben(CH) übersprungen.
      if (char === "S") {
        if (name[i + 1] == "C") {
          if (name[i + 2] == "H") {
            char = "Y";
            i += 2;
          }
        }
      }
      // füge zum Rückgabewert den Buchstaben hinzu
      ret += char;
      // Falls unser Rückgabewert groß genug ist, wird er zurückgegeben.
      if (ret.length >= 4) {
        return ret
      }
    }
  }
  // geht rückwärts durch jeden Buchstaben im Namen
  for (let i = name.length - 1; i >= 0; i--) {
    let char = name[i];
    // Ist der Buchstabe kein Konsonant, also ein Vokal?
    // dann füge zum Rückgabewert diesen Buchstaben hinzu
    if (!(isConsonant(char))) {
      ret += char;
    }
    // Falls unser Rückgabewert groß genug ist, wird er zurückgegeben.
    if (ret.length >= 4) {
      return ret;
    }
  }
  // Solange der Rückgabewert nicht großgenug ist, wird diesem ein X angehängt.
  while (ret.length < 4) {
    ret += "X";
  }
  return ret
}

let handle_bday = (date) => {
  /**
   * Berechnet die Stellen 9-10 11 12-13 mittels des Geburtsdatum
   * @param {String} date
   * @return {String} Bestandteil des eTIN
   */
  // extrahiere das Jahr, den Monat und den Tag aus dem Datum
  let [year, month, day] = date.split("-");
  // extrahiere aus dem Jahr die letzten zwei Ziffern
  year = year.slice(-2);
  // Der Buchstabe an der Stelle des Monats vom Alphabets.
  month = alphabet[parseInt(month, 10) - 1];
  return [year, month, day]
}

let calc_p = (eTIN) => {
  /**
   * Berechnet die letzte Stelle(Prüfziffer) mittels
   * des des bereits brechneten eTIN-Anfangs
   * @param {String} eTIN
   * @return {String} Prüfziffer
   */
  // die Gesammtgewichtung
  let weight = 0;
  // geht durch jede Stelle im eTIN
  for (let i = 0; i < eTIN.length; i++) {
    let char = eTIN[i];

    // Addiert die Gewichtung des aktuellen Buchstabens
    // an gerader / ungerader Stelle zur gesamten Gewichtung
    if (i % 2 == 1) {
      weight += weighting[char]["even"];
    } else {
      weight += weighting[char]["odd"];
    }
  }
  // gibt den Buchstaben aus dem Alphabet,
  // der an der Stelle des Rests der Gewichtung durch 26 steht
  return alphabet[weight % 26];
}

document.querySelector("#form").addEventListener('submit', calc_eTIN)
