const express = require('express')
const app = express()
app.use(express.json())

// READ
app.get('/users', (req, res) => {
    res.send('hello');
});

// CREATE
app.post('/users', (req, res) => {
    const { body, validationResult } = require('express-validator')

    const validateUsername = [
        body('username')
        .trim()
        .isLength({ min: 3, max: 20}).withMessage('Username must be 3-20 characters')
        .matches(/^[a-Za-Z0-9]+$/).withMessage('Only letters, numbers, and underscores allowed'),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username } = req.body;
            res.send('Welcome, ${username}');
        }
    ]
})