import { Router } from 'express';
import path from 'path';
import EmailService from '../services/email.service.js';
import { __dirname } from '../utils/utils.js';

const router = Router();

router.post('/send', async (req, res) => {
  const { nombre, apellido, mail, mensaje, archivo } = req.body;

  const emailService = EmailService.getInstance();

  // Configurar el asunto y el cuerpo del correo
  const subject = 'Nuevo mensaje de contacto';
  const html = `
  <h2>HOLA TE SALUDO DESDE EL PROYECTO DE CODERHOUSE</h2>
    <p>Mi nombre es <strong>${nombre} ${apellido}</strong></p>
    <p>Quiero darte el siguiente mensaje: <strong>${mensaje}</strong></p>
  `;

  const attachments = archivo && archivo.name ? [{ path: path.join(__dirname, './images/HELLO.gif', archivo.name) }] : [];

  try {
    // Enviar el correo electrónico
    await emailService.sendEmail(mail, subject, html, attachments);
    res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

    
export default router;
