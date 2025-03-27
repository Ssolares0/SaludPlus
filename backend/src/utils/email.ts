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