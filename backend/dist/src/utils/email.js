"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCancellationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendCancellationEmail = async (patientEmail, appointmentDate, cancellationReason, doctor_name, messageApology) => {
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
    }
    catch (error) {
        console.error('Error al enviar correo:', error);
        throw new Error('No se pudo enviar la notificación');
    }
};
exports.sendCancellationEmail = sendCancellationEmail;
