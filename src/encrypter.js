jsSHA = require("jssha");
var fs = require('fs');

class converter{
    constructor(unibytelength){
        if(unibytelength != null){
            this.unibytelength = unibytelength;
        }else{
            this.unibytelength = 32;
        }
    }
    unicharToBool(char){

        var result = new Array();
        var x = char.charCodeAt(0).toString(2);
        while (x.length < this.unibytelength){
            x = "0"+x;
        }

        for (var i = 0; i < x.length;i++){
            if (x[i] == "0"){
                result.push(false);
            }else{
                result.push(true);
            }
        }
        return result;
    }
    uniToBool(str){
        var result = new Array();
        for (var i = 0; i < str.length;i++ ){
            result = result.concat(this.unicharToBool(str[i]));
        }


        return result;

    }
    boolToUni(bools){
        var binlst = new Array();
        for (var i = 0; i < bools.length;i++){
            if (bools[i] == false){
                binlst.push("0");
            }else{
                binlst.push("1");
            }
        }
        var codepointsAsNumbers = new Array;
        while (binlst.length>0){
            var codepointBits = binlst.slice(0,this.unibytelength);
            binlst = binlst.slice(this.unibytelength);
            codepointsAsNumbers.push( parseInt(codepointBits.join(''),2) );
        }
        return String.fromCharCode.apply(this,codepointsAsNumbers);
    }
    boolToHex(bools){
        var binlst = new Array();
        var hexy = new String();
        var hexylst = new String();
        var count = 0;
        for (var i = 0; i < bools.length;i++){

            if (bools[i] == false){
                binlst.push("0");
                hexy+="0"
            }else{
                binlst.push("1");
                hexy+="1"
            }
            count += 1;
            if (count ==  this.unibytelength){
                count = 0;
                hexylst+=(parseInt(hexy,2)).toString(16)+"|";
                hexy = new String();

            }

        }
        return hexylst;
    }
    hexToBool(hexy){
        var x = hexy.split("|");
        var binlist = new String();
        for(var i = 0; i < x.length;i++){
            //console.log()
            if(x[i] != ""){
                var y = (parseInt(x[i],16)).toString(2)
                binlist+="0".repeat(this.unibytelength - y.length)+y
            }
        }

        var boollst = new Array();
        for(var i = 0; i < binlist.length;i++){
            if (binlist[i]=="0"){
                boollst.push(false);
            }else if (binlist[i]=="1"){
                boollst.push(true);
            }
        }
        return boollst;
    }

}
class hash{
    hash(text,salt,times){
        var thash = text;
        var hexHash = "";
        for (var i = 0; i < times;i++){
            var shaObj = new jsSHA("SHA3-512", "TEXT");
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
    constructor(past,pass,type,other) {
        if(past == 0){
                if (type == 0){
                this.key = this.hash(pass,"",1);
                this.hashed = this.hash(pass,"",2);
            }
        }
    }


}
class crypter{
    constructor(){
        this.conv = new converter();
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


    uniCrypt(to,msg,key,back){
        if(to == null){
            var x =  this.xor(this.conv.uniToBool(msg),key);
        }else if(to == 0){
            var x =  this.xor(this.conv.uniToBool(msg),key);
        }else if(to == 1){
            var x =  this.xor(this.conv.hexToBool(msg),key);
        }
        if(back == null){
            return this.conv.boolToUni(x);
        }else if (back == 1) {

            return this.conv.boolToHex(x);
        }else if (back == 0) {

            return this.conv.boolToUni(x);
        }
    }
}
class filestream{
    constructor(filepath,other){
        this.path = filepath;
        this.crypt = new crypter();
        if(other["key"] != null){
            this.key = other["key"];
            console.log("key: "+other["key"])
        }else if(other["password"] != null){
            console.log("password: "+other["password"])
            var h = new hash(0,other["password"],0);
            console.log("key: "+h.key.toString())
            this.key = h.key;
        }


    }

    read(){
        var text = "";
        var xdata = "";
        var key = this.key;
        xdata = fs.readFileSync(this.path,{ encoding: 'utf-8' });
        var cryptography = new crypter();
        console.log('received data: ' + xdata);
        console.log('received data: ' + xdata);
        text = cryptography.uniCrypt(1,xdata,key,0);
        return text;

    }
    write(text){

        var data = this.crypt.uniCrypt(0,text,this.key,1);
        console.log(text+" -> "+data);
        console.log(this.crypt.uniCrypt(0,data,this.key,1))
        fs.writeFile(this.path,data, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    }

}

class keytransfer{

    set(key){
        sessionStorage.setItem('ckey', key);
    }
    get(){
        var result = new Array();
        var x = sessionStorage.getItem('ckey').split(",");
        for (var i = 0;i < x.length;i++){
            if(x[i] == "true"){
                result.push(true)
            }else if(x[i] == "false"){
                result.push(false)
            }
        }
        return result;
    }
}

function login(password){
    var x = new hash(0,password,0)
    console.log(x.key)
    var keyt = new keytransfer();
    keyt.set( x.key);
    //console.log("done: "+hash)
    return true;

}
