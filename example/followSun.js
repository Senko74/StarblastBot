const { StarblastBot } = require("starblast-bots")

async function bot()
{
    // The bots info 
    const bot = new StarblastBot(
        {
            mode : "survival",
            create : false,
            name : "Dc : senko10",
            hue : 31,
            spectate : false,
            ecpKey : "00000-00000",
            gameLink : "https://starblast.io/#0000"
        },
    )
    // Make the bot join the game
    try
    {
        await bot.spawnBot()
    }
    catch(error)
    {
        console.log(error)
    }

    bot.botEvent.on("spawned", () =>
    {
        // Start moving to the sun
        bot.moveToSun()

        bot.botEvent.on("dead", (data) =>
        {
            console.log("bot dead", data)
            // Make the bot respawn
            bot.respawn()
            // Make the bot follow the sun
            bot.moveToSun()
        })
    })
}

// Make 5 bots spawn
for(let i = 0; i < 5; i ++)
{
    bot()
}


