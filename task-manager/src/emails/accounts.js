const from = 'kushagra.garg@yopmail.com'
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from,
        subject: 'Congratulations',
        text: `Hey! ${name}, Welcome to task manager. Start creating your todos.`
    })
}

const goodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from,
        subject: 'Too soon for a goodbye',
        text: `${name}, you are a very valuable member of our family. It's hard to say goodbye but still hope to see you soon.` 
    })
}


module.exports = {
    sendWelcomeEmail,
    goodByeEmail
}