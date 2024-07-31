const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000; 
const rutaUnidadZ = 'Z:/'; // Ruta a tu unidad de red (unidad Z)

app.get('/fotos/:nombreFoto', (req, res) => {
  const nombreFoto = req.params.nombreFoto;
  const rutaCompleta = path.join(rutaUnidadZ, nombreFoto);

  fs.stat(rutaCompleta, (err, stats) => {
    if (err) {
      res.status(404).send('No se pudo encontrar la foto');
    } else if (stats.isFile()) {
      res.header('Content-Type', 'image/jpeg'); // Ajusta el tipo MIME según el formato de tus fotos
      const fileStream = fs.createReadStream(rutaCompleta);
      fileStream.pipe(res);
    } else {
      res.status(404).send('No se pudo encontrar la foto');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
