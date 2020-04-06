import {DiscoBall} from 'modules/discoball'

const disco = new DiscoBall(new Vector3(8, 7, 8), 0.6, 18)

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