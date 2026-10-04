function parse(array)
{
    if(array[0] === 0)
    {
        return parsePacket0(array)
    }

    if(array[0] === 71)
    {
        return parsePacket71(array)
    }

    if(array[0] === 100)
    {
        return parsePacket100(array)
    }

    if(array[0] === 101)
    {
        return parsePacket101(array)
    }

    if(array[0] === 102)
    {
        return parsePacket102(array)
    }

    if(array[0] === 103)
    {
        return parsePacket103(array)
    }

    if(array[0] === 110)
    {
        return parsePacket110(array)
    }

    if(array[0] === 111)
    {
        return parsePacket111(array)
    }

    if(array[0] === 112)
    {
        return parsePacket112(array)
    }

    if(array[0] === 120)
    {
        return parsePacket120(array)
    }

    if(array[0] === 121)
    {
        return parsePacket121(array)
    }

    if(array[0] === 130)
    {
        return parsePacket130(array)
    }

    if(array[0] === 141)
    {
        return parsePacket141(array)
    }

    if(array[0] === 147)
    {
        return parsePacket147(array)
    }

    if(array[0] === 150)
    {
        return parsePacket150(array)
    }

    if(array[0] === 155)
    {
        return parsePacket155(array)
    }

    if(array[0] === 175)
    {
        return parsePacket175(array)
    }

    if(array[0] === 180)
    {
        return parsePacket180(array)
    }

    if(array[0] === 181)
    {
        return parsePacket181(array)
    }

    if(array[0] === 182)
    {
        return parsePacket182(array)
    }

    if(array[0] === 183)
    {
        return parsePacket183(array)
    }

    if(array[0] === 184)
    {
        return parsePacket184(array)
    }

    if(array[0] === 185)
    {
        return parsePacket185(array)
    }

    if(array[0] === 186)
    {
        return parsePacket186(array)
    }

    if(array[0] === 187)
    {
        return parsePacket187(array)
    }

    if(array[0] === 190)
    {
        return parsePacket190(array)
    }

    if(array[0] === 200 || array[0] === 201)
    {
        return parsePacket200(array)
    }

    if(array[0] === 205)
    {
        return parsePacket205(array)
    }

    if(array[0] === 206)
    {
        return parsePacket206(array)
    }

    if(array[0] === 207)
    {
        return parsePacket207(array)
    }

    if(array[0] === 210)
    {
        return parsePacket210(array)
    }

    if(array[0] === 220)
    {
        return parsePacket220(array)
    }

    if(array[0] === 221)
    {
        return parsePacket221(array)
    }

    if(array[0] === 222)
    {
        return parsePacket222(array)
    }

    if(array[0] === 240)
    {
        return parsePacket240(array)
    }

    if(array[0] === 250)
    {
        return parsePacket250(array)
    }

    if(array[0] === 255)
    {
        return parsePacket255(array)
    }
}

// Parse the ship status
function parsePacket0(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        shipId : view.getUint8(1),
        hue256 : view.getUint8(3),
        serverTick : view.getUint32(4),
        lastTick : view.getUint32(8),
        angle : view.getUint16(12),
        x : view.getFloat32(16),
        y : view.getFloat32(20),
        vx : view.getFloat32(24),
        vy : view.getFloat32(28),
        r : view.getFloat32(32),
        angularVelocity : view.getFloat32(36),
        rank : view.getUint8(41),
        shield : view.getUint16(42),
        generator : view.getUint16(44),
        crystals : view.getUint16(46),
        score : view.getUint32(48),
        levels : view.getUint32(52)
    }
}

// Parse the survival mode start
function parsePacket71(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        survivalStart : view.getUint32(1)
    }
}

// Parse a laser volley
function parsePacket100(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const lasers = []

    for(let offset = 8; offset + 32 <= buffer.length; offset += 32)
    {
        lasers.push({
            x : view.getFloat32(offset),
            y : view.getFloat32(offset + 4),
            z : view.getFloat32(offset + 8),
            vx : view.getFloat32(offset + 12),
            vy : view.getFloat32(offset + 16),
            speed : view.getFloat32(offset + 20),
            id : view.getUint16(offset + 24),
            angle : view.getFloat32(offset + 26),
            type : view.getUint8(offset + 30),
            damage : view.getUint8(offset + 31)
        })
    }

    return {
        type : view.getUint8(0),
        shipId : view.getUint8(1),
        ownerField : view.getUint16(2),
        spawnTick : view.getUint32(4),
        lasers : lasers
    }
}

// Parse a laser hit on a ship
function parsePacket101(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        laserIndex : view.getUint16(2),
        x : view.getFloat32(4),
        y : view.getFloat32(8),
        shipId : view.getUint8(12)
    }
}

