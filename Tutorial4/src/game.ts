import { getProvider } from '@decentraland/web3-provider';
import { getUserAccount } from '@decentraland/EthereumController';
import * as EthConnect from '../node_modules/eth-connect/esm';
import ABIMANA from '../contracts/ABIMANA';
import {Jukebox} from 'modules/jukebox';
import {DiscoBall} from 'modules/discoball'

// Custom component used to hold door rotation data
@Component('SlerpData')
export class SlerpData {
  originRot: Quaternion = Quaternion.Euler(0, 0, 0)
  targetRot: Quaternion = Quaternion.Euler(0, 90, 0)
  fraction: number = 0
}

// Door rotation system
export class SlerpRotate implements ISystem {
  update(dt: number) {
    const doors = engine.getComponentGroup(SlerpData)
    for (let entity of doors.entities) {
      let slerp = entity.getComponent(SlerpData)
      let transform = entity.getComponent(Transform)
      if (slerp.fraction < 1) {
        let rot = Quaternion.Slerp(slerp.originRot, slerp.targetRot, slerp.fraction)
        transform.rotation = rot  
        slerp.fraction += dt/5 
      }
    }
  }
}

// Store disco ball and jukebox objects in variables
const disco = new DiscoBall(new Vector3(8, 5, 8), 0.5, 18)
const jukebox = new Jukebox(new Vector3(14, 0, 11), Quaternion.Euler(0, 270, 0), 0.6)

// Used to keep track if doors have already been opened
let doorOpened : boolean = false

// Prompts user to pay 100 MANA; if success, doors open and jukebox activates; if failure, nothing occurs
function payment(){
  executeTask(async () => {
    try {
      const provider = await getProvider()
      const requestManager = new EthConnect.RequestManager(provider)
      const factory = new EthConnect.ContractFactory(requestManager, ABIMANA)
      const contract = (await factory.at(
        '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb'
      )) as any
      const address = await getUserAccount()
      log(address)

      const res = await contract.transfer(
        '0x219bb791955d1A3556AD4eB5DbcCbC64f60DB23B', 100000000000000000000,
        { from: address }
      )
      log(res)
      engine.addSystem(new SlerpRotate())
      jukebox.pressButton()
      doorOpened = true
      door1.getComponent(OnPointerDown).showFeedback = false
      door2.getComponent(OnPointerDown).showFeedback = false
    } catch (error) {
      log(error.toString());
    }
  })
}

// Create door entities and give them proper OnPointerDown and SlerpData components
const door1 = new Entity()
door1.addComponent(new GLTFShape("models/scene/door.glb"))
door1.addComponent(new Transform({
  position: new Vector3(3.4, -0.16, 14.35),
  scale: new Vector3(1.5, 1.5, 1.5)
}))
door1.addComponent(new OnPointerDown( e => {
  if (!doorOpened){
    payment()
  }
},
{
  button: ActionButton.PRIMARY,
  hoverText: "Enter (100 MANA)"
}))
door1.addComponent(new SlerpData())
engine.addEntity(door1)

const door2 = new Entity()
door2.addComponent(new GLTFShape("models/scene/door.glb"))
door2.addComponent(new Transform({
  position: new Vector3(7.14, 4.3, 14.35),
  scale: new Vector3(1.5, 1.5, 1.5),
  rotation: Quaternion.Euler(0, 0, 180)
}))
door2.addComponent(new OnPointerDown( e => {
  if (!doorOpened){
    payment()
  }
},
{
  button: ActionButton.PRIMARY,
  hoverText: "Enter (100 MANA)"
}))
door2.addComponent(new SlerpData())
door2.getComponent(SlerpData).originRot = Quaternion.Euler(0, 0, 180)
door2.getComponent(SlerpData).targetRot = Quaternion.Euler(0, -90, 180)
engine.addEntity(door2)

// Create building entity
const building = new Entity()
building.addComponent(new GLTFShape("models/scene/building.glb"))
building.addComponent(new Transform({
  position: new Vector3(8, 0, 8.6),
  scale: new Vector3(1.4, 1.4, 1.4)
}))
engine.addEntity(building)