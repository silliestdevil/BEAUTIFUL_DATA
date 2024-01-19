//pre-loaded sound
let song;
//axi draw
let axi;
let connected = false;
//audio analyses
var fft;
var amp;
//calculating averages
let lastVolumeTime = 0; 
var spectrumhistory = [];
var avgSpectrum = 0;

function preload() {
  song = loadSound('Assets/LoverB.mp3'); // preload Lover B Sound File
}

function setup() {
  createCanvas(400, 400);
  song.play();
  axi = new axidraw.AxiDraw();
  amp = new p5.Amplitude(); //volume
  fft = new p5.FFT(0,0); // pitch
}

function mouseClicked() { //when the mouse is clicked 
  if (!connected) {
    axi.connect()  // connect the AxiDraw
      .then(() => {
        connected = true;
        song.play();// if connected play the Song 
      });
  }
}

//make sure pen plotter starts at 0, 0 

function getAvg() {
    const totalSpectrum = spectrumhistory.reduce((acc, spectrum) => acc + spectrum[0], 0);//this sums up the first value of the array [0], 
    const avgSpectrum = totalSpectrum / spectrumhistory.length;  // calculates the average spectrum by dividing spectrum total sum of spectrum by whats in the array
    return avgSpectrum;// to use avgSpectrum - not used due to first value in array is more compatible
    // as pitch is stored in the form of an array 
  }
  

function draw() {
  background(220);

 // Calculate song amplitude and pitch every 1 Second
  if (millis() - lastVolumeTime >= 1000) {
    var currentVolume = amp.getLevel();//volume 
    var spectrum = fft.analyze();
    spectrumhistory.push(spectrum);//pitch array and its history
    getAvg(); // the average
    console.log("Pitch:", spectrum[0]);
    lastVolumeTime = millis()//updates the last time, so it can calculate every second

  // Map the amplitude to AxiDraw movement range
  let targetX = currentVolume*10000; //volume x 10000 along the X axis
  let targetY = spectrum[0]*2; //first value in the pitch array along the Y axis 
  //(x2 as it works better with volume) 
  
  axi.penUp(10);
  //move to the last calculated volume and pitch values
  axi.moveTo(targetX,targetY);
  axi.penDown(10); // the pen just plots single marks

}
}
