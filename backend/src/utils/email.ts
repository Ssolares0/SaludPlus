import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendCancellationEmail = async (
  patientEmail: string,
  appointmentDate: Date,
  cancellationReason: string,
  doctor_name: string,
  messageApology: string 
) => {
  try {
    const formattedDate = new Date(appointmentDate).toLocaleString('es-GT', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const mailOptions = {
      from: `"SaludPlus" <${process.env.EMAIL_FROM}>`,
      to: patientEmail,
      subject: 'Cancelación de Cita Médica',
      html: `
        <h2>Su cita ha sido cancelada</h2>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Razón:</strong> ${cancellationReason}</p>
        <p>${messageApology}</p>
        <hr>
        <p>Saludos,<br>Dr. ${doctor_name}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', patientEmail);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar la notificación');
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  try{
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verifica tu correo</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <img src="https://s3.us-east-1.amazonaws.com/aydf1.1/fotos/favicon.png" alt="Logo SaludPlus"style="display: block; width: 150px; margin: 0 auto;"  width="135" height="110">
            <h2>Verifica tu correo electrónico</h2>
            <p>Gracias por registrarte. Por favor, introduce el siguiente código para verificar tu cuenta:</p>
            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; font-size: 24px; text-align: center; margin: 20px 0;">
              ${token}
            </div>
            <p>Si no solicitaste este código, ignora este correo.</p>
          </div>
          <p style="font-size: 12px; color: #666;">
            SaludPlus © 2025 - 123 Calle Principal, Guatemala, Guatemala
          </p>
      </body>
      </html>
    `;

    transporter.sendMail({
      from: `"SaludPlus" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verifica tu correo electrónico',
      text:`Tu código de verificación es: ${token}`,
      html: htmlContent,
    });
  } catch(error:any){
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar correo verificacion');
  }
 
};