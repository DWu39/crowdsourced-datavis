// ----------- parameters ----------- //
var numUsers = 5,
    numObservationsPerUser = 10, // each user emits this number of actions
    experimentLength = 600000, // how long experiment lasts in ms
    maxTextLength = 150, // longest message users will send
    width = 480, // width of screen users interact on
    height = 720, // height of screen users interact on
    locations = ['gates hall', 'willard straight', 'olin', 'uris', 'upson', 'duffield', 'statler'],
    roles = ['undegrad', 'masters', 'phd', 'associate professor', 'senior professor', 'chair'],
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // for generating random text


// ----------- data generators ----------- //
function getRandom(set) {
    var index = Math.floor(Math.random()*set.length);
    return set[index];
}

function randomDate() {
    return Math.floor(Math.random()*experimentLength);
}

function randomPosition() {
    return {
        x: Math.floor(Math.random()*width),
        y: Math.floor(Math.random()*height)
    };
}

function randomLocation() {
    return getRandom(locations);
}

function randomRole() {
    return getRandom(roles);
}

function randomText(length) {
    var text = "";
    for( var i=0; i < length; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function randomAffect() {
    return Math.random();
}

function randomAction() {
    return {
        date: randomDate(),
        position: randomPosition(),
        location: randomLocation(),
        role: randomRole(),
        text: randomText(Math.floor(Math.random()*maxTextLength)),
        affect: randomAffect()
    }
}


// ----------- main function ----------- //
function generateData() {
    var allData = [];

    // generate random actions for each user
    for (var u=0; u<numUsers; u++) {
        for (var o=0; o<numObservationsPerUser; o++) {
            allData.push({
                id: u,
                action: randomAction()
            });
        }
    }

    // sort data by time
    allData.sort(function(a, b) { return a.action.date - b.action.date; });

    return JSON.stringify(allData);
}
