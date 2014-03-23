#requires https://pypi.python.org/pypi/websocket-client/
import json,os,sys,getpass
from ChatExchange.SEChatWrapper import *
from flask import Flask
app = Flask(__name__)

if("ChatExchangeU" in os.environ):
  username=os.environ["ChatExchangeU"]
else:
  print "Username: "
  username=raw_input()
if("ChatExchangeP" in os.environ):
  password=os.environ["ChatExchangeP"]
else:
  password=getpass.getpass("Password: ")

@app.route("/post/<text>")
def post(text):
  wrap=SEChatWrapper("SE")
  wrap.login(username,password)
  s="[ [SmokeDetector](https://github.com/Charcoal-SE/SmokeDetector) ] %s" % text 
  print s
  wrap.sendMessage("11540",s)
  import time
  time.sleep(5)
  print "Posted"

if __name__ == "__main__":
    app.run(host= "0.0.0.0")