// Parse a big explosion
function parsePacket102(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        scaleByte : view.getUint8(1),
        x : view.getFloat32(2),
        y : view.getFloat32(6)
    }
}

// Parse a laser hit on terrain
function parsePacket103(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        laserIndex : view.getUint16(2),
        x : view.getFloat32(4),
        y : view.getFloat32(8)
    }
}

// Parse a map tile bonus
function parsePacket110(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        gridX : view.getInt8(2),
        gridY : view.getInt8(3),
        respawnTick : view.getUint32(4),
        shipId : view.getUint8(8),
        bonusAmount : view.getUint8(9),
        score : view.getUint32(10)
    }
}

// Parse the asteroid status
function parsePacket111(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        size : view.getUint8(1),
        id : view.getUint16(2),
        tick : view.getUint32(4),
        x : view.getFloat32(8),
        y : view.getFloat32(12),
        vx : view.getFloat32(16),
        vy : view.getFloat32(20)
    }
}

// Parse an asteroid removal
function parsePacket112(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        asteroidId : view.getUint16(2)
    }
}

// Parse crystal spawns
function parsePacket120(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const crystals = []

    for(let offset = 5; offset + 19 <= buffer.length; offset += 19)
    {
        crystals.push({
            crystalType : view.getUint8(offset),
            expId : view.getUint16(offset + 1),
            x : view.getFloat32(offset + 3),
            y : view.getFloat32(offset + 7),
            vx : view.getFloat32(offset + 11),
            vy : view.getFloat32(offset + 15)
        })
    }

    return {
        type : view.getUint8(0),
        spawnTick : view.getUint32(1),
        crystals : crystals
    }
}

// Parse a crystal pickup
function parsePacket121(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        shipId : view.getUint8(1),
        expId : view.getUint16(2)
    }
}

// Parse a station module shield hit
function parsePacket130(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        laserIndex : view.getUint16(2),
        x : view.getFloat32(4),
        y : view.getFloat32(8),
        stationIndex : view.getUint8(12),
        moduleIndex : view.getUint8(13),
        shieldHit : view.getUint8(14),
        shieldCurrent : view.getUint16(15),
        shieldMax : view.getUint16(17)
    }
}

// Parse a crystal pickup bonus
function parsePacket141(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        crystalCount : view.getUint8(1),
        x : view.getFloat32(2),
        y : view.getFloat32(6)
    }
}

// Parse a team gem contribution
function parsePacket147(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        shipId : view.getUint8(1),
        gems : view.getUint32(2)
    }
}

// Parse a ship destruction
function parsePacket150(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        shipId : view.getUint8(1),
        killerId : view.getUint8(2),
        bonusPoints : view.getUint32(4),
        scoreAndFlag : view.getUint32(8),
        rank : view.getUint8(12)
    }
}

// Parse a station module destruction
function parsePacket155(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        stationIndex : view.getUint8(1),
        moduleIndex : view.getUint8(2),
        x : view.getFloat32(3),
        y : view.getFloat32(7)
    }
}

// Parse the weapon loadout
function parsePacket175(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const weapons = []

    for(let offset = 5; offset + 3 <= buffer.length; offset += 3)
    {
        weapons.push({
            code : view.getUint8(offset),
            ammo : view.getUint8(offset + 1),
            delay : view.getUint8(offset + 2)
        })
    }

    return {
        type : view.getUint8(0),
        credits : view.getUint32(1),
        weapons : weapons
    }
}

// Parse the pod status
function parsePacket180(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        shipId : view.getUint16(0),
        miningCount : view.getUint8(3),
        attackCount : view.getUint8(4),
        defenceCount : view.getUint8(5),
        targetId : view.getUint16(6),
        targetType : view.getUint8(8)
    }
}

// Parse a pod projectile hit
function parsePacket181(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        laserIndex : view.getUint16(2),
        x : view.getFloat32(4),
        y : view.getFloat32(8),
        extra : view.getFloat32(12),
        podType : view.getUint8(16)
    }
}

// Parse a pod destruction
function parsePacket182(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        laserIndex : view.getUint16(2),
        x : view.getFloat32(4),
        y : view.getFloat32(8),
        shipId : view.getUint16(12),
        podType : view.getUint8(14),
        podIndex : view.getUint8(15),
        extra : view.getFloat32(16)
    }
}

// Parse a collectible pickup
function parsePacket183(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        shipId : view.getUint8(1),
        collectibleId : view.getUint16(2)
    }
}

// Parse a collectible spawn
function parsePacket184(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        collectibleType : view.getUint8(1),
        spawnTick : view.getUint32(2),
        collectibleId : view.getUint16(6),
        x : view.getFloat32(8),
        y : view.getFloat32(12),
        vx : view.getFloat32(16),
        vy : view.getFloat32(20)
    }
}

