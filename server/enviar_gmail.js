const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Verificación  - imprimí para confirmar que se lee bien
console.log('Usuario:', process.env.GMAIL_USER);
console.log('Clave cargada:', process.env.GMAIL_PASS ? '✅' : '❌');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/enviar-correo', (req, res) => {
    const email = req.body.email;
    if (!email || !email.includes('@')) {
        return res.status(400).send('Correo inválido');
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Comprobante de compra',
        text: 'Gracias por su compra. Aquí está su comprobante.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar:', error);
            return res.status(500).send('Error al enviar el correo');
        }
        console.log('Correo enviado:', info.response);
        res.send('Correo enviado correctamente');
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
