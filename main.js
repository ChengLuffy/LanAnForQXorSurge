let tool = require('scripts/tool')

if ($cache.get("url") == null) {
    $input.text({
        type: $kbType.ascii,
        placeholder: "方式1订阅地址",
        handler: function(text) {
            $cache.set("url", text);
            tool.getData();
        }
    });
} else {
    tool.getData();
}