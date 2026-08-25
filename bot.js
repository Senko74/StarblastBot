const WebSockets = require("ws")
const { getGameFromLink } = require("./utils")
const events = require("events")

class StarblastBot
{
    constructor(options, gameLink)
    {
        this.mode = options.mode
        this.create = options.create
        this.ecp_custom = options.ecp_custom
        this.name = options.name
        this.hue = options.hue
        this.spectate = options.spectate
        this.ecpKey = options.ecpKey
        this.gameLink = gameLink

        this.socket
        this.gameInfo

        this.botEvent = new events()
    }

    async spawnBot()
    {
        this.gameInfo = await getGameFromLink(this.gameLink)
        console.log(this.gameInfo)
        this.socket = new WebSockets(
            this.gameInfo.wsUrl,
            {
                headers : 
                {
                    Origin : "https://starblast.io"
                }
            }
        )

        this.socket.on("open", () =>
        {
            this.socket.send(JSON.stringify(
                {
                    name : "ojct:4",
                    data : 
                    {
                        player_name : this.name,
                        hue : this.hue,
                        mode : this.mode,
                        preferred : this.gameInfo.id,
                        ecpKey : this.ecpKey,
                        ecp_custom : this.ecp_custom,
                        spectate : this.spectate,
                        create : this.create
                    }
                }
            ))
        })

        this.socket.on("message", (message) =>
        {
            let msg
            try
            {
                msg = JSON.parse(message)
            }
            catch(err)
            {
                return
            }
            if(msg.name)
            {
                switch(msg.name)
                {
                    case "welcome":
                        this.socket.send(JSON.stringify(
                            {
                                name : "enter",
                                data : 
                                {
                                    spectate : false,
                                    team : 0
                                }
                            }
                        ))
                        this.socket.send(JSON.stringify(
                            {
                                name : "respawn"
                            }
                        ))
                        break
                    case "entered":
                        this.botEvent.emit("spawned")
                        break
                }
            }
        })

        this.socket.on("close", (code) =>
        {
            this.botEvent.emit("close")
        })
    }

    thrust(angle)
    {
        if(this.socket)
        {
            this.socket.send(4096 + angle)
        }
    }

    shoot(angle)
    {
        if(this.socket)
        {
            this.socket.send(8192 + angle)
        }
    }

    glide()
    {
        if(this.socket)
        {
            this.socket.send(16384)
        }
    }

    strafeLeft()
    {
        if(this.socket)
        {
            this.socket.send(32768)
        }
    }

    strafeRight()
    {
        if(this.socket)
        {
            this.socket.send(65536)
        }
    }

    releaseCrystals()
    {
        if(this.socket)
        {
            this.socket.send(131072)
        }
    }
}

module.exports = { StarblastBot }