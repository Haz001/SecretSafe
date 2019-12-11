jsSHA = require("jssha");

function text2bin(text){
    var final = new Array();
    var mid = new Array();
    for (var i = 0; i < text.length; i++) {
        mid.push(text.charCodeAt(i).toString(2));
    }
    for (var i = 0; i < mid.length; i++){
        x = mid[i];
        while (x.length < 7){
            x= "0"+x
        }
        for (var j = 0; j < x.length; j ++){
            final.push(x[j]);
        }
    }
    return final;
}
function bin2text(binarry){
    var final = "";
    var mid = new Array;
    var start = new Array;
    for (var i = 0; i < (binarry.length/7); i++){
        x = binarry;
        start = ""
            for (var j = 0; j < 7; j ++){
                if(binarry[j+(i*7)] != null){
                console.log((binarry[j+(i*7)]))
                start += (binarry[j+(i*7)]).toString();
            }
        }
        mid.push(start)
    }
    for (var i = 0;i<mid.length;i++){
        final+=String.fromCharCode(parseInt(mid[i],2))
    }
    return final;
}
function hashText(text,salt,times){
    var thash = text;
    for (var i = 0; i < times;i++){
        var shaObj = new jsSHA("SHA-512", "TEXT");
        shaObj.update(salt);
        shaObj.update(text);
        shaObj.update(salt);
        var hexHash = shaObj.getHash("HEX");
        thash = hexHash.toString();
    }
    var binHash = new Array();
    for(var i = 0;i < hexHash.length; i++){
        x = (parseInt(hexHash[i].toString(), 16)).toString(2);
        while (x.length < 4){
            x= "0"+x
        }
        for (var j = 0;j<x.length;j++){
            binHash.push(x[j])
        }
    }
    return binHash;
}
function xor(msg,key){
    var final = new Array();
    for (var i = 0; i < msg.length;i++){
        if(msg[i] == key[i%key.length]){
            final.push("0")
        }else{
            final.push("1")
        }
    }
    return final;
}
