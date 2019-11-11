import requests
import base64
import json
import time

# 方式1 订阅链接
SUB_URL = ""
FILE_PATH = ""

response = requests.get(url=SUB_URL)
content = response.content.decode("utf-8")

all = base64.b64decode(content).decode("utf-8")
arr = all.split('vmess://')

ret = "#%s\n" % (time.asctime( time.localtime(time.time()) ))
for ele in arr:
    json_str = base64.b64decode(ele).decode("utf-8")
    if len(json_str) != 0 :    
        dict = json.loads(json_str)
        str = "%s = vmess, %s, %s, username=%s, tfo=true, tls=%s\n" % (dict["ps"], dict["add"], dict["port"], dict["id"], "true" if dict["tls"] == "tls" else "false")
        ret += str

with open(FILE_PATH, 'wt') as f:
    f.write(ret)
    f.close()