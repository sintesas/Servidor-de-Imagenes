const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');

let mainWindow;
let backgroundWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL('http://localhost:3000');
  childProcess.exec('start http://localhost:3000');

  const expressApp = express();

  expressApp.get('/', (req, res) => {
    res.send('SERVIDOR DE TARJETAS DE MANEJO CORRIENDO');
  });
  expressApp.get('/fotos/:nombreFoto', (req, res) => {
    const nombreFoto = req.params.nombreFoto;
    const rutaUnidadZ = 'Z:/';
    const rutaUnidadY = 'Y:/';
    const rutaCompletaZ = path.join(rutaUnidadZ, nombreFoto);
    const rutaCompletaY = path.join(rutaUnidadY, nombreFoto);
  
    // Intenta cargar la imagen desde la ruta en Z
    if (fs.existsSync(rutaCompletaZ)) {
      res.header('Content-Type', 'image/jpeg');
      res.sendFile(rutaCompletaZ);
    } else {
      // Si la imagen no se encuentra en Z, intenta cargarla desde la ruta en Y
      if (fs.existsSync(rutaCompletaY)) {
        res.header('Content-Type', 'image/jpeg');
        res.sendFile(rutaCompletaY);
      } else {
        // Si la imagen no se encuentra en ninguna de las rutas, puedes enviar una respuesta 404
        res.status(404).send('Imagen no encontrada en ninguna unidad');
      }
    }
  });

  expressApp.listen(3000, () => {
    console.log('Servidor Express en funcionamiento en el puerto 3000');
  });

  // Manejo personalizado para el evento de cierre de la ventana principal
  mainWindow.on('closed', () => {
    mainWindow = null;
    // Crea una nueva ventana oculta que mantendrá la aplicación en ejecución
    backgroundWindow = new BrowserWindow({ show: false });
  });

  // Manejo personalizado para el evento de cierre de todas las ventanas
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
