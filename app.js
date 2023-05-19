const express = require('express');
const createHttpError = require('http-errors');

const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('./errors');
const modulesModel = require('./models/modules');

const app = express();
app.use(express.json()); // to process JSON in request body

app.use(express.static('public'));

app.post('/modules/table', function (req, res) {
    return modulesModel
        .initTable()
        .then(function () {
            return res.sendStatus(201);
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof TABLE_ALREADY_EXISTS_ERROR) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Unknown Error' });
        });
});

app.post('/modules', function (req, res) {
    const code = req.body.code;
    const name = req.body.name;
    const credit = req.body.credit;

    return modulesModel
        .create(code, name, credit)
        .then(function () {
            return res.sendStatus(201);
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof DUPLICATE_ENTRY_ERROR) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Unknown Error' });
        });
});

// Question: This needs to be before GET /modules/:code, why?
app.get('/modules/bulk', function (req, res) {
    const codesCsv = req.query.codes; // query parameters are strings
    const codes = codesCsv.split(',');
    return modulesModel
        .retrieveBulk(codes)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (error) {
            console.log(error);
            return res.status(500).json({ error: 'Unknown Error!' });
        });
});

app.get('/modules/:code', function (req, res) {
    const code = req.params.code;

    return modulesModel
        .retrieveByCode(code)
        .then(function (module) {
            return res.json({ module: module });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Unknown Error' });
        });
});

app.delete('/modules/:code', function (req, res) {
    // TODO: Implement Delete module by Code
});

app.put('/modules/:code', function (req, res) {
    // TODO: Implement Update module by Code
    //      You can decide where you want to put the Credit in the Request
});

app.get('/modules', function (req, res) {
    // TODO: Implement Get all modules
});

// 404 handler
app.use(function (req, res, next) {
    return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    return res.status(err.status || 500).json({ error: err.message || 'Unknown Server Error!' });
});

module.exports = app;
