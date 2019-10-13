function getData() {
  if ($app.env == $env.app) {
    $ui.loading("加载中...");
  }
  $http.get({
    url: $cache.get("url"),
    handler: function(resp) {
      if ($app.env == $env.app) {
        $ui.loading(false);
      }

      $ui.alert({
        title: "请选择导出为哪种格式",
        message: "",
        actions: [
          {
            title: "Quantumult-X",
            handler: function() {
              dealForQX(resp);
            }
          },
          {
            title: "Surge 4",
            handler: function() {
              dealForSurge(resp);
            }
          },
          {
            title: "取消",
            handler: function() {}
          }
        ]
      });
    }
  });
}

function dealForQX(resp) {
  let ret = "";

  let str = $text.base64Decode(resp.data);
  let nodes = str.split("vmess://");

  for (let index = 0; index < nodes.length; index++) {
    let element = nodes[index];
    if (element.length == 0) {
    } else {
      let json = JSON.parse($text.base64Decode(element));
      // chacha20-ietf-poly1305
      let node =
        "vmess=" +
        json.add +
        ":" +
        json.port +
        ",method=" +
        json.type +
        ",password=" +
        json.id +
        ",tag=" +
        json.ps +
        "\n";
      ret += node;
    }
  }

  $clipboard.copy({
    text: ret
  });

  $ui.alert({
    title: "已复制到您的剪切板中，请到您的配置文件相应位置黏贴"
  });
}

function dealForSurge(resp) {
  let ret = "";
  let nodesName = "\n\nlanan = select, ";

  let str = $text.base64Decode(resp.data);
  let nodes = str.split("vmess://");

  for (let index = 0; index < nodes.length; index++) {
    let element = nodes[index];
    if (element.length == 0) {
    } else {
      let json = JSON.parse($text.base64Decode(element));
      // chacha20-ietf-poly1305
      let node =
        json.ps +
        " = vmess, " +
        json.add +
        ", " +
        json.port +
        ", username=" +
        json.id +
        "\n";
      ret += node;
      nodesName += json.ps + ", ";
    }
  }

  ret += "\n\n" + nodesName;

  $clipboard.copy({
    text: ret
  });

  $ui.alert({
    title:
      "已复制到您的剪切板中，请到您的配置文件相应位置黏贴，将最后一行调整到合适的位置"
  });
}

if ($cache.get("url") == null) {
  $input.text({
    type: $kbType.ascii,
    placeholder: "方式1订阅地址",
    handler: function(text) {
      $cache.set("url", text);
      getData();
    }
  });
} else {
  getData();
}
