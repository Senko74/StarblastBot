# Starblast Bots

Starblast Bots is a JavaScript library for creating and controlling bots for the web game [Starblast.io](https://starblast.io/).

It provides an easy way to connect bots to Starblast games, control their movement and actions, and interact with the game through a simple Node.js API.

### V1.0.1 Beta — Report any issues or bugs in the [Issues](https://github.com/Senko74/StarblastBot/issues) tab.

## Installation

To install Starblast Bots, you will need [Node.js](https://nodejs.org/) installed on your system.

Then, run:

```bash
npm install starblast-bots
```

## Features

* Connect bots to Starblast.io games
* Join existing games using a game link
* Create bots with custom names and hues
* Support for different game modes
* Control bot movement and actions
* Combine multiple controls into a single input
* Control the bot's aiming angle
* Detect when a bot has spawned
* Detect when a bot disconnects
* Easily leave a game
* Simple event-based API
* Pure JavaScript / Node.js
* Lightweight API designed for bot development

## Basic Usage

```js
const { StarblastBot } = require("starblast-bots")

const bot = new StarblastBot({
    mode: "survival",
    create: false,
    name: "senko",
    hue: 31,
    spectate: false,
    ecpKey: "00000-00000",
    gameLink: "https://starblast.io#6147@195.201.89.106:3010"
})

async function main()
{
    // Join the game
    await bot.spawnBot()

    console.log("Bot spawned")

    // Shoot and strafe left
    bot.control(["shoot", "strafeLeft"], 0)

    // Look at 0 degrees
    bot.control(["look"], 0)

    // Leave the game
    bot.leave()
}

main()
```

## Creating a Bot

A bot is created by passing a configuration object to `StarblastBot`.

```js
const bot = new StarblastBot({
    mode: "survival",
    create: false,
    name: "MyBot",
    hue: 31,
    spectate: false,
    ecpKey: "00000-00000",
    gameLink: "https://starblast.io#6147@195.201.89.106:3010"
})
```

### Bot Options

| **Option**   | **Type**  | **Description**                 |
| ------------ | --------- | ------------------------------- |
| `mode`       | `string`  | Game mode                       |
| `create`     | `boolean` | Whether to create a new game    |
| `name`       | `string`  | Bot's player name               |
| `hue`        | `number`  | Bot's ship hue                  |
| `spectate`   | `boolean` | Whether the bot should spectate |
| `ecpKey`     | `string`  | ECP key used by the bot         |
| `ecp_custom` | `object`  | Custom ECP configuration        |
| `gameLink`   | `string`  | Starblast game link             |

## Connection Flow

The typical bot lifecycle follows this sequence:

1. Create a `StarblastBot` instance
2. Call `spawnBot()`
3. Wait for the bot to enter the game
4. Control the bot using `control()`
5. Leave the game using `leave()`

Example:

```js
const bot = new StarblastBot({
    mode: "survival",
    name: "MyBot",
    gameLink: "https://starblast.io#6147@195.201.89.106:3010"
})

await bot.spawnBot()

bot.control(["thrust"], 0)

bot.leave()
```

## Controlling the Bot

The `control()` method allows you to send one or multiple controls to the bot.

```js
bot.control(["shoot"], 0)
```

Multiple controls can be combined:

```js
bot.control(["thrust", "shoot", "strafeLeft"], 45)
```

The second argument is the aiming angle.

```js
bot.control(["shoot"], 90)
```

### Available Controls

| **Control**       | **Description**             |
| ----------------- | --------------------------- |
| `look`            | Look at the specified angle |
| `thrust`          | Thrust forward              |
| `shoot`           | Shoot                       |
| `glide`           | Glide                       |
| `strafeLeft`      | Strafe left                 |
| `strafeRight`     | Strafe right                |
| `releaseCrystals` | Release crystals            |

### Combining Controls

Controls can be combined in the same call:

```js
bot.control(
    ["thrust", "shoot", "strafeLeft"],
    45
)
```

This allows you to control several inputs simultaneously without requiring a separate method for every possible combination.

## Events

Starblast Bots uses an EventEmitter through `bot.botEvent`.

### `spawned`

Emitted when the bot successfully enters the game.

```js
bot.botEvent.on("spawned", () =>
{
    console.log("Bot spawned!")
})
```

### `close`

Emitted when the bot's WebSocket connection closes.

```js
bot.botEvent.on("close", () =>
{
    console.log("Bot disconnected!")
})
```

## Event Example

```js
const { StarblastBot } = require("starblast-bots")

const bot = new StarblastBot({
    mode: "survival",
    name: "MyBot",
    gameLink: "https://starblast.io#6147@195.201.89.106:3010"
})

bot.botEvent.on("spawned", () =>
{
    console.log("Bot successfully joined the game")

    bot.control(["shoot"], 0)
})

bot.botEvent.on("close", () =>
{
    console.log("Bot disconnected")
})

async function main()
{
    await bot.spawnBot()
}

main()
```

## Leaving a Game

Use `leave()` to close the bot's connection to the game.

```js
bot.leave()
```

Example:

```js
await bot.spawnBot()

console.log("Bot is playing")

bot.control(["thrust", "shoot"], 0)

bot.leave()
```

## Full Example

```js
const { StarblastBot } = require("starblast-bots")

const bot = new StarblastBot({
    mode: "survival",
    create: false,
    name: "senko",
    hue: 31,
    spectate: false,
    ecpKey: "00000-00000",
    gameLink: "https://starblast.io#6147@195.201.89.106:3010"
})

bot.botEvent.on("spawned", () =>
{
    console.log("Bot spawned!")

    // Shoot and strafe left
    bot.control(["shoot", "strafeLeft"], 0)

    // Look at 90 degrees
    bot.control(["look"], 90)
})

bot.botEvent.on("close", () =>
{
    console.log("Bot disconnected!")
})

async function main()
{
    try
    {
        await bot.spawnBot()
    }
    catch(error)
    {
        console.error("Failed to spawn bot:", error)
    }
}

main()
```

## API

### `new StarblastBot(options)`

Creates a new bot instance.

```js
const bot = new StarblastBot({
    mode: "survival",
    name: "MyBot",
    gameLink: "https://starblast.io#6147@195.201.89.106:3010"
})
```

### `bot.spawnBot()`

Connects the bot to the specified Starblast game.

```js
await bot.spawnBot()
```

Returns a `Promise` that resolves when the bot has successfully entered the game.

### `bot.control(actions, angle)`

Sends controls to the bot.

```js
bot.control(["shoot", "strafeLeft"], 0)
```

### `bot.leave()`

Closes the bot's connection.

```js
bot.leave()
```

### `bot.botEvent`

The EventEmitter used to listen for bot events.

```js
bot.botEvent.on("spawned", () =>
{
    console.log("Spawned")
})
```

## Requirements

* Node.js
* A valid Starblast.io game link
* Internet connection
* An ECP key may be required for some functionality

## Examples

More examples can be added to the `examples` directory as the library evolves.

Suggested examples:

* `simple-bot.js` — Basic bot connection and controls
* `movement-bot.js` — Bot movement and combined controls
* `event-bot.js` — Using bot events
* `create-game.js` — Creating a game

## Support

If you find a bug or have a suggestion, open an issue on GitHub:

[GitHub Issues](https://github.com/Senko74/StarblastBot/issues)

## License

ISC
