const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const sql = require('mssql');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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


app.post('/verificarData',async(req,res) =>{
    console.log('payload recibido: ',req.body);
    const{email,contraseña} = req.body;
    try{
        const pool = await sql.connect(config);

        const correoResult = await pool.request()
        .input('email',sql.VarChar, email)
        .query(' SELECT COUNT (*) AS count FROM Clientes WHERE email = @email ');
        const correoExiste = correoResult.recordset[0].count >0;
        
        
        console.log('parametros pasados a SQL',{
            correo: email,
            pass: contraseña
        });

        let contraseñaExiste = false;
        if(correoExiste){
            const passResult = await pool.request()
            .input('email',sql.VarChar,email)
            .input('pass', sql.VarChar, contraseña)
            .query(' SELECT COUNT (*) AS count FROM Clientes WHERE email = @email AND contraseña = @pass');

            contraseñaExiste = passResult.recordset[0].count >0;
            console.log(" Resultado de la comprobacion de contraseña: ",contraseñaExiste);
        }

        return res.status(200).json({correoExiste,contraseñaExiste});


    }catch (err) {
      console.error('Error verificando datos', err);
      return res.status(500).json({ message: 'Error en servidor verificando datos.' });
    }


})

app.post('/enviar-comprobante',async(req,res)=>{
    const { email } = req.body;  // Obtener email del cuerpo de la solicitud
    if (!email) {
        return res.status(400).json({ message: 'Correo electrónico no proporcionado' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,  // Usar variable de entorno
            pass: process.env.GMAIL_PASS   // Usar variable de entorno
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,  // Correo del remitente
        to: email,                     // Correo del destinatario
        subject: 'Comprobante de Compra',
        html: `
            <h2>Comprobante de Compra</h2>
            <p>Gracias por tu compra.</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Estado:</strong> Completado</p>
            <p>Si tienes alguna pregunta, contáctanos en <a href="mailto:${process.env.GMAIL_USER}">${process.env.GMAIL_USER}</a>.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado a:', email);
        res.status(200).json({ message: 'Comprobante enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar correo:', error.message);
        res.status(500).json({ message: `Error al enviar el comprobante: ${error.message}` });
    }
})



app.get('/enviar-comprobante', (req, res) => {
    res.status(405).json({ message: 'Método no permitido. Use POST para enviar comprobante.' });
});



app.use((req, res) => {
    console.log('Ruta no encontrada:', req.url); 
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const port = 3000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});



