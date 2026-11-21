/**
 * Envoie un e-mail d'essai avec la configuration du .env, pour vérifier
 * qu'un vrai serveur SMTP fonctionne avant de faire tester l'application.
 *
 *   npm run mail:test -- destinataire@exemple.com
 */
import "dotenv/config";
import nodemailer from "nodemailer";
import { getMailTransportOptions } from "../../lib/mail-transport";

const to = process.argv[2];
if (!to) {
  console.error("Usage : npm run mail:test -- destinataire@exemple.com");
  process.exit(1);
}

const { kind, ...options } = getMailTransportOptions(process.env);
const baseUrl = process.env.NEXT_BASE_URL;

(async () => {
  console.log(
    kind === "mailhog"
      ? "Serveur : MailHog (l'e-mail n'arrivera pas dans une vraie boîte)"
      : `Serveur : ${options.host}:${options.port}`
  );
  const transporter = nodemailer.createTransport(options);
  await transporter.verify();
  await transporter.sendMail({
    from: process.env.MAILER_FROM_ADDRESS,
    to,
    subject: "EduCraft : e-mail d'essai",
    html: `<p>Si vous lisez ce message, l'envoi d'e-mails fonctionne.</p>
<p>Les liens des e-mails pointeront vers <a href="${baseUrl}">${baseUrl}</a> :
ouvrez-le depuis un autre appareil pour vérifier qu'il est joignable.</p>`,
  });
  console.log(`E-mail envoyé à ${to}.`);
})().catch((error) => {
  console.error("Échec de l'envoi :", error instanceof Error ? error.message : error);
  process.exit(1);
});
