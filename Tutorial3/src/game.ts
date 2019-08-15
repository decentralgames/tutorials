const NUM_LASERS = 36

// Custom component used to flag laser entities
@Component("Laser")
export class Laser {}

// Rotates disco ball and lasers; flickers laser rays randomly
export class DiscoSystem {
  update(dt: number) {
    const laserList = engine.getComponentGroup(Laser)
    for (let entity of laserList.entities){
      entity.getComponent(Transform).rotate(Vector3.Forward(), dt * 20)
      entity.getComponent(Transform).rotate(Vector3.Left(), dt * 20)
    }
    discoball.getComponent(Transform).rotate(Vector3.Up(), dt * 30)
    const flicker = engine.getComponentGroup(Laser).entities[Math.floor(Math.random()*NUM_LASERS)]
    flicker.getComponent(GLTFShape).visible = !flicker.getComponent(GLTFShape).visible
  }
}

const activeDiscoSystem = new DiscoSystem()

// Defines grid to toggle laser rays depending on player position
let inBounds: boolean = true
export class RangeCheckSystem {
  update() {
    const ballPos = discoball.getComponent(Transform).position
    const camPos = Camera.instance.position
    const laserList = engine.getComponentGroup(Laser)
    if ((ballPos.x - camPos.x) < 8 && (ballPos.x - camPos.x) > -8 && (ballPos.z - camPos.z) < 8 && (ballPos.z - camPos.z) > -8 && !inBounds) {
      inBounds = true
      engine.addSystem(activeDiscoSystem)
      for (let entity of laserList.entities){
        entity.getComponent(GLTFShape).visible = 1
      }
    } else if (((ballPos.x - camPos.x) >= 8 || (ballPos.x - camPos.x) <= -8 || (ballPos.z - camPos.z) >= 8 || (ballPos.z - camPos.z) <= -8) && inBounds) {
      inBounds = false
      engine.removeSystem(activeDiscoSystem)
      for (let entity of laserList.entities){
        entity.getComponent(GLTFShape).visible = 0
      }
    }
  }
}

engine.addSystem(new RangeCheckSystem())

// Creates disco ball entity
const discoball = new Entity()
discoball.addComponent(new GLTFShape("models/discoball.glb"))
discoball.addComponent(new Transform({
  position: new Vector3(8, 7, 8),
  scale: new Vector3(0.6, 0.6, 0.6)
}))
engine.addEntity(discoball)

// Background music
const music = new Entity()
music.addComponent(new Transform({
  position: new Vector3(3, 2, 7)
}))
let song = new AudioClip("sounds/music.mp3")
let audioSource = new AudioSource(song)
audioSource.playing = true
audioSource.loop = true
music.addComponent(audioSource)
engine.addEntity(music)

const laserColorArray: string[] = ["models/laser_red.glb", "models/laser_green.glb", "models/laser_blue.glb", "models/laser_magenta.glb",
  "models/laser_cyan.glb", "models/laser_yellow.glb"]

// Creates laser rays
for (let i = 0; i < NUM_LASERS; i ++){
  let laserColor = laserColorArray[Math.floor(Math.random()*laserColorArray.length)]
  const laser = new Entity()
  laser.addComponent(new Laser())
  laser.addComponent(new GLTFShape(laserColor))
  laser.addComponent(new Transform({
    position: new Vector3(8, 7, 8),
    rotation: Quaternion.Euler(i*6, i*14, i*26)
  }))
  engine.addEntity(laser)
}

// Arrays holding wall Position, Scale, and Rotation Values
const wallPositionArray: Vector3[] = [new Vector3(4, 0, 0.5), new Vector3(12, 0, 0.5), new Vector3(8, 6, 0.5), new Vector3(8, 0, 15.5),
  new Vector3(15.5, 0, 8), new Vector3(0.5, 0, 8), new Vector3(8, 8, 8), new Vector3(8, -0.5, 8)]
const wallScaleArray: Vector3[] = [new Vector3(6, 16, 1), new Vector3(6, 16, 1), new Vector3(16, 4, 1), new Vector3(16, 16, 1),
  new Vector3(16, 16, 1), new Vector3(16, 16, 1), new Vector3(16, 16, 1), new Vector3(16, 16, 1)]

// For loop that creates wall pieces based on above array values
for (let i = 0; i < 8; i++){
  const wall = new Entity()
  const roomSurface = new BoxShape()
  roomSurface.withCollisions = true
  const roomColor = new Material()
  roomColor.albedoColor = Color3.Black()
  roomColor.roughness = 0.7
  wall.addComponent(roomSurface)
  wall.addComponent(roomColor)
  wall.addComponent(new Transform({
    position: wallPositionArray[i],
    scale: wallScaleArray[i]
  }))
  if (i == 4 || i == 5){
    wall.getComponent(Transform).rotation = Quaternion.Euler(0, 90, 0)
  } else if (i == 6 || i == 7){
    wall.getComponent(Transform).rotation = Quaternion.Euler(90, 0, 0)
  }
  engine.addEntity(wall)
}