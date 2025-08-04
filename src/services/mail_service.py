# file: src/services/mail_service.py

from flask_mail import Mail, Message
from flask import current_app
import logging

mail = Mail()

USER = "phamleduybao070805@gmail.com"
APP_PASSWORD = "xftihhyudrgodybt"
SMTPHOST = "smtp.gmail.com"
SMTPPORT = 465

def init_mail_config():
    current_app.config.update(
        MAIL_SERVER=SMTPHOST,
        MAIL_PORT=SMTPPORT,
        MAIL_USE_TLS=False,
        MAIL_USE_SSL=True,
        MAIL_USERNAME=USER,
        MAIL_PASSWORD=APP_PASSWORD,
        MAIL_DEFAULT_SENDER=USER,
    )
    mail.init_app(current_app)

def send_mail(send_to, subject="Sent using Mail Sender", content="Test Email"):
    if USER is None or APP_PASSWORD is None:
        logging.error("USER and APP_PASSWORD must be configured first.")
        return False
    try:
        msg = Message(subject, recipients=[send_to], html=content)
        mail.send(msg)
        logging.info(f"Mail sent successfully to {send_to} from {USER}!")
        return True
    except Exception as e:
        logging.error(f"Failed to send mail: {e}")
        return False
