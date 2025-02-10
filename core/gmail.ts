import fs from 'fs';
import path from 'path';
import process from 'process';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';


// If modifying these scopes, delete token.json.
const SCOPES: string[] = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH: string = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH: string = path.join(process.cwd(), 'credentials.json');


async function loadSavedCredentialsIfExist()
{
  try {
    const content = fs.readFileSync(TOKEN_PATH, "utf8");
    return JSON.parse(content);

  } catch (err) { return null; }
}


async function saveCredentials(client: any) {
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: client.credentials.client_id,
    client_secret: client.credentials.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  fs.writeFileSync(TOKEN_PATH, payload);
}


async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (!client) {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
  }
  return google.gmail({ version: "v1", auth: client });
}

async function getEmails() {
  const gmail = await authorize();
  const res = await gmail.users.messages.list({ userId: "me", maxResults: 10 });

  if (!res.data.messages) {
    console.log("No emails found.");
    return;
  }

  for (const msg of res.data.messages) {
    const msgDetails = await gmail.users.messages.get({ userId: "me", id: msg.id! });
    console.log(`Email ID: ${msg.id}`);
    console.log(`Snippet: ${msgDetails.data.snippet}`);
    console.log("----------------------------------------");
  }
}


// ------------------------------------------------------------


export default function start()
{
  // authorize().then(listLabels).catch(console.error);

  getEmails().catch(console.error);
}






