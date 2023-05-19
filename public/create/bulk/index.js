const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomWord(length) {
    let word = '';
    for (let i = 0; i < length; i += 1) {
        word += characters[randomInt(0, characters.length)];
    }
    return word;
}

function randomModule() {
    const code = randomWord(6);
    const name = code;
    const credit = randomInt(2, 7);
    return { code, name, credit };
}

function addNewEntry() {
    const template = document.querySelector('#input-template');
    const fieldset = template.content.firstElementChild.cloneNode(true);

    const module = randomModule();
    fieldset.querySelector('input[name=code]').value = module.code;
    fieldset.querySelector('input[name=name]').value = module.name;
    fieldset.querySelector('input[name=credit]').value = module.credit;

    const fieldSetContainer = document.querySelector('#fieldset-container');
    fieldSetContainer.appendChild(fieldset);
}

window.addEventListener('DOMContentLoaded', function () {
    addNewEntry();

    const addRowButton = document.querySelector('#add-row');
    // TODO: onclick of addRowButton, call the addNewEntry function
    addRowButton.onclick = function () {
        addNewEntry();
        return false;
    };

    const form = document.querySelector('form'); // Only have 1 form in this HTML
    form.onsubmit = function (e) {
        e.preventDefault(); // prevent using the default submit behavior

        const allFieldset = form.querySelectorAll('fieldset');

        const body = [];
        allFieldset.forEach(function (fieldset) {
            const code = fieldset.querySelector('input[name=code]').value;
            const name = fieldset.querySelector('input[name=name]').value;
            const credit = fieldset.querySelector('input[name=credit]').value;

            // Push code, name, and credit in an array (in that order) into body
        });

        // TODO send body to backend to perform bulk insert
    };
});
