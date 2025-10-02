const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;


// ==================== ROUTE 1: Homepage ====================
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/contacts?properties=firstname,lastname,email';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { 
            title: 'Custom Objects Table', 
            data 
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('<h1>Error al obtener los registros de HubSpot</h1>');
    }
});


// ==================== ROUTE 2: Form to create/update custom object ====================
app.get('/update-contact', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// ==================== ROUTE: Handle form submission ====================
app.post('/update-contact', async (req, res) => {
    const { firstname, lastname, email } = req.body;

    const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const body = {
        properties: { firstname, lastname, email }
    };

    try {
        await axios.post(url, body, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('<h1>Error al crear el contacto en HubSpot</h1>');
    }

    
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
