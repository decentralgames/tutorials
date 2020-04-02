// Song List
// Music: www.bensound.com
const songs: {src: string, name: string}[] = 
[
  {src: "sounds/theelevatorbossanova.mp3", name: "The Elevator Bossa Nova"},
  {src: "sounds/jazzcomedy.mp3", name: "Jazz Comedy"},
  {src: "sounds/love.mp3", name: "Love"},
  {src: "sounds/thejazzpiano.mp3", name: "The Jazz Piano"}
];

// Jukebox
const jukebox = new Entity()
jukebox.addComponent(new GLTFShape("models/jukebox.glb"))
jukebox.addComponent(new Transform({
  position: new Vector3(5, 0, 9.5),
  rotation: Quaternion.Euler(0, 180 ,0),
  scale: new Vector3(0.6, 0.6, 0.6)
}))
jukebox.addComponent(new OnPointerDown( e => {
  pressButton()
},
{
  button: ActionButton.POINTER,
  hoverText: "Play Next Song"
}))
engine.addEntity(jukebox)

// Song Label
const songLabel = new Entity()
songLabel.addComponent(new Transform({
  position: new Vector3(-1.5, 2.5, 0.7),
  rotation: Quaternion.Euler(0, 180 ,0)
}))
const text = new TextShape("")
text.fontSize = 3.5
text.hTextAlign = "left"
text.color = Color3.FromHexString("#800000")
songLabel.addComponent(text)
songLabel.setParent(jukebox)
engine.addEntity(songLabel)

// Audio Components
let songArray =  []
for (let i = 0; i < songs.length; i ++){
  songArray[i] = new Entity()
  songArray[i].addComponent(new Transform({
    position: new Vector3(-8, -10, 0)
  }))
  let song = new AudioClip(songs[i].src)
  let audioSource = new AudioSource(song)
  audioSource.playing = false
  audioSource.loop = true
  songArray[i].addComponent(audioSource)
  songArray[i].setParent(jukebox)
  engine.addEntity(songArray[i])
}

// Helper Functions
function pressButton(){
  songLabel.getComponent(TextShape).value = "Now Playing: " + nextSong()
  songArray[currSong].getComponent(AudioSource).playing = true
  for (let j = 0; j < songs.length; j ++){
    if (j !== currSong)
      songArray[j].getComponent(AudioSource).playing = false
  }
}

let currSong = -1
function nextSong(){
  currSong = currSong >= songs.length-1 ? 0 : currSong+1;
  return songs[currSong].name
}