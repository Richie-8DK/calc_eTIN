import './sass/style.sass';

alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
consonants = "BCDFGHJKLMNPQRSTVXZß"; // alle deutschen Konsonanten
/**
 * Überprüft ob der übergebene Buchstabe ein Konsonant ist.
 * @param {String} char
 * @return {Bollean} is consanant
 */
function isConsonant(char) {
  for (i in consonants) {
    i = consonants[i];
    if (i === char) {
      return true
    }
  }
  return false;
}

function calc_eTIN() {
  /**
   * Gibt den eTIN über p#output aus.
   */
  // der angegebene Name
  lastname = document.getElementById("lastname").value;
  // der angegebene Vorname
  firstname = document.getElementById("name").value;
  // das angegebene Geburtsdatum
  bday = document.getElementById("bday").value;
  // die Ausgabe
  output = document.getElementById("output");
  // Falls vorhanden wird Klasse "false" entfernt
  output.classList.remove(false);
  // Falls eines der auszufüllenden Felder nicht ausgefüllt ist,
  // wird der Nutzer darauf hingewiesen alle auszufüllen.
  if (!(lastname && firstname && bday)) {
    output.innerHTML = "Bitte fülle ALLE Felder aus."
    // setzt Klasse "false" um den output mittels css zu stylen
    output.classList.add(false)
    return null;
  }
  // Stellen 1-4 des eTIN
  a = handle_name(lastname);
  // Stellen 4-8 des eTIN
  b = handle_name(firstname);
  // Stellen j(9-10) m(11) t(12-13)
  [j, m, t] = handle_bday(bday);
  // 14. Stelle des eTIN
  p = calc_p(a + b + j + m + t);
  // gib den eTIN über p#output aus
  document.getElementById("output").innerHTML = a + " " + b + " " + j + " " + m + " " + t + " " + p;
}

