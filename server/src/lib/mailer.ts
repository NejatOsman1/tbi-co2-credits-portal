import { EmailClient } from "@azure/communication-email";

const connectionString = process.env.ACS_CONNECTION_STRING;
const senderAddress = process.env.ACS_SENDER_ADDRESS;

// Mail is optional at boot: without it the app still runs, only the
// wachtwoord-vergeten flow is unavailable. That keeps local development and
// the existing deployment working until the ACS settings are in place.
const client = connectionString ? new EmailClient(connectionString) : null;

export const mailEnabled = Boolean(client && senderAddress);

export async function sendPasswordResetMail(to: string, resetUrl: string): Promise<void> {
  if (!client || !senderAddress) {
    throw new Error("ACS_CONNECTION_STRING and ACS_SENDER_ADDRESS must be set to send mail");
  }

  const poller = await client.beginSend({
    senderAddress,
    recipients: { to: [{ address: to }] },
    content: {
      subject: "Wachtwoord opnieuw instellen - TBI CO2 Credits Portal",
      plainText:
        `Je hebt een nieuw wachtwoord aangevraagd voor de TBI CO2 Credits Portal.\n\n` +
        `Open onderstaande link om een nieuw wachtwoord in te stellen. De link is 1 uur geldig.\n\n` +
        `${resetUrl}\n\n` +
        `Heb je dit niet aangevraagd? Dan hoef je niets te doen; je wachtwoord blijft ongewijzigd.`,
      html:
        `<p>Je hebt een nieuw wachtwoord aangevraagd voor de TBI CO2 Credits Portal.</p>` +
        `<p>Klik op onderstaande link om een nieuw wachtwoord in te stellen. De link is 1 uur geldig.</p>` +
        `<p><a href="${resetUrl}">Nieuw wachtwoord instellen</a></p>` +
        `<p>Heb je dit niet aangevraagd? Dan hoef je niets te doen; je wachtwoord blijft ongewijzigd.</p>`,
    },
  });

  await poller.pollUntilDone();
}
