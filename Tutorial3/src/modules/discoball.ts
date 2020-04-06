@Component("Laser")
export class Laser {
  cycleForward: boolean = true
}

@Component("InvisEntity")
export class InvisEntity {}

@Component("Ball")
export class Ball {}

// Rotates disco ball and lasers; flickers laser rays randomly
export class DiscoSystem {
  update(dt: number) {
    const laserList = engine.getComponentGroup(Laser)
    const invisEntityList = engine.getComponentGroup(InvisEntity)
    const ballList = engine.getComponentGroup(Ball)
    for (let entity of laserList.entities){
      let rotX = entity.getComponent(Transform).rotation.eulerAngles.x
      let cycleForward = entity.getComponent(Laser).cycleForward
      if (cycleForward){
        if (rotX > -135 && rotX < 0){
          entity.getComponent(Laser).cycleForward = false
        } else {
          entity.getComponent(Transform).rotate(Vector3.Right(), dt * 15)
        }
      } else {
        if (rotX < 135 && rotX > 0){
          entity.getComponent(Laser).cycleForward = true
        } else {
          entity.getComponent(Transform).rotate(Vector3.Left(), dt * 15)
        }
      }
    }
    for (let entity of invisEntityList.entities){
      entity.getComponent(Transform).rotate(Vector3.Up(), dt * 15)
    }
    for (let entity of ballList.entities){
      entity.getComponent(Transform).rotate(Vector3.Up(), dt * 30)
    }
    if (Math.random() <= 0.1){
      const flicker = laserList.entities[Math.floor(Math.random()*laserList.entities.length)]
      flicker.getComponent(GLTFShape).visible = !flicker.getComponent(GLTFShape).visible
    }
  }
}

let activeDiscoSystem = new DiscoSystem()

export class DiscoBall {
  discoball: Entity = new Entity()
  position: Vector3
  scale: number
  numLasers: number

  constructor(position: Vector3, scale: number, numLasers: number) {
    this.position = position
    this.scale = scale
    this.numLasers = numLasers

    this.spawnBall()
    this.spawnLasers()
    engine.addSystem(activeDiscoSystem)
  }

  spawnBall() {
    // Creates disco ball entity
    this.discoball.addComponent(new GLTFShape("models/discoball.glb"))
    this.discoball.addComponent(new Transform({
      position: this.position,
      scale: new Vector3(this.scale, this.scale, this.scale)
    }))
    this.discoball.addComponent(new Ball())
    engine.addEntity(this.discoball)
  }
  
  spawnLasers() {
    const laserColorArray: string[] = ["models/laser_red.glb", "models/laser_green.glb", "models/laser_blue.glb", "models/laser_magenta.glb",
    "models/laser_cyan.glb", "models/laser_yellow.glb"]

    // Creates laser rays
    for (let i = 0; i < this.numLasers; i++){
      const invisEntity = new Entity()
      invisEntity.addComponent(new InvisEntity())
      invisEntity.addComponent(new Transform({
        position: this.position,
        rotation: Quaternion.Euler(0, 180-360*Math.random(), 0)
      }))
      engine.addEntity(invisEntity)

      let laserColor = laserColorArray[Math.floor(Math.random()*laserColorArray.length)]
      const laser = new Entity()
      laser.setParent(invisEntity)
      laser.addComponent(new Laser())
      laser.addComponent(new GLTFShape(laserColor))
      laser.addComponent(new Transform({
        rotation: Quaternion.Euler([-1, 1][Math.floor(Math.random()*2)]*(135+60*Math.random()), 0, 0)
      }))
      engine.addEntity(laser)
    }
  }
}