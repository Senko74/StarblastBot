const WebSockets = require("ws")
const { getGameFromLink } = require("./utils")

class StarblastBot
{
    constructor(options, gameLink)
    {
        this.mode = options.mode
        this.preferred = options.preferred
        this.create = options.create
        this.ecp_custom = options.ecp_custom
        this.name = options.name
        this.hue = options.hue
        this.spectate = options.spectate
        this.ecpKey = options.ecpKey
        this.gameLink = gameLink

        this.socket
    }

    async spawnBot()
    {
        this.gameInfo = await getGameFromLink()
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
                        preferred : this.preferred,
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
                        
                }
            }
        })
    }
}
