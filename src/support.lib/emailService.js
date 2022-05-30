const emailService = function(config, nodemailer) {
    this.nodemailer = nodemailer;

    this.smtpSettings = {
        host : config.host,
        port : config.port || 587,
        username : config.username,
        password : config.password,
        protocol : config.protocol || "smtps",
    };

    //create our connection
    this.transport = this.nodemailer.createTransport({
        pool : true,
        host : this.smtpSettings.host,
        port : this.smtpSettings.port,
        secure : this.smtpSettings.protocol === "smtps",
        auth : {
            user : this.smtpSettings.username,
            pass : this.smtpSettings.password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    this.transport.verify((err) => {
        if (err) {
            console.error(err);
            console.error("Error connecting to smtp service! Emails will not be sent.");
        } else {
            console.log("Connection to SMTP server is good, emails can be sent.");
        }
    });
};

emailService.prototype.sendEmail = function(from, to, subject, html, attachments) {
    return new Promise((resolve, reject) => {
        this.transport.sendMail({
            from : from,
            to : to,
            subject : subject,
            html : html,
            attachments : attachments
        }, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
};

module.exports = function(config, nodemailer) {
    if (!nodemailer) {
        nodemailer = require("nodemailer");
    }

    return new emailService(config, nodemailer);
};