
# test_email.py

from agents.email_agent import fetch_unread_emails

files = fetch_unread_emails()

print(files)