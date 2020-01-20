const { app, BrowserWindow } = require('electron')
const fs = require('fs');


// import  as Splashscreen from "@trodi/electron-splashscreen";
// const mainOpts: Electron.BrowserWindowConstructorOptions = ...
// // configure the splashscreen
// const config: Splashscreen.Config = {
//     windowOpts: mainOpts;
//     templateUrl: `${__dirname}/splash-screen.html`;
//     splashScreenOpts: {
//         width: 425,
//         height: 325,
//     },
// };
// // initialize the splashscreen handling
// const main: BrowserWindow = Splashscreen.initSplashScreen(config);
// // load your browser window per usual
// main.loadURL(`file://index.html`);


function init(){
  let splash = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      webviewTag: false
    }
  });
  splash.loadFile("splash.html");
  console.log("Init");
  var account = "";
  var hasaccount = false;
  if (fs.existsSync("account")){
      account = fs.readFileSync("account",{ encoding: 'ascii' });
      if(account != ""){
        hasaccount = true;
      }
  }
  if (!(fs.existsSync("salts"))){
    var salts = "";
    for (var i = 0; i < 64;i++){
      salts += Math.random().toString(36).substring(7)+" ";
    }
    fs.writeFile("salts",salts, function(err) {
        if(err) {
            return console.log(err);
        }
        //console.log("The file was saved!");
    });
  }

  console.log("Start win");
  if(hasaccount){
    createWindow("index.html");
  }else{
    createWindow("reg.html");

  }
  splash.close();

}


function createWindow (name) {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });


  // and load the index.html of the app.

  win.loadFile(name)

}
console.log("Start init");
app.on('ready', init)
