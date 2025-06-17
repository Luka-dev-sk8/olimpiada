const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const sql = require('mssql');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../public')));


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✔ Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('❌ Error en la conexión con SQL Server:', err);
    });

module.exports = {
    sql, poolPromise
};

app.post('/insertData', async (req, res) =>{
    console.log(">>req.body",req.body);
    const{nombre,email,contraseña} = req.body;

    try{
        let pool = await sql.connect(config);

        let result = await pool.request()
        .input('email', sql.VarChar,email)
        .query("SELECT COUNT (*) AS count FROM Clientes WHERE email = @email");
        console.log('registros con ese correo',result.recordset[0].count);

        if(result.recordset[0].count >0){
            return res.status(400).json({message: 'el correo ya esta registrado'
            });
        }

        await pool.request()
        .input('email', sql.VarChar, email)
        .input('contraseña',sql.VarChar,contraseña)
        .input('nombre',sql.VarChar, nombre)
        .query("INSERT INTO Clientes (nombre,contraseña,email) VALUES (@nombre,@contraseña,@email)");

        res.status(200).json({message: 'datos insertados con exito'});
    }catch  (err) {
    console.error('❌ Error insertando datos:', err.message);
    res.status(500).json({ message: `Error insertando datos: ${err.message}` });
}

});


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

        let mensajeTexto = `Gracias por su compra. Detalles del pedido #${pedido_id}:\n\n`;
        detalles.forEach(d => {
            mensajeTexto += `Producto ${d.producto_id}: ${d.cantidad} x $${d.precio_unitario}\n`;
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Comprobante de compra - Pedido #${pedido_id}`,
            text: mensajeTexto
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('❌ Error al enviar correo:', error);
                return res.status(500).send('Error al enviar el correo');
            }

            await pool.request()
                .input('pedido_id', pedido_id)
                .input('email_cliente', email)
                .input('email_empresa', process.env.GMAIL_USER)
                .query(`
                    INSERT INTO Correos (pedido_id, email_cliente, email_empresa)
                    VALUES (@pedido_id, @email_cliente, @email_empresa)
                `);

            console.log('✔ Correo enviado:', info.response);
            res.send('Correo enviado correctamente');
        });

    } catch (err) {
        console.error('❌ Error en el proceso:', err);
        res.status(500).send('Error en el servidor');
    }
});


app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
});



