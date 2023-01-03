const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'raveena.nathani6090@gmail.com',
        subject: 'Thank you for joining in!',
        text: `Welcome to the application ${name}`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'raveena.nathani6090@gmail.com',
        subject: 'Sorry to see you go !',
        text: `Goodbye ${name}. Hope to see you soon!!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
