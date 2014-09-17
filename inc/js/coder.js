var linesOfCode = 0;

function writeCode(number){
    linesOfCode = linesOfCode + number;
    document.getElementById("linesocode").innerHTML = linesOfCode;
};

var coders = 0;
var autosaveCounter = 1;
function buyCoder(){
    var coderCost = Math.floor(10 * Math.pow(1.1,coders));     //works out the cost of this cursor
    if(linesOfCode >= coderCost){                                   //checks that the player can afford the cursor
        coders = coders + 1;                                   //increases number of cursors
        linesOfCode = linesOfCode - coderCost;                          //removes the cookies spent
        document.getElementById('coders').innerHTML = coders;  //updates the number of cursors for the user
        document.getElementById('linesocode').innerHTML = linesOfCode;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,coders));       //works out the cost of the next cursor
    document.getElementById('coderCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

window.setInterval(function(){

    writeCode(coders);
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
        coders:coders
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
        } else if (savetype == 'manual'){
            alert('Game Saved');
            console.log('Manual Save');
        }
    };
}

// Load in saved data

function load(){
    var savegame = JSON.parse(localStorage.getItem("codeclick"));
    if (savegame){
        if (typeof savegame.linesOfCode !== "undefined") linesOfCode = savegame.linesOfCode;
        if (typeof savegame.coders !== "undefined") coders = savegame.coders;
    }
}
