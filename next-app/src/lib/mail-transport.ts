import type SMTPTransport from "nodemailer/lib/smtp-transport";

type MailEnv = {
  NODE_ENV?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  MAILHOG_HOST?: string;
};

/**
 * Choix du serveur d'envoi :
 * - en production, toujours le vrai serveur SMTP ;
 * - en dev, MailHog tant que SMTP_HOST est vide ou vaut « mailhog » ;
 *   renseigner un vrai serveur (ex. celui de l'hébergeur) envoie de vrais e-mails,
 *   utile pour faire tester l'application en local.
 */
export const getMailTransportOptions = (
  env: MailEnv
): SMTPTransport.Options & { kind: "mailhog" | "smtp" } => {
  const host = env.SMTP_HOST?.trim();
  const useMailhog =
    env.NODE_ENV !== "production" && (!host || host === "mailhog");

  if (useMailhog) {
    return {
      kind: "mailhog",
      // MAILHOG_HOST=localhost quand Next tourne hors Docker
      host: env.MAILHOG_HOST ?? "mailhog",
      port: 1025,
      secure: false,
    };
  }

  const port = Number(env.SMTP_PORT) || 465;
  return {
    kind: "smtp",
    host,
    port,
    // 465 : TLS direct ; 587 et autres : STARTTLS
    secure: port === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  };
};
