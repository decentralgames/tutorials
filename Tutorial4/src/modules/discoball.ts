const NUM_LASERS = 36

@Component("Laser")
export class Laser {}

@Component("Ball")
export class Ball {}

// Rotates disco ball and lasers; flickers laser rays randomly
export class DiscoSystem {
  update(dt: number) {
    const laserList = engine.getComponentGroup(Laser)
    for (let entity of laserList.entities){
      entity.getComponent(Transform).rotate(Vector3.Forward(), dt * 20)
      entity.getComponent(Transform).rotate(Vector3.Left(), dt * 20)
    }
    engine.getComponentGroup(Ball).entities[0].getComponent(Transform).rotate(Vector3.Up(), dt * 30)
    const flicker = engine.getComponentGroup(Laser).entities[Math.floor(Math.random()*NUM_LASERS)]
    flicker.getComponent(GLTFShape).visible = !flicker.getComponent(GLTFShape).visible
  }
}

let activeDiscoSystem = new DiscoSystem()

// Defines grid to toggle laser rays depending on player position
let inBounds: boolean = true
export class RangeCheckSystem {
  update() {
    const ballPos = engine.getComponentGroup(Ball).entities[0].getComponent(Transform).position
    const camPos = Camera.instance.position
    const laserList = engine.getComponentGroup(Laser)
    if ((ballPos.x - camPos.x) < 7 && (ballPos.x - camPos.x) > -7 && (ballPos.z - camPos.z) < 7 &&
     (ballPos.z - camPos.z) > -7 && camPos.y < 5.5 && !inBounds) {
      inBounds = true
      engine.addSystem(activeDiscoSystem)
      for (let entity of laserList.entities){
        entity.getComponent(GLTFShape).visible = 1
      }
    } else if (((ballPos.x - camPos.x) >= 8 || (ballPos.x - camPos.x) <= -8 || (ballPos.z - camPos.z) >= 8 || (ballPos.z - camPos.z) <= -8 || camPos.y >= 6.5) && inBounds) {
      inBounds = false
      engine.removeSystem(activeDiscoSystem)
      for (let entity of laserList.entities){
        entity.getComponent(GLTFShape).visible = 0
      }
    }
  }
}

export class DiscoBall {
  discoball: Entity = new Entity()

  position: Vector3;
  scale: number;

  constructor(position: Vector3, scale: number) {
    this.position = position;
    this.scale = scale;

    this.spawnBall();
    this.spawnLasers();
  }
  
  startSystem() {
    engine.addSystem(new RangeCheckSystem())
  }

  spawnBall() {
    // Creates disco ball entity
    this.discoball.addComponent(new GLTFShape("models/disco/discoball.glb"))
    this.discoball.addComponent(new Transform({
      position: this.position,
      scale: new Vector3(this.scale, this.scale, this.scale)
    }))
    this.discoball.addComponent(new Ball())
    engine.addEntity(this.discoball)
  }
  
  spawnLasers() {
    const laserColorArray: string[] = ["models/disco/laser_red.glb", "models/disco/laser_green.glb", "models/disco/laser_blue.glb", "models/disco/laser_magenta.glb",
    "models/disco/laser_cyan.glb", "models/disco/laser_yellow.glb"]

    // Creates laser rays
    for (let i = 0; i < NUM_LASERS; i++){
      let laserColor = laserColorArray[Math.floor(Math.random()*laserColorArray.length)]
      const laser = new Entity()
      laser.addComponent(new Laser())
      laser.addComponent(new GLTFShape(laserColor))
      laser.addComponent(new Transform({
        position: this.position,
        rotation: Quaternion.Euler(i*6, i*14, i*26)
      }))
      laser.getComponent(GLTFShape).visible = 0
      engine.addEntity(laser)
    }
  }
}