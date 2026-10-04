# starblast-bots

A Node.js library for creating and controlling bots in [Starblast](https://starblast.io/).

To prevent bots from entering custom games, add the symbol `妛` in the game name.

## Installation

Install the package with npm:

```bash
npm install starblast-bots
```

## Basic example

```js
const { StarblastBot } = require("starblast-bots")

// The bot's information

const bot = new StarblastBot(
    {
        mode : "survival",
        create : false,
        name : "senko",
        hue : 31,
        spectate : false,
        ecpKey : "00000-00000",
        gameLink : "https://starblast.io/#1092@51.255.91.80:3017"
    }
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
        return
    }

    // Shoot while strafing left

    bot.control(["shoot", "strafeLeft"], 0)

    // Stop the inputs and look at an angle of 0 degrees

    bot.control(["look"], 0)

    // Leave the game

    bot.leave()
}

main()
```

## Configuration

A bot is created by passing an options object to `StarblastBot`:

```js
const bot = new StarblastBot(
    {
        mode : "survival",
        create : false,
        name : "senko",
        hue : 31,
        spectate : false,
        ecpKey : "00000-00000",
        gameLink : "https://starblast.io/#1092@51.255.91.80:3017"
    }
)
```

### Options

| Option       | Type      | Description                                     |
| ------------ | --------- | ----------------------------------------------- |
| `mode`       | `string`  | The Starblast game mode.                        |
| `create`     | `boolean` | Whether the bot should create a game.           |
| `name`       | `string`  | The name displayed by the bot.                  |
| `hue`        | `number`  | The bot's hue/color value.                      |
| `spectate`   | `boolean` | Whether the bot should spectate.                |
| `ecpKey`     | `string`  | ECP key used by the bot.                        |
| `ecp_custom` | `any`     | Custom ECP data used by the bot.                |
| `gameLink`   | `string`  | Link to the Starblast game the bot should join. |
| `team`       | `number`  | Team used when entering a team game.            |

## Spawning a bot

Use `spawnBot()` to make the bot connect to the configured game.

```js
await bot.spawnBot()
```

Because `spawnBot()` is asynchronous, it should normally be used with `await`:

```js
try
{
    await bot.spawnBot()
    console.log("Bot spawned successfully")
}
catch(error)
{
    console.error(error)
}
```

When the bot successfully enters the game, the `spawned` event is emitted.

```js
bot.botEvent.on("spawned", () =>
{
    console.log("Bot spawned")
})
```

## Controlling the bot

The `control()` method can be used to send controls to the bot.

```js
bot.control(["shoot"], 0)
```

Multiple inputs can be provided:

```js
bot.control(["shoot", "strafeLeft"], 0)
```

The second argument controls the bot's look angle.

### Available controls

| Control           | Description                       |
| ----------------- | --------------------------------- |
| `look`            | Look without using another input. |
| `thrust`          | Move forward.                     |
| `shoot`           | Shoot.                            |
| `glide`           | Glide.                            |
| `strafeLeft`      | Strafe left.                      |
| `strafeRight`     | Strafe right.                     |
| `releaseCrystals` | Release crystals.                 |

## Respawning

Use `respawn()` to request a respawn:

```js
bot.respawn()
```

## Getting a player's name

Use `getName()` with a player ID:

```js
bot.getName(12)
```

## Buying a life

Use `buyLife()` to buy a life:

```js
bot.buyLife()
```

## Transfer

Start a transfer:

```js
bot.startTransfer()
```

End a transfer:

```js
bot.endTransfer()
```

## Healing

Use `toggleHealing()` to toggle healing:

```js
bot.toggleHealing()
```

## Leaving the game

Use `leave()` to disconnect the bot from the game:

```js
bot.leave()
```

## Events

Events are available through `bot.botEvent`.

### `spawned`

Emitted when the bot successfully enters the game.

```js
bot.botEvent.on("spawned", () =>
{
    console.log("Bot spawned")
})
```

### `close`

Emitted when the connection closes.

```js
bot.botEvent.on("close", () =>
{
    console.log("Connection closed")
})
```

### `dead`

Emitted when the bot's ship is destroyed.

The bot's `deaths` counter is also increased.

```js
bot.botEvent.on("dead", (data) =>
{
    console.log("Bot died", data)
    console.log("Deaths:", bot.deaths)
})
```

### `bot-status`

Emitted when a ship status packet belongs to the bot.

```js
bot.botEvent.on("bot-status", (data) =>
{
    console.log(data)
})
```

### `ship-status`

Emitted when a ship status packet belongs to another ship.

```js
bot.botEvent.on("ship-status", (data) =>
{
    console.log(data)
})
```

### `crystal-spawn`

Emitted when crystals spawn.

```js
bot.botEvent.on("crystal-spawn", (data) =>
{
    console.log(data)
})
```

### `ship-destroyed`

Emitted when another ship is destroyed.

```js
bot.botEvent.on("ship-destroyed", (data) =>
{
    console.log(data)
})
```

### `radar-scoreboard`

Emitted when radar/scoreboard data is received.

```js
bot.botEvent.on("radar-scoreboard", (data) =>
{
    console.log(data)
})
```

### `station-update`

Emitted when station data is received.

```js
bot.botEvent.on("station-update", (data) =>
{
    console.log(data)
})
```

### `server-message`

Emitted for every message received from the server.

```js
bot.botEvent.on("server-message", (data) =>
{
    console.log(data)
})
```

### `json-message`

Emitted when a received server message contains valid JSON.

```js
bot.botEvent.on("json-message", (data) =>
{
    console.log(data)
})
```

### `game-info`

Emitted when the bot receives its game information.

```js
bot.botEvent.on("game-info", (data) =>
{
    console.log(data)
})
```

## Bot properties

The bot exposes several useful properties.

| Property   | Description                         |
| ---------- | ----------------------------------- |
| `botId`    | The ID of the bot's ship.           |
| `deaths`   | Number of times the bot has died.   |
| `gameInfo` | Information about the current game. |
| `socket`   | The WebSocket connection.           |
| `botEvent` | Event emitter used by the bot.      |
| `controls` | Available control values.           |

Example:

```js
console.log(bot.botId)
console.log(bot.deaths)
console.log(bot.gameInfo)
```

## Complete example

```js
const { StarblastBot } = require("starblast-bots")

const bot = new StarblastBot(
    {
        mode : "survival",
        create : false,
        name : "senko",
        hue : 31,
        spectate : false,
        ecpKey : "00000-00000",
        gameLink : "https://starblast.io/#1092@51.255.91.80:3017"
    }
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
        console.error(error)
        return
    }

    // Handle bot death

    bot.botEvent.on("dead", (data) =>
    {
        console.log("bot dead", data)

        // Leave the game after 3 deaths

        if(bot.deaths >= 3)
        {
            bot.leave()
            return
        }

        // Respawn the bot

        bot.respawn()
    })

    // Shoot while strafing left

    bot.control(["shoot", "strafeLeft"], 0)
}

main()
```

## Project structure

A minimal project can look like this:

```text
my-starblast-bot/

├── node_modules/
├── package.json
├── package-lock.json
└── index.js
```

Install the package:

```bash
npm install starblast-bots
```

Then put your bot code in `index.js` and run:

```bash
node index.js
```

## API

### `StarblastBot(options)`

Creates a new Starblast bot.

```js
const bot = new StarblastBot(options)
```

### `spawnBot()`

Connects the bot to the configured Starblast game.

```js
await bot.spawnBot()
```

### `control(actions, angle)`

Controls the bot.

```js
bot.control(["shoot"], 0)
```

Multiple controls can be provided:

```js
bot.control(["shoot", "strafeLeft"], 0)
```

### `respawn()`

Requests a respawn.

```js
bot.respawn()
```

### `getName(id)`

Requests the name of a player.

```js
bot.getName(12)
```

### `buyLife()`

Buys a life.

```js
bot.buyLife()
```

### `startTransfer()`

Starts a transfer.

```js
bot.startTransfer()
```

### `endTransfer()`

Ends a transfer.

```js
bot.endTransfer()
```

### `toggleHealing()`

Toggles healing.

```js
bot.toggleHealing()
```

### `leave()`

Disconnects the bot from the game.

```js
bot.leave()
```

## Requirements

* Node.js
* npm
* A valid Starblast game link
* An ECP key if required by the game/bot configuration

