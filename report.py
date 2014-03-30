#requires https://pypi.python.org/pypi/websocket-client/
import json,os,sys,getpass
from ChatExchange.SEChatWrapper import *

#wrap=SEChatWrapper("MSO")
wrap=SEChatWrapper("SE")
wrap.login(sys.argv[2],sys.argv[3])
s="\[[Blaze](https://github.com/Charcoal-SE/Blaze)] %s" % sys.argv[1] 
print s
wrap.sendMessage("11540",s)
#wrap.sendMessage("89",s)
import time
time.sleep(5)
