/// --- Spawner function ---

function spawnBall(x: number, y: number, z: number) {
  // This will create the entity.
  const ball = new Entity()

  /* First we will use a scaleVal variable to hold the value of the scale in size our ball will have.
     Next, we add a Transform component to the entity and assign it the position passed through the
     spawnBall function and set the scale. */
  let scaleVal = Math.random() + .07 
  ball.addComponent(new Transform({
    position: new Vector3(x, y, z),
    scale: new Vector3(scaleVal, scaleVal, scaleVal)
    }))

  // This gives our entity shape. In this case we are using a SphereShape.
  ball.addComponent(new SphereShape())

  // A Material is what gives our entity texture. Here we give the ball a random color and set its metallic and roughness values.
  const myMaterial = new Material()
  myMaterial.albedoColor = Color3.Random()
  myMaterial.metallic = 0.9
  myMaterial.roughness = 0.1
  ball.addComponent(myMaterial)

  // This spawns another ball whenever a ball is clicked on.
  ball.addComponent(
    new OnPointerDown(() => {
      spawnBall(Math.random() * 20 + 1, Math.random() * 20, Math.random() * 20 + 1)
    },
    {
      button: ActionButton.POINTER,
      hoverText: "Spawn Ball"
    })
  )

  // Here we add the entity to the engine.
  engine.addEntity(ball)

  return ball
}

/// --- Spawn a ball ---

const ball = spawnBall(10, 1, 5)