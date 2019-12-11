jsSHA = require("jssha");
var fs = require('fs');
class crypter{
    constructor(type) {
        if(type == 1){
            this.hash = "SHA3-512";
            this.UTF_BITS = 16;
        }
      }
    padLeftTo(string, padChar, numChars) {
        return (new Array(numChars-string.length+1)).join(padChar) + string;
    }

    unicodeToBinary(char) {
        var boolList = new Array();
        return char.split('').map(function(codepoint) {
            return this.padLeftTo(codepoint.charCodeAt(0).toString(2), 0, this.UTF_BITS);
        }).join('').split('').map(function(char){return parseInt(char)});
        for (var i = 0; i < result.length;i++){
            if (result[i] == 1){
                boolList.push(true)
            }else{
                boolList.push(false)
            }

        }
    }

    binaryToUnicode(boolList) {
        var binaryList = new Array();
        for (var i = 0; i < boolList.length;i++){
            if (boolList[i]){
                binaryList.push(1)
            }else{
                boolList.push(0)
            }
        }
        var codepointsAsNumbers = [];
        while( binaryList.length>0 ){
            var codepointBits = binaryList.slice(0,this.UTF_BITS);
            binaryList = binaryList.slice(this.UTF_BITS);
            codepointsAsNumbers.push( parseInt(codepointBits.join(''),2) );
        }
        return String.fromCharCode.apply(this,codepointsAsNumbers);
    }
    hash(text,salt,times){
        var thash = text;
        var hexHash = "";
        for (var i = 0; i < times;i++){
            var shaObj = new jsSHA(this.hash, "TEXT");
            shaObj.update(salt);
            shaObj.update(text);
            shaObj.update(salt);
            hexHash = shaObj.getHash("HEX");
            thash = hexHash.toString();
        }
        var binHash = new Array();
        for(var i = 0;i < hexHash.length; i++){
            var x = (parseInt(hexHash[i].toString(), 16)).toString(2);
            while (x.length < 4){
                x= "0"+x
            }
            for (var j = 0;j<x.length;j++){
                if(x[j] == "0"){
                    binHash.push(false)
                }else{
                    binHash.push(true)
                }

            }
        }
        return binHash;
    }
    xor(msg,key){
        var final = new Array();
        for (var i = 0; i < msg.length;i++){
            if(msg[i] == key[i%key.length]){
                final.push(false)
            }else{
                final.push(true)
            }
        }
        return final;
    }
}


crypt = new crypter(1)
function login(password){
    var hash = crypt.hashTextString(password,"salt",1000);
    var key = crypt.hashTextBin(password,"salt",100);
    sessionStorage.setItem('ckey', key);
    //console.log("done: "+hash)
    return true;
}

function writeFile(text,filen){
    var key = sessionStorage.getItem("ckey");

    var data = crypt.text2bin(text.toString());
    var cdata = (crypt.xor(data,key))
    var cdatah = crypt.bin2hex(cdata)
    console.log(cdata)
    console.log(crypt.text2bin(crypt.xor(data,key)))
    fs.writeFile("notes.txt",cdatah, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}
function readFile(fieln){
    var key = sessionStorage.getItem("ckey");
    var cdata = "";
    fs.readFile(fieln, {encoding: 'ascii'}, function(err,data){
        if (!err) {
            console.log('received data: ' + data);
            cdata = crypt.hex2bin(data);
            var data = (crypt.xor(cdata,key))
            var text = crypt.bin2text(data);
            console.log(text)
            return text;
        } else {
            console.log(err);
        }
    });



}
