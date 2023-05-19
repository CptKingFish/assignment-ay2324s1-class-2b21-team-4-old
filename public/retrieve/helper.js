/* eslint-disable no-unused-vars */

function addToTable(code, name, credit) {
    // Read more about HTML template here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
    const template = document.querySelector('#row-template');
    const row = template.content.firstElementChild.cloneNode(true);

    row.querySelector('.code').textContent = code;
    row.querySelector('.name').textContent = name;
    row.querySelector('.credit').textContent = credit;

    const removeCell = row.querySelector('.remove');
    if (removeCell) {
        const removeButton = removeCell.querySelector('button');
        removeButton.onclick = function () {
            row.parentNode.removeChild(row);
        };
    }

    document.querySelector('#module-tbody').appendChild(row);
}
