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
                title: "蓝岸已支持 Quantumult-X 节点订阅（方式4）",
                message: "",
                actions: [
                    // {
                    //     title: "Quantumult-X",
                    //     handler: function() {
                    //         dealForQX(resp);
                    //     }
                    // },
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
        if (element.length != 0) {
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
                (json.tls == "tls" ? ",obfs=over-tls" : "") +
                ",tag=" +
                json.ps +
                "\n";
            ret += node;
        }
    }

    createQXConfig(ret);
}

function dealForSurge(resp) {
    let ret = "";
    let nodesName = "\n\nlanan = select, ";

    let str = $text.base64Decode(resp.data);
    let nodes = str.split("vmess://");

    for (let index = 0; index < nodes.length; index++) {
        let element = nodes[index];
        if (element.length != 0) {
            let json = JSON.parse($text.base64Decode(element));
            // chacha20-ietf-poly1305
            $console.info(json);
            let node =
                json.ps +
                " = vmess, " +
                json.add +
                ", " +
                json.port +
                ", username=" +
                json.id +
                ", tls=" +
                (json.tls == "tls" ? "true" : "false") +
                "\n";
            ret += node;
            nodesName += json.ps + ", ";
        }
    }

    ret += "\n\n[Proxy Group]\n" + nodesName;

    createSurgeConfig(ret);
}

function createSurgeConfig(str) {
    var conf = $file.read("assets/Config.conf");
    $console.info(conf.string);
    var ret = conf.string.replace("[PLACEHOLDER]", str);
    $share.sheet(["Surge3.conf", $data({ string: ret })]);
}

function createQXConfig(str) {
    var conf = $file.read("assets/Quantumult_X.conf");
    $console.info(conf.string);
    var ret = conf.string.replace("[PLACEHOLDER]", str);
    $share.sheet(["quantumult_x.conf", $data({ string: ret })]);
}

module.exports = {
    getData: getData,
}