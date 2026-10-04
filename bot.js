const WebSockets = require("ws")
const { getGameFromLink } = require("./utils")
const events = require("events")

class StarblastBot
{
    constructor(options)
    {
        this.mode = options.mode
        this.create = options.create
        this.ecp_custom = options.ecp_custom
        this.name = options.name
        this.hue = options.hue
        this.spectate = options.spectate
        this.ecpKey = options.ecpKey
        this.gameLink = options.gameLink

        this.socket
        this.gameInfo
        this.botEvent = new events()

        this.inputValues = 0

        this.controls = 
        {
            look : 0,
            thrust: 4096,
            shoot: 8192,
            glide: 16384,
            strafeLeft: 32768,
            strafeRight: 65536,
            releaseCrystals: 131072
        }
    }

    async spawnBot()
    {
        this.gameInfo = await getGameFromLink(this.gameLink)
        return new Promise((resolve, reject) =>
        {
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
                            resolve("Spawned")
                            break
                    }
                }
            })

            this.socket.on("close", (code) =>
            {
                reject("closed")
                this.botEvent.emit("close")
            })

            this.socket.on("error", (error) =>
            {
                reject(error)
            })
        })
    }

    control(actions, angle = 0)
    {
        let actionsValue = 0
        for(const action of actions)
        {
            if(this.controls[action] !== undefined)
            {
                actionsValue += this.controls[action]
            }
        actionsValue += angle
        this.socket.send(actionsValue)
        }
    }
}

module.exports = { StarblastBot }