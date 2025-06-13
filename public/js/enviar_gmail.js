const express = require('express')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true}))

app.use(express.static(path.join(__dirname, 'public')));

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'serminosaxel@gmail.com',
        pass: 'sykj dqag zosh ixko'  // contraseña de aplicaciones, autogenerada por gmail
    }
});

app.post('/enviar-correo', (req, res) => {
    const email = req.body.email;
    const subject = 'Comprobante de compra';
    const text = 'Gracias por su compra. Aquí está su comprobante.';
    
    let mailOptions = {
        from: 'serminosaxel@gmail.com',
        to: email,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error: ', error);
            res.send('Error al enviar el correo');
        } else {
            console.log('Correo enviado: ' + info.response);
            res.send('Correo enviado');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});