function handle_name(name) {
  /**
   * Berechnet die Stellen 1-4 4-8 mittels des Namens
   * @param {String} name
   * @return {String} Bestandteil des eTIN
   */
  // Der Name wird zu Großbuchstaben umgewandelt, da Groß- und Kleinschreibung nicht beachtet werden soll.
  var name = name.toUpperCase();
  var ret = ""
  // geht durch jeden Buchstaben im Namen
  for (var i = 0; i < name.length; i++) {
    var char = name[i];
    // Ist der Buchstabe ein Konsonant?
    if (isConsonant(char)) {
      // Falls der Buchstabe ein ß ist wird er zu SS umgewandelt.
      if (char === "ß") {
        var char = "SS"
      }
      // Falls die nächste Buchstabenfolge SCH ist wird der Buchstabe auf Y gestzt
      // und die nächsten Buchstaben(CH) übersprungen.
      if (char === "S") {
        if (name[i + 1] == "C") {
          if (name[i + 2] == "H") {
            var char = "Y";
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
  for (var i = name.length - 1; i >= 0; i--) {
    var char = name[i];
    // Ist der Buchstabe kein Konsonant, also ein Vokal?
    // dann füge zum Rückgabewert den Buchstaben hinzu
    if (isConsonant(char) === false) {
      ret += char
    }
    // Falls unser Rückgabewert groß genug ist, wird er zurückgegeben.
    if (ret.length >= 4) {
      return ret
    }
  }
  // Solange der Rückgabewert nicht großgenug ist, wird diesem ein X angehängt.
  while (ret.length < 4) {
    ret += "X"
  }
  return ret
}

function handle_bday(date) {
  /**
   * Berechnet die Stellen 9-10 11 12-13 mittels des Geburtsdatum
   * @param {String} date
   * @return {String} Bestandteil des eTIN
   */
  // extrahiere das Jahr, den Monat und den Tag aus dem Datum
  var [year, month, day] = date.split("-");
  // extrahiere aus dem Jahr die letzten zwei Ziffern
  year = year.slice(-2);
  // Der Buchstabe an der Stelle des Monats vom Alphabets.
  month = alphabet[parseInt(month, 10) - 1];
  return [year, month, day]
}

function calc_p(eTIN) {
  /**
   * Berechnet die letzte Stelle(Prüfziffer) mittels des des bereits brechneten eTIN-Anfangs
   * @param {String} eTIN
   * @return {String} Prüfziffer
   */
  // die Gesammtgewichtung
  var severity = 0
  // geht durch jede Stelle im eTIN
  for (var i = 0; i < eTIN.length; i++) {
    var char = eTIN[i];
    // Befinden wir uns an einer geraden Stelle?
    if (i % 2 == 1) {
      var even = true
    } else {
      var even = false
    }
    // Sucht den Wert der Stelle in der folgenden Tabelle und fügt der Gesammtgewichtung in
    // Abhängigkeit ob die Stelle gerade ist die Gewichtung des Wertes hinzu.
    switch (char) {
      case "0":
      case "A":
        if (even) {
          severity += 0
        } else {
          severity += 1
        }
        break;
      case "1":
      case "B":
        if (even) {
          severity += 1
        } else {
          severity += 0
        }
        break;
      case "2":
      case "C":
        if (even) {
          severity += 2
        } else {
          severity += 5
        }
        break;
      case "3":
      case "D":
        if (even) {
          severity += 3
        } else {
          severity += 7
        }
        break;
      case "4":
      case "E":
        if (even) {
          severity += 4
        } else {
          severity += 9
        }
        break;
      case "5":
      case "F":
        if (even) {
          severity += 5
        } else {
          severity += 13
        }
        break;
      case "6":
      case "G":
        if (even) {
          severity += 6
        } else {
          severity += 15
        }
        break;
      case "7":
      case "H":
        if (even) {
          severity += 7
        } else {
          severity += 17
        }
        break;
      case "8":
      case "I":
        if (even) {
          severity += 8
        } else {
          severity += 19
        }
        break;
      case "9":
      case "J":
        if (even) {
          severity += 9
        } else {
          severity += 21
        }
        break;
      case "K":
        if (even) {
          severity += 10
        } else {
          severity += 2
        }
        break;
      case "L":
        if (even) {
          severity += 11
        } else {
          severity += 4
        }
        break;
      case "M":
        if (even) {
          severity += 12
        } else {
          severity += 18
        }
        break;
      case "N":
        if (even) {
          severity += 13
        } else {
          severity += 20
        }
        break;
      case "O":
        if (even) {
          severity += 14
        } else {
          severity += 11
        }
        break;
      case "P":
        if (even) {
          severity += 15
        } else {
          severity += 3
        }
        break;
      case "Q":
        if (even) {
          severity += 16
        } else {
          severity += 6
        }
        break;
      case "R":
        if (even) {
          severity += 17
        } else {
          severity += 8
        }
        break;
      case "S":
        if (even) {
          severity += 18
        } else {
          severity += 12
        }
        break;
      case "T":
        if (even) {
          severity += 19
        } else {
          severity += 14
        }
        break;
      case "U":
        if (even) {
          severity += 20
        } else {
          severity += 16
        }
        break;
      case "V":
        if (even) {
          severity += 21
        } else {
          severity += 10
        }
        break;
      case "W":
        if (even) {
          severity += 22
        } else {
          severity += 22
        }
        break;
      case "X":
        if (even) {
          severity += 23
        } else {
          severity += 23
        }
        break;
      case "Y":
        if (even) {
          severity += 24
        } else {
          severity += 24
        }
        break;
      case "Z":
        if (even) {
          severity += 25
        } else {
          severity += 25
        }
        break;
    }
  }
  // gibt den Buchstaben aus dem Alphabet der an der Stelle des Rests der Gewichtung durch 26 steht
  return alphabet[severity % 26];
}
