import { SMTPServer } from "smtp-server";
import dotenv from "dotenv";


dotenv.config();


const server = new SMTPServer(
{
  // Authenticate the client
  onAuth(auth, session, callback)
  {
    const { username, password } = auth;

    if (username === 'testuser' && password === 'password123') callback(null, { user: username });
    else callback(new Error('Authentication failed'));
  },

  // Handle received emails
  onData(stream, session, callback)
  {
    let emailData = '';

    stream.on('data', (chunk) => emailData += chunk.toString());
    stream.on('end', () => {
      console.log('Received email:', emailData);
      callback(null); // signal that email was successfully processed
    });
  },

  // log server activity (optional)
  onConnect(session, callback) {
    console.log('Client connected:', session.remoteAddress);
    callback(); // allow the connection
  },
});


const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`SMTP server is running on port ${PORT}`));


