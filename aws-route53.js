module.exports = function (RED) {
    "use strict";
    const Route53 = require("nice-route53");

    function AWSRoute53Node(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        var credentials = RED.nodes.getNode(config.creds);
        const accessKeyId = credentials? credentials.aws_access_key : null;
        const secretAccessKey = credentials? credentials.aws_secret_key : null;
        const r53 = new Route53({
            accessKeyId,
            secretAccessKey
        });
        node.on('input', function (msg) {
            const defaultHandler = function (err, res) {
                if (err) {
                    node.send([null, err]);
                } else {
                    msg.payload = res;
                    node.send(msg);
                }
            };
            const args = msg.payload;
            const method = msg.topic || config.method;
            switch (method) {
                case "zones":
                    r53.zones(defaultHandler);
                    break;
                case "createZone":
                    r53.createZone(args, defaultHandler);
                    break;
                case "zoneInfo":
                    r53.zoneInfo(args, defaultHandler);
                    break;
                case "records":
                    r53.records(args, defaultHandler);
                    break;
                case "setRecord":
                    r53.setRecord(args, defaultHandler);
                    break;
                case "delRecord":
                    r53.delRecord(args, defaultHandler);
                    break;
                case "getChange":
                    r53.getChange(args, defaultHandler);
                    break;
                case "pollChangeUntilInSync":
                    r53.pollChangeUntilInSync(args, defaultHandler);
                    break;
                default:
                    node.send([null, "Method '" + method + "' not implemented"]);
                    break;
            }
            return msg;
        });
    }
    RED.nodes.registerType("aws-route53", AWSRoute53Node);
};
