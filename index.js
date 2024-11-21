const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configura la conexión a la base de datos con el puerto correcto
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Edgar',
    password: '1234',
    database: 'test',
    port: 8080 // Cambia a tu puerto de MySQL actual (por ejemplo, 3307 si lo cambiaste en XAMPP)
});

// Conecta a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos');
  }
});

// Ruta de ejemplo para obtener datos ORDER INFO
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM OrderInfo ORDER BY Fecha ASC;', (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});
// Ruta de ejemplo para obtener datos ORDER PRODUCTION
app.get('/api/data2', (req, res) => {
  db.query(`
          SELECT p.Orden, 
            p.CantidadPrimeras, 
            p.CantidadSegundas, 
            p.CantidadPrimSeg, 
            p.CantidadTerceras, 
            p.CantidadCanceladas, 
            p.TotalPrimSegTerCan, 
            p.SumaIrregulares
      FROM OrderProduction p
      JOIN OrderInfo o ON o.Orden = p.Orden
      ORDER BY o.Fecha ASC;
    `, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

// Ruta de ejemplo para obtener datos ORDER irregulares
app.get('/api/data3', (req, res) => {
  db.query(`
    SELECT p.Orden, 
            p.FallaTela, 
            p.FallaProceso, 
            p.FallaTono, 
            p.SumTelaTono
      FROM OrderIrregularInfo p
      JOIN OrderInfo o ON o.Orden = p.Orden
      ORDER BY o.Fecha ASC;
    `, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

// ruta de update para la tabla Produccion
app.put('/api/UpdateProduction', (req, res) => {
  // Obtén los datos del cuerpo de la solicitud
  const { key, CantidadPrimeras, CantidadSegundas, CantidadPrimSeg, CantidadTerceras, CantidadCanceladas, TotalPrimSegTerCan, SumaIrregulares } = req.body;

  const query = `
    UPDATE OrderProduction 
    SET 
      CantidadPrimeras = ?, 
      CantidadSegundas = ?, 
      CantidadPrimSeg = ?, 
      CantidadTerceras = ?, 
      CantidadCanceladas = ?, 
      TotalPrimSegTerCan = ?, 
      SumaIrregulares = ?
    WHERE 
      Orden = ?`;

  db.query(query, [CantidadPrimeras, CantidadSegundas, CantidadPrimSeg, CantidadTerceras, CantidadCanceladas, TotalPrimSegTerCan, SumaIrregulares, key], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Actualización exitosa', results });
  });
});

// ruta de update para la tabla  de irregulares
app.put('/api/UpdateIrregularInfo', (req, res) => {
  // Obtén los datos del cuerpo de la solicitud
  const {key, FallaTela, FallaProceso, FallaTono,	SumTelaTono } = req.body;
  // Prepara la consulta SQL
  const query = `
    UPDATE OrderIrregularInfo 
    SET 
      FallaTela = ?, 
      FallaProceso = ?, 
      FallaTono = ?, 
      SumTelaTono = ?
    WHERE 
      Orden = ?`;
  // Ejecuta la consulta
  db.query(query, [FallaTela,	FallaProceso,	FallaTono,	SumTelaTono, key], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Actualización exitosa', results });
  });
});

app.post('/api/Insert', (req, res) => {
  const { Orden, Estilo, Descripcion, St, Fecha } = req.body;
  const query = `INSERT INTO OrderInfo (Orden, Estilo,Descripcion, St, Fecha) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [Orden, Estilo, Descripcion, St, Fecha], (err, result) => {
      if (err) {
          console.error('Error al insertar en la base de datos:', err); 
          return res.status(500).json({ error: 'Error en la base de datos', detalles: err });
      }
      res.json({ message: 'Inserción exitosa', result });
  });
});

app.put('/api/UpdateOrderInfo', (req, res) => {
  // Obtén los datos del cuerpo de la solicitud
  const {Orden, Estilo, Descripcion	, St,	 Fecha} = req.body;
  // Prepara la consulta SQL
  const query = `
    UPDATE OrderInfo 
    SET 
      Estilo = ?, 
      Descripcion = ?, 
      St = ?, 
      Fecha = ?
    WHERE 
      Orden = ?`;
  // Ejecuta la consulta
  db.query(query, [Estilo,	Descripcion,	St,	Fecha, Orden], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Actualización exitosa', results });
  });
});

/**
 * ESTA ZONA ES PARA LAS CONSULTAS DE LAS GRAFICAS DEL DASHBOARD
 */


// Inicia el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
