window.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Only have 1 form in this HTML
    form.onsubmit = function (e) {
        e.preventDefault(); // prevent using the default submit behavior

        const code = form.querySelector('input[name=code]').value;
        const credit = form.querySelector('input[name=credit]').value;

        // TODO: Implement update Module credit by Code
    };
});
