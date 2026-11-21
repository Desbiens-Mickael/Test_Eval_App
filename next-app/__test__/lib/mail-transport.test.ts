import { getMailTransportOptions } from "@/lib/mail-transport";

describe("getMailTransportOptions", () => {
  it("utilise MailHog en dev quand SMTP_HOST vaut « mailhog »", () => {
    const options = getMailTransportOptions({
      NODE_ENV: "development",
      SMTP_HOST: "mailhog",
      MAILHOG_HOST: "localhost",
    });
    expect(options).toMatchObject({ kind: "mailhog", host: "localhost", port: 1025, secure: false });
  });

  it("utilise MailHog en dev quand SMTP_HOST est vide", () => {
    expect(getMailTransportOptions({ NODE_ENV: "development" })).toMatchObject({
      kind: "mailhog",
      host: "mailhog",
    });
  });

  it("envoie de vrais e-mails en dev quand un serveur SMTP est renseigné", () => {
    const options = getMailTransportOptions({
      NODE_ENV: "development",
      SMTP_HOST: "smtp.exemple.com",
      SMTP_PORT: "465",
      SMTP_USER: "contact@exemple.com",
      SMTP_PASS: "secret",
    });
    expect(options).toMatchObject({
      kind: "smtp",
      host: "smtp.exemple.com",
      port: 465,
      secure: true,
      auth: { user: "contact@exemple.com", pass: "secret" },
    });
  });

  it("passe en STARTTLS sur le port 587", () => {
    const options = getMailTransportOptions({
      NODE_ENV: "development",
      SMTP_HOST: "smtp.exemple.com",
      SMTP_PORT: "587",
    });
    expect(options).toMatchObject({ port: 587, secure: false });
  });

  it("n'utilise jamais MailHog en production", () => {
    const options = getMailTransportOptions({
      NODE_ENV: "production",
      SMTP_HOST: "smtp.exemple.com",
    });
    expect(options).toMatchObject({ kind: "smtp", port: 465, secure: true });
  });
});
