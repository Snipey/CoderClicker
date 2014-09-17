var linesOfCode = 0;

function writeCode(number){
    linesOfCode = linesOfCode + number;
    document.getElementById("linesocode").innerHTML = linesOfCode;
};

var buy = {
    interns:0,
    freelancers:0,
    programmers:0,
    coders:0
};
var autosaveCounter = 1;
function buyCoder(amount){
    var coderCost = Math.floor(10 * Math.pow(1.1,buy.coders));     //works out the cost of this cursor
    if(linesOfCode >= coderCost){                                   //checks that the player can afford the cursor
        buy.coders = buy.coders + amount;                                   //increases number of cursors
        linesOfCode = linesOfCode - coderCost;                          //removes the cookies spent
        document.getElementById('coders').innerHTML = buy.coders;  //updates the number of cursors for the user
        document.getElementById('linesocode').innerHTML = linesOfCode;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,buy.coders));       //works out the cost of the next cursor
    document.getElementById('coderCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

window.setInterval(function(){

    writeCode(buy.coders);
    //Autosave
        autosaveCounter += 1;
        if (autosaveCounter >= 60){ //Currently autosave is every minute. Might change to 5 mins in future.
            save('auto');
            autosaveCounter = 1;
    }

}, 1000);

function save(savetype){
    //Create objects and populate them with the variables, these will be stored in cookies
    //Each individual cookie stores only ~4000 characters, therefore split currently across two cookies
    //Save files now also stored in localStorage, cookies relegated to backup
    saveVar = {
        linesOfCode:linesOfCode,
        buy:buy
    }
    //set localstorage
    try {
        localStorage.setItem('codeclick', JSON.stringify(saveVar));
    } catch(err) {
        console.log('Cannot access localStorage - browser may be old or storage may be corrupt')
    }
    //Update console for debugging, also the player depending on the type of save (manual/auto)
    console.log('Attempted save');
    if (savetype == 'export'){
        var string = '[' + JSON.stringify(saveVar) + ']';
        var compressed = LZString.compressToBase64(string);
        console.log('Compressing Save');
        console.log('Compressed from ' + string.length + ' to ' + compressed.length + ' characters');
        document.getElementById('impexpField').value = compressed;
    }
    if (localStorage.getItem('codeclick')){
        console.log('Savegame exists');
        if (savetype == 'auto'){
            console.log('Autosave');
            _gaq.push(['_trackEvent', 'My Game', 'Save']);
        } else if (savetype == 'manual'){
            alert('Game Saved');
            console.log('Manual Save');
        }
    };
}

// Load in saved data

function load(loadType){

    var saveGame = {};

    if (loadType == 'localStorage'){
        //check for local storage
        try {
            string1 = localStorage.getItem('codeclick');
        } catch(err) {
            console.log('Cannot access localStorage - browser may not support localStorage, or storage may be corrupt')
        }
        if (string1){
            saveGame = JSON.parse(string1);
            //notify user
            console.log('Loaded saved game from localStorage')
        } else {
            console.log('Unable to find variables in localStorage.')
            return false;
        }
    }

    if (loadType == 'import'){
        //take the import string, decompress and parse it
        var compressed = document.getElementById('impexpField').value;
        var decompressed = LZString.decompressFromBase64(compressed);
        var revived = JSON.parse(decompressed);
        //set variables to load from
        saveGame = revived[0];
        //notify user
        alert('Imported saved game');
        //close import/export dialog
        //impexp();
    }
    //var savegame = JSON.parse(localStorage.getItem("codeclick"));

    if (typeof saveGame.buy.coders !== "undefined") buy.coders = saveGame.buy.coders;
    if (typeof saveGame.linesOfCode !== "undefined") linesOfCode = saveGame.linesOfCode;

    updateData();
    updateCost();
}

function reset(){
    localStorage.removeItem("codeclick")
}

function updateData(){
    document.getElementById('coders').innerHTML = buy.coders;
    document.getElementById('linesocode').innerHTML = linesOfCode;
}

function updateCost(){
    var coderNextCost = Math.floor(10 * Math.pow(1.1,buy.coders));       //works out the cost of the next cursor
    document.getElementById('coderCost').innerHTML = coderNextCost;  //updates the cursor cost for the user
}