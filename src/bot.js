const WebSockets = require("ws")
const { getGameFromLink } = require("./utils/utils")
const { parse } = require("./utils/parsingManager")
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
        this.team = options.team
        this.botId 
        this.socket
        this.gameInfo
        this.matchInfo
        this.botEvent = new events()
        this.deaths = 0
        this.inputValues = 0
        this.botData
        this.playersInfo = []
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
                            this.matchInfo = msg.data
                            if(
                                msg.data.name.includes("妛") ||
                                msg.data.name.includes("Night") ||
                                msg.data.name.includes("AOW")
                            )
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
                            this.botId = msg.data.shipid
                            this.botEvent.emit("game-info", msg.data)
                            resolve("spawned")
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

    async parsing(message)
    {
        const array = Array.from(message)
        const parsResult = parse(array, this.matchInfo)
        if(!parsResult)
        {
            return
        }
        if(parsResult.type === 0)
        {
            
            if(parsResult.shipId === this.botId)
            {
                const firsTSpawn = this.botData
                this.botData = parsResult
                if(!firsTSpawn)
                {
                    this.botEvent.emit("spawned")
                }
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
            this.playersInfo = parsResult.ships
            for(const player of this.playersInfo)
            {
                try
                {
                    player.player_name = await this.getName(player.shipId)
                }
                catch(err) {  }
            }
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

    async getName(id)
    {
        return new Promise((resolve, reject) =>
        {
    
            const onMessage = (message) =>
            {
                let msg
                try
                {
                    msg = JSON.parse(message)
                }
                catch(err) { return }
                if(msg.name === "player_name" && msg.data.id === id)
                {
                    resolve(msg.data.player_name)
                    this.socket.off("message", onMessage)
                    return
                }
            }
            this.socket.on("message", onMessage)
            this.socket.send(JSON.stringify(
            {
                name : "get_name",
                data : 
                {
                    id : id
                }
            }
            ))
        })
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

    getDistanceById(shipId)
    {   
        if(!this.botData) { return }
        const playerInfo = this.findPlayerInfoById(shipId)
        return Math.sqrt((playerInfo.x - this.botData.x)**2 + (playerInfo.y - this.botData.y)**2)
    }

    getDistanceByName(name)
    {
        if(!this.botData) { return }
        let playerInfo = this.findPlayerInfoByName(name)
        return Math.sqrt((playerInfo.x - this.botData.x)**2 + (playerInfo.y - this.botData.y)**2)
    }

    findPlayerInfoById(shipId)
    {
        let playerInfo = {}
        for(const player of this.playersInfo)
        {
            if(player.shipId === shipId)
            {
                playerInfo = player
            }
        }
        return playerInfo
    }

    findPlayerInfoByName(name)
    {
        let playerInfo = {}
        for(const player of this.playersInfo)
        {
            if(name == player.player_name)
            {
                playerInfo = player
            }
        }
        return playerInfo
    }

    leave()
    {
        this.socket.close()
    }

    move(x,y)
    {
        let angle = (Math.atan2(y - this.botData.y, x - this.botData.x)*180)/Math.PI
        const distance = Math.sqrt((x - this.botData.x)**2 + (y - this.botData.y)**2)
        if(angle < 0)
        {
            angle += 360
        }
        this.control(["thrust"], angle)
        if(distance < 35)
        {
            this.control(["look"], angle)
            return true
        }
        else
        {
            return false
        }
    }

    moveTo(x, y)
    {
        if(this.moveToInterval)
        {
            return
        }
        this.moveToInterval = setInterval(() =>
        {
            const arrived = this.move(x,y)
            if(arrived)
            {
                clearInterval(this.moveToInterval)
                this.moveToInterval = null
            }
        }, 100)
    }

    moveToSun()
    {
        if(this.moveToInterval)
        {
            return
        }
        this.moveToInterval = setInterval(() =>
        {
            const arrived = this.move(0,0)
            if(arrived)
            {
                clearInterval(this.moveToInterval)
                this.moveToInterval = null
            }
        }, 100)
    }

}

module.exports = { StarblastBot }