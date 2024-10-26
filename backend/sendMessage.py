import smtplib, ssl
from email import encoders
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
import getpass

def send_message(sender, receiver, name):

  message = MIMEMultipart("alternative")
  message["Subject"] = f"Hi {name}, here's your summary for the week!"
  message["From"] = sender
  message["To"] = receiver

  # modify and add summary
  html = """\
  <html>
    <body>
      <p>Hi</p>
      <img src="./database/sample/sample.png">
    </body>
  </html>
  """

  content = MIMEText(html, "html")
  message.attach(content)
  """
  with open("./database/sample/sample.png", 'rb') as f:
    image = MIMEImage(f.read())
    message.attach(image)"""

  smtp_port = 465587
 
  password = getpass.getpass("Enter your password: ")

  server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
  server.login(sender, password)
  server.sendmail(sender, receiver, message)
  server.close()


# Replace by details of people
sender = "my@gmail.com"
receiver = sender
name = "Name"

send_message(sender, receiver, name)