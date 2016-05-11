//a function without backend connection, data will be lost at refresh
//function saveToList(event) {
//    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
//        var movieName = document.getElementById('movieName').value.trim();
//        if (movieName.length > 0) {
//            var li = '<li>' + movieName + '</li>';
//            document.getElementById('seenmovies').innerHTML += li;
//        }
//        document.getElementById('movieName').value = '';
//        return false;
//    }
//}

var seenmovies = new Firebase('https://paashawatchlist.firebaseio.com/movies');

function saveToList(event) {
    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
        var movieName = document.getElementById('movieName').value.trim();
        if (movieName.length > 0) {
            saveToFB(movieName);
        }
        document.getElementById('movieName').value = '';
        return false;
    }
}

function saveToFB(movieName) {
    // this will save data to Firebase
    seenmovies.push({
        name: movieName
    });
}

function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<li data-key="' + list[i].key + '">' + list[i].name + ' [' + genLinks(list[i].key, list[i].name) + ']</li>';
    }
    document.getElementById('seenmovies').innerHTML = lis;
}

function genLinks(key, mvName) {
    var links = '';
    links += '<a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')">Edit</a> | ';
    links += '<a href="javascript:del(\'' + key + '\',\'' + mvName + '\')">Delete</a>';
    return links;
}

function edit(key, mvName) {
    var movieName = prompt("Update the movie name", mvName);
    if (movieName && movieName.length > 0) {
        // build the FB endpoint to the item in movies collection
        var updateMovieRef = buildEndPoint(key);
        updateMovieRef.update({
            name: movieName
        });
    }
}

function del(key, mvName) {
    var response = confirm("Are certain about removing \"" + mvName + "\" from the list?");
    if (response == true) {
        // build the FB endpoint to the item in movies collection
        var deleteMovieRef = buildEndPoint(key);
        console.log(key);
        console.log(deleteMovieRef);
        deleteMovieRef.remove();
    }
}

function buildEndPoint(key) {
    return new Firebase('https://paashawatchlist.firebaseio.com/movies/' + key);
}
// this will get fired on inital load as well as when ever there is a change in the data
seenmovies.on("value", function (snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].name ? data[key].name : '';
            if (name.trim().length > 0) {
                list.push({
                    name: name,
                    key: key
                })
            }
        }
    }
    // refresh the UI
    refreshUI(list);
});

