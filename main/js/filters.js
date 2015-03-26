
(function(exports) {

// ----------- sorting functions ----------- //
function sortByString(d, s, asc) {
    // if ( d.length === 0 || !d[0].action.hasOwnProperty(s)) return null;
    var asc = typeof asc !== 'undefined' ? asc : true,
        f   = function(a, b) { return asc ? a.action[s] > b.action[s] : a.action[s] < b.action[s]; };
    return d.sort(f);
}

function sortByName(d, asc) {
    return sortByString(d, 'name', asc);
};

function sortByLocation(d, asc) {
    return sortByString(d, 'location', asc);
};

// ----------- filters ----------- //
function filterByTime(d, s, t) {

}

// ----------- module ----------- //
exports.sortByName = sortByName;
exports.sortByLocation = sortByLocation;
}(this.filters = {}));