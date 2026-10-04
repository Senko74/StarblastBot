const WebSockets = require("ws")
const { getGameFromLink } = require("./utils/utils")
const { parse } = require("./utils/parsingManager")
const d = require("./utils/IIIIIIIIIIIIII")
const events = require("events")

let a = 0

class StarblastBot
{
    constructor(options)
    {
        if(!d.hhhhh(a)){return}
        this.mode = options.mode
        this.create = options.create
        this.ecp_custom = options.ecp_custom
        this.name = options.name
        this.hue = options.hue
        this.spectate = options.spectate
        this.ecpKey = options.ecpKey
        this.gameLink = options.gameLink
        this.team = options.team
        this.botId = -1
        a = d.aaaa(a)
        this.socket
        this.gameInfo
        this.botEvent = new events()
        this.deaths = 0
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
                this.botEvent.emit("server-message", message)
                this.parsing(message)
                let msg
                try
                {
                    msg = JSON.parse(message)
                    this.botEvent.emit("json-message", msg)
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
                            if(msg.data.name.includes("妛"), msg.data.name.includes("Night"), msg.data.name.includes("AOW"))
                            {
                                reject("room don't allow bots")
                                return
                            }
                            this.socket.send(JSON.stringify(
                                {
                                    name : "enter",
                                    data : 
                                    {
                                        spectate : false,
                                        team : this.team || 0
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
                            this.botId = msg.data.shipid
                            this.botEvent.emit("game-info", msg.data)
                            resolve("Spawned")
                            a = d.aaaa(a)
                            break
                    }
                }
            })

            this.socket.on("close", (code) =>
            {
                reject("closed")
                if(a >= 0) { d.bbbbb(a) }
                this.botEvent.emit("close")
            })

            this.socket.on("error", (error) =>
            {
                reject(error)
            })
        })
    }

    parsing(message)
    {
        const array = Array.from(message)
        const parsResult = parse(array)
        if(!parsResult)
        {
            return
        }
        if(parsResult.type === 0)
        {
            if(parsResult.shipId === this.botId)
            {
                this.botEvent.emit("bot-status", (parsResult))
            }
            else
            {
                this.botEvent.emit("ship-status", (parsResult))
            }
        }
        if(parsResult.type === 120)
        {
            this.botEvent.emit("crystal-spawn", (parsResult))
        }
        if(parsResult.type === 150)
        {
            if(parsResult.shipId = this.botId)
            {
                this.deaths += 1
                this.botEvent.emit("dead", (parsResult))
            }
            else
            {
                this.botEvent.emit("ship-destroyed", (parsResult))
            }
        }
        if(parsResult.type === 200)
        {
            this.botEvent.emit("radar-scoreboard", (parsResult))
        }
        if(parsResult.type === 205)
        {
            this.botEvent.emit("station-update", (parsResult))
        }
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

    respawn()
    {
        this.socket.send(JSON.stringify(
            {
                name : "respawn"
            }
        ))
    }

    getName(id)
    {
        this.socket.send(JSON.stringify(
            {
                name : "get_name",
                data : 
                {
                    id : id
                }
            }
        ))
    }

    buyLife()
    {
        this.socket.send(JSON.stringify(
            {
                name : "buy_life"
            }
        ))
    }

    startTransfer()
    {
        this.socket.send(JSON.stringify(
            {
                name : "start_transfer"
            }
        ))
    }

    endTransfer()
    {
        this.socket.send(JSON.stringify(
            {
                name : "end_transfer"
            }
        )) 
    }

    toggleHealing()
    {
        this.socket.send(JSON.stringify(
            {
                name : "toggle_healing"
            }
        )) 
    }

    leave()
    {
        this.socket.close()
    }
}

module.exports = { StarblastBot }