// Parse a projectile status
function parsePacket185(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        typeid : view.getUint8(1),
        id : view.getUint16(2),
        shipid : view.getUint16(4),
        tick : view.getUint32(6),
        x : view.getFloat32(10),
        y : view.getFloat32(14),
        vx : view.getFloat32(18),
        vy : view.getFloat32(22)
    }
}

// Parse a projectile hit
function parsePacket186(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        laserIndex : view.getUint16(2),
        x : view.getFloat32(4),
        y : view.getFloat32(8)
    }
}

// Parse a projectile removal
function parsePacket187(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        projType : view.getUint8(1),
        projId : view.getUint16(2)
    }
}

// Parse direct damage
function parsePacket190(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        damage : view.getUint16(1),
        x : view.getFloat32(3),
        y : view.getFloat32(7),
        angle : view.getFloat32(11)
    }
}

// Parse radar ships and scoreboard
function parsePacket200(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const ships = []

    for(let offset = 2; offset + 8 <= buffer.length; offset += 8)
    {
        ships.push({
            shipId : view.getUint8(offset),
            nx : view.getInt8(offset + 1),
            ny : view.getInt8(offset + 2),
            flags : view.getUint8(offset + 3),
            scoreModel : view.getUint32(offset + 4)
        })
    }

    return {
        type : view.getUint8(0),
        shipCount : view.getUint8(1),
        ships : ships
    }
}

// Parse the team station state
function parsePacket205(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        data : Array.from(buffer.slice(1))
    }
}

// Parse the wave and radar objects
function parsePacket206(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const objects = []

    for(let offset = 10; offset + 5 <= buffer.length; offset += 5)
    {
        objects.push({
            id : view.getUint16(offset),
            size : view.getUint8(offset + 2),
            nx : view.getInt8(offset + 3),
            ny : view.getInt8(offset + 4)
        })
    }

    return {
        type : view.getUint8(0),
        wave : view.getUint8(1),
        waveStartTime : view.getUint32(2),
        asteroidCount : view.getUint16(6),
        alienCount : view.getUint16(8),
        objects : objects
    }
}

// Parse battle royale radar ships
function parsePacket207(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const ships = []

    for(let offset = 1; offset + 3 <= buffer.length; offset += 3)
    {
        ships.push({
            shipId : view.getUint8(offset),
            nx : view.getInt8(offset + 1),
            ny : view.getInt8(offset + 2)
        })
    }

    return {
        type : view.getUint8(0),
        ships : ships
    }
}

// Parse the map tile respawn schedule
function parsePacket210(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    const tiles = []

    for(let offset = 5; offset + 3 <= buffer.length; offset += 3)
    {
        tiles.push({
            gx : view.getInt8(offset),
            gy : view.getInt8(offset + 1),
            respawnDelta : view.getUint8(offset + 2)
        })
    }

    return {
        type : view.getUint8(0),
        baseTick : view.getUint32(1),
        tiles : tiles
    }
}

// Parse the alien status
function parsePacket220(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        code : view.getUint8(1),
        id : view.getUint16(2),
        shield : view.getUint8(4),
        level : view.getUint8(5),
        tick : view.getUint32(6),
        x : view.getFloat32(10),
        y : view.getFloat32(14),
        vx : view.getFloat32(18),
        vy : view.getFloat32(22),
        r : view.getFloat32(26),
        angularVelocity : view.getFloat32(30),
        target_r : view.getFloat32(34),
        extra : view.getUint8(38)
    }
}

// Parse an alien laser hit
function parsePacket221(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        laserIndex : view.getUint16(2),
        x : view.getFloat32(4),
        y : view.getFloat32(8)
    }
}

// Parse an alien kill
function parsePacket222(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        alienId : view.getUint16(2),
        killerId : view.getUint16(4),
        score : view.getUint16(6)
    }
}

// Parse a chat message
function parsePacket240(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    let message = ""

    for(let offset = 2; offset < buffer.length; offset++)
    {
        message += String.fromCharCode(view.getUint8(offset))
    }

    return {
        type : view.getUint8(0),
        senderId : view.getUint8(1),
        message : message
    }
}

// Parse the player count
function parsePacket250(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        system_players : view.getUint8(1),
        total_players : view.getUint32(2)
    }
}

// Parse the batched packet container
function parsePacket255(bytes)
{
    const buffer = Uint8Array.from(bytes)
    const view = new DataView(buffer.buffer)

    return {
        type : view.getUint8(0),
        data : Array.from(buffer.slice(1))
    }
}

module.exports = { parse }

