(function(exports) {

// ----------- parameters ----------- //
var numUsers = 5,
    numObservationsPerUser = 10, // each user emits this number of actions
    experimentLength = 600000, // how long experiment lasts in ms
    maxTextLength = 150, // longest message users will send
    width = 480, // width of screen users interact on
    height = 720, // height of screen users interact on
    locations = ['gates hall', 'willard straight', 'olin', 'uris', 'upson', 'duffield', 'statler'],
    roles = ['undergrad', 'masters', 'phd', 'associate professor', 'senior professor', 'chair'],
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // for generating random text


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

function randomName() {
    var name = "";
    for (var i=0; i<10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return text;
}

function randomText(length) {
    var text = "";
    for (var i=0; i<length; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return text;
}

function randomAffect() {
    return Math.random();
}

function randomAction() {
    return {
        affect: randomAffect()
        date: randomDate(),
        position: randomPosition(),
        text: randomText(Math.floor(Math.random()*maxTextLength)),
    }
}


// ----------- main function ----------- //
function generateData(returnString) {
    var allData = [];

    // generate random actions for each user
    for (var u=0; u<numUsers; u++) {
        for (var o=0; o<numObservationsPerUser; o++) {
            allData.push({
                id: u,
                action: randomAction(),
                location: randomLocation(),
                name: randomName(),
                role: randomRole()
            });
        }
    }

    // sort data by time
    allData.sort(function(a, b) { return a.action.date - b.action.date; });

    return returnString ? JSON.stringify(allData) : allData;
}


// ----------- module ----------- //
exports.generateData = generateData;
exports.setNumUsers = function(n) { numUsers = n; };
exports.setNumObservations = function(n) { numObservationsPerUser = n; };
exports.setExperimentLength = function(ms) { experimentLength = ms; };
exports.setMaxTextLength = function(n) { maxTextLength = n; };
exports.setWidth = function(n) { width = n; };
exports.setHeight = function(n) { height = n; };
exports.setLocations = function(arr) { locations = arr; };
exports.setRoles = function(arr) { roles = arr; };
exports.setAlphabet = function(s) { alphabet = s; };
exports.getParameters = function() {
    return {
        numUsers: numUsers,
        numObservationsPerUser: numObservationsPerUser,
        experimentLength: experimentLength,
        maxTextLength: maxTextLength,
        width: width,
        height: height,
        locations: locations,
        roles: roles,
        alphabet: alphabet
    };
};
return exports;

}(this.generate = {}));