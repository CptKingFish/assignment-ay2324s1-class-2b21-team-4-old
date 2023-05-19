window.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Only have 1 form in this HTML
    form.onsubmit = function (e) {
        e.preventDefault(); // prevent using the default submit behavior

        const code = form.querySelector('fieldset input[name=code]').value;
        const name = form.querySelector('fieldset input[name=name]').value;
        const credit = form.querySelector('fieldset input[name=credit]').value;

        const allInput = form.querySelectorAll('input, button[type=submit]');
        // Disable inputs
        allInput.forEach((input) => {
            input.disabled = true;
        });
        return fetch('/modules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                name: name,
                credit: credit,
            }),
        })
            .then(function (response) {
                // If not successful (i.e. there's error)
                if (response.status !== 201) return response.json(); // parse body as JSON string

                // Clear inputs
                allInput.forEach((input) => {
                    if (input.type !== 'submit') input.value = '';
                });

                alert(`Module "${code}" created!`);
                // Success response has no body, hence next .then() will be null

                return null;
            })
            .then(function (body) {
                if (!body) return; // If successfully created, body will be empty
                alert(body.error); // else there's an error
            })
            .finally(function () {
                // Enable inputs
                allInput.forEach((input) => {
                    input.disabled = false;
                });
            });
    };
});
