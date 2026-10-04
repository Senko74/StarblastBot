const { StarblastBot } = require("starblast-bots")


// The bots info 
const bot = new StarblastBot(
    {
        mode : "survival",
        create : false,
        name : "senko",
        hue : 31,
        spectate : false,
        ecpKey : "00000-00000",
        gameLink : "https://starblast.io/#1092@51.255.91.80:3017"
    },
    
)

async function main()
{
    // Make the bot join the game
    try
    {
        await bot.spawnBot()
        console.log("spawned")
    }
    catch(error)
    {
        console.log(error)
    }
    
    // Make the bot shoot with an angle of 0 degrees and straw left
    bot.control(["shoot", "strafeLeft"], 0)

    // Make the bot stop the inputs and looking with an angle of 0 degrees
    bot.control(["look"], 0)
    
    // Make the bot leave the game
    bot.leave()

}

main()

