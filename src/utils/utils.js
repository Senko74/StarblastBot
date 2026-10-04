const WebSockets = require("ws")


async function getGame(mode)
{
    const res = await fetch("https://starblast.io/simstatus.json")
    const serverData = await res.json()
    const server = await getBestServer(serverData)
    console.log("server", server)
    for(serv of serverData)
    {
        if(serv.address === server.ip && serv.systems.length !== 0)
        {
            console.log("found server")
            for(game of serv.systems)
            {
                if(game.mode === mode)
                {
                    return {
                        wsUrl : server.wsUrl,
                        gameId : game.id,
                        mode : game.mode
                    }
                }
            }
        }
    }
}

async function getBestServer(serverData)
{
    let servers = []
    for(server of serverData)
    {
        if(server.systems.length !== 0)
        {
            servers.push(await pingServer(server))
        }
    }
    
    const bestServer = getLessPingServer(servers)
    return servers[bestServer]
}

function getLessPingServer(serversData)
{
    let indexMinimum = 0
    for(let i = 0; i < serversData.length ; i++)
    {
        if(serversData[indexMinimum].ping > serversData[i].ping)
        {
            indexMinimum = i
        }
    }
    return indexMinimum
}

function pingServer(server)
{
    return new Promise((resolve,reject) =>
    {
        let dateSend = 0
        let dateReceived = 0
        const wsUrl = buildWsUrl(`${server.address}`)
        const socket = new WebSockets(
            wsUrl,
            {
                headers : 
                {
                    Origin : "starblast.io"
                }
            }
        )
        socket.on("open", () => 
        {
            dateSend = Date.now()
            socket.send("ping")
        })
        socket.on("message", (message) =>
        {
            if(message.toString() === "pong")
            {
                dateReceived = Date.now()
                socket.close()
                resolve({
                    ip : server.address,
                    wsUrl : wsUrl,
                    ping : dateReceived - dateSend
                    })
            }
        })
    })
    
}
function buildWsUrl(address) 
{
    let validAdress = address.toString()
    
    const [ip, port] = address.split(":")
    const hostname = ip.split(".").join("-")
    return `wss://${hostname}.starblast.io:${port}/`
}

async function getGameFromLink(gameLink)
{
    if(gameLink.includes("@"))
    {
        return await moddedCustomParty(gameLink)
    }
    else
    {
        return vanillaCustomParty(gameLink)
    }
}

function moddedCustomParty(gameLink)
{
    let wsServerUrl = ""
    let gameId = ""
    if(gameLink.includes("@"))
    {
        serverIp = gameLink.split("@")[1]
        wsServerUrl = buildWsUrl(serverIp)
        gameId = `${gameLink.split("@")[0]}`
        gameId = gameId.split("#")[1]
    }
    return{
        id : parseInt(gameId),
        wsUrl : wsServerUrl
    }
    

    return null
}

async function vanillaCustomParty(gameLink)
{
    let wsServerUrl = ""
    let gameId = gameLink.split("#")[1]
    const res = await fetch("https://starblast.io/simstatus.json")
    const serverData = await res.json()
    
    for(server of serverData)
    {
        if(server.systems !== 0)
        {
            for(game of server.systems)
            {
                if(gameId === (game.id).toString())
                {
                    return{
                        id : game.id,
                        mode : game.mode,
                        wsUrl : buildWsUrl(server.address)
                    }
                }
            }
        }
    }
    return null
}

function parsePacket0(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const playerInfo = 
    {
        packetType : 0,
        shipId : view.getUint8(1),
        flags: view.getUint8(2),
        hue: view.getUint8(3),
        serverTick: view.getUint32(4, true),
        lastTick: view.getUint32(8, true),
        angle: view.getUint16(12, true),
        typeFlags: view.getUint16(14, true),
        x: view.getFloat32(16, true),
        y: view.getFloat32(20, true),
        speedX: view.getFloat32(24, true),
        speedY: view.getFloat32(28, true),
        rotation: view.getFloat32(32, true),
        angularVelocity: view.getFloat32(36, true),
        stun: view.getUint8(40),
        rank: view.getUint8(41),
        shield: view.getUint16(42, true),
        energy: view.getUint16(44, true),
        crystals: view.getUint16(46, true),
        score: view.getUint32(48, true),
        levels: view.getUint32(52, true)
    }
        
    return playerInfo
}

function parsePacket101(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const laserHit =
    {
        packetType : 101,
        type: view.getUint8(0),
        laserIndex: view.getUint16(2, true),
        x: view.getFloat32(4, true),
        y: view.getFloat32(8, true),
        shipId: view.getUint8(12)
    }

    return laserHit
}

function parsePacket150(bytes)
{
    const killData = 
    {
        packetType : 150,
        killed : bytes[1],
        killer : bytes[2]
    }
    return killData
}

class vector2
{
    constructror(x, y)
    {
        this.x = x
        this.y = y
    }
}

module.exports = { getGame, getGameFromLink, parsePacket0, parsePacket101, parsePacket150 }