import nodemailer from "nodemailer";
import { capitalize } from "./utils";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAILER_FROM_ADDRESS,
  MAILER_TO_ADDRESS,
  NODE_ENV,
  NEXT_BASE_URL,
} = process.env;

let transporter: nodemailer.Transporter;

if (NODE_ENV === "production") {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT as unknown as number,
    secure: true, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  // Pour le dev sous Docker
  transporter = nodemailer.createTransport({
    host: "mailhog",
    port: 1025,
    secure: false,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${NEXT_BASE_URL}/auth/new-verification?token=${token}`;

  try {
    await transporter.sendMail({
      from: MAILER_FROM_ADDRESS, // L'adresse d'envoi
      to: email, // Le destinataire
      subject: "Comfirmez votre email",
      html: `<p>Cliquez sur le lien pour <a href=${confirmLink}>confirmer votre adresse email<a> .<p>`,
    });
  } catch (error) {
    throw new Error("Echec lors de l'envoi de l'email.");
  }
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const confirmLink = `${NEXT_BASE_URL}/auth/new-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: MAILER_FROM_ADDRESS, // L'adresse d'envoi
      to: email, // Le destinataire
      subject: "Modification du mot de passe",
      html: `<p>Cliquez sur le lien pour <a href=${confirmLink}>modifier votre mot de passe<a> .<p>`,
    });
  } catch (error) {
    throw new Error("Echec lors de l'envoi de l'email.");
  }
}

export async function sendResetEmail(email: string, token: string) {
  const confirmLink = `${NEXT_BASE_URL}/auth/reset-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: MAILER_FROM_ADDRESS, // L'adresse d'envoi
      to: email, // Le destinataire
      subject: "Modification de l'adresse email",
      html: `<p>Cliquez sur le lien pour <a href=${confirmLink}>modifier votre adresse email<a> .<p>`,
    });
  } catch (error) {
    throw new Error("Echec lors de l'envoi de l'email.");
  }
}

export async function sendTwoFactorCodeEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: MAILER_FROM_ADDRESS, // L'adresse d'envoi
      to: email, // Le destinataire
      subject: "Double authentification",
      html: `<p>Votre code pour la double authentification: ${code}<p>`,
    });
  } catch (error) {
    throw new Error("Echec lors de l'envoi de l'email.");
  }
}

export async function sendCredentialStudentEmail(
  destinationEmail: string,
  firstname: string,
  lastname: string,
  identifier: string,
  password: string
) {
  try {
    await transporter.sendMail({
      from: MAILER_FROM_ADDRESS, // L'adresse d'envoi
      to: destinationEmail, // Le destinataire
      subject: `Identifiant et mot de passe pour l'élève : ${capitalize(
        firstname
      )} ${capitalize(lastname)}`,
      html: `<p>Identifiant: ${identifier}<br>Mot de passe: ${password}</p>`,
    });
  } catch (error) {
    throw new Error("Echec lors de l'envoi de l'email.");
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c
  );

/** Identifiants des élèves créés par un import, envoyés au professeur */
export async function sendImportedStudentsCredentialsEmail(
  destinationEmail: string,
  students: { name: string; identifier: string; password: string; group: string | null }[]
) {
  const rows = students
    .map(
      (s) =>
        `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.group ?? "")}</td>` +
        `<td><code>${escapeHtml(s.identifier)}</code></td><td><code>${escapeHtml(s.password)}</code></td></tr>`
    )
    .join("");
  try {
    await transporter.sendMail({
      from: MAILER_FROM_ADDRESS,
      to: destinationEmail,
      subject:
        students.length > 1
          ? `Identifiants de ${students.length} nouveaux élèves`
          : "Identifiants d'un nouvel élève",
      html:
        `<p>Voici les identifiants des élèves que vous venez d'importer :</p>` +
        `<table border="1" cellpadding="6" cellspacing="0">` +
        `<thead><tr><th>Élève</th><th>Groupe</th><th>Identifiant</th><th>Mot de passe</th></tr></thead>` +
        `<tbody>${rows}</tbody></table>`,
    });
  } catch (error) {
    throw new Error("Echec lors de l'envoi de l'email.");
  }
}
