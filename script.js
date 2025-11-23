const accentMap = {
  'a': ['à', 'â', 'ä', 'æ'],
  'e': ['é', 'è', 'ê', 'ë'],
  'i': ['î', 'ï'],
  'o': ['ô', 'œ'],
  'u': ['ù', 'û', 'ü'],
  'c': ['ç']
};

let awaitingLetter = false;
let activePopup = null;

document.addEventListener("keydown", function (e) {
  // Block typing when popup is active
  if (activePopup && !e.ctrlKey) {
    e.preventDefault();
  }

  if (e.ctrlKey && e.code === "Space") {
    e.preventDefault();

    let existing = document.getElementById("accent-popup");
    if (existing) {
      existing.remove();
      activePopup = null;
      awaitingLetter = false;
      return;
    }

    let popup = document.createElement("div");
    popup.id = "accent-popup";
    popup.textContent = "Press a letter (a, e, i, o, u, c)";
    document.body.appendChild(popup);

    activePopup = popup;
    awaitingLetter = true;
  } else if (awaitingLetter) {
    let firstPopup = document.getElementById("accent-popup");
    if (firstPopup && accentMap[e.key.toLowerCase()]) {
      firstPopup.textContent = "";
      let letters = accentMap[e.key.toLowerCase()];
      
      let row = document.createElement('div');
      row.className = 'accent-row';

      letters.forEach((letter, index) => {
        let option = document.createElement('span');
        option.className = 'accent-option';
        option.textContent = `${index + 1}: ${letter}`;
        row.appendChild(option);
      });

      firstPopup.appendChild(row);
      awaitingLetter = false;
      activePopup.letters = letters;
    }
  } else if (activePopup && activePopup.letters) {
    // If 1-4 is pressed, insert corresponding letter in focused input
    let num = parseInt(e.key);
    if (!isNaN(num) && num >= 1 && num <= activePopup.letters.length) {
      let letter = activePopup.letters[num - 1];
      let target = document.activeElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'PLACEHOLDER' || target.isContentEditable) {
        let start = target.selectionStart;
        let end = target.selectionEnd;
        let value = target.value || target.innerText;

        let newValue = value.slice(0, start) + letter + value.slice(end);
        if (target.value !== undefined) {
          target.value = newValue;
        } else {
          target.innerText = newValue;
        }
        target.selectionStart = target.selectionEnd = start + 1;
      }
      activePopup.remove();
      activePopup = null;
    }
  }
});
