const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Por si necesitás usar JSON

const { poolPromise } = require('./conexionDB'); // Conexión SQL Server

// Configurar transporte de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Ruta POST para enviar el correo
app.post('/enviar-correo', async (req, res) => {
    const { email, pedido_id } = req.body;

    if (!email || !pedido_id) {
        return res.status(400).send('Faltan datos');
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('pedido_id', pedido_id)
            .query(`
                SELECT p.fecha_pedido, d.producto_id, d.cantidad, d.precio_unitario
                FROM Pedidos p
                JOIN DetallePedido d ON p.id = d.pedido_id
                WHERE p.id = @pedido_id
            `);

        const detalles = result.recordset;

        if (detalles.length === 0) {
            return res.status(404).send('Pedido no encontrado');
        }

        // Armar cuerpo del mensaje
        let mensajeTexto = `Gracias por su compra. Detalles del pedido #${pedido_id}:\n\n`;
        detalles.forEach(d => {
            mensajeTexto += `Producto ${d.producto_id}: ${d.cantidad} x $${d.precio_unitario}\n`;
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Comprobante de compra - Pedido #${pedido_id}`,
            text: mensajeTexto
        };

        // Enviar correo
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error al enviar correo:', error);
                return res.status(500).send('Error al enviar el correo');
            }

            // Registrar en la tabla Correos
            await pool.request()
                .input('pedido_id', pedido_id)
                .input('email_cliente', email)
                .input('email_empresa', process.env.GMAIL_USER)
                .query(`
                    INSERT INTO Correos (pedido_id, email_cliente, email_empresa)
                    VALUES (@pedido_id, @email_cliente, @email_empresa)
                `);

            console.log('Correo enviado:', info.response);
            res.send('Correo enviado correctamente');
        });

    } catch (err) {
        console.error('Error en el proceso:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
