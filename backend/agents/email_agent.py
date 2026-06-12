from config.settings import EMAIL_ID, EMAIL_PASSWORD
import imaplib
import email
import os

IMAP_SERVER = "imap.gmail.com"
print("EMAIL =", repr(EMAIL_ID))
print("PASSWORD =", repr(EMAIL_PASSWORD))

def fetch_unread_emails():

    mail = imaplib.IMAP4_SSL(
        IMAP_SERVER
    )

    mail.login(
        EMAIL_ID,
        EMAIL_PASSWORD
    )

    mail.select("inbox")

    status, messages = mail.search(
        None,
        '(UNSEEN)'
    )

    mail_ids = messages[0].split()

    attachments = []

    for mail_id in mail_ids:

        _, msg_data = mail.fetch(
            mail_id,
            "(RFC822)"
        )

        raw_email = msg_data[0][1]

        msg = email.message_from_bytes(
            raw_email
        )

        for part in msg.walk():

            filename = part.get_filename()

            if filename:

                filepath = os.path.join(
                    "uploads",
                    filename
                )

                with open(
                    filepath,
                    "wb"
                ) as f:

                    f.write(
                        part.get_payload(
                            decode=True
                        )
                    )

                attachments.append(
                    filepath
                )

    mail.logout()

    return attachments