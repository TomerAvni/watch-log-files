$(document).ready(function() {
    var socket = io.connect('http://localhost:9099');
    var container = $('#container');  
    socket.on('new-data', function(data) {
    	console.log("bla bla");
        var newItem = $('<div>' + data.value + '</div>');
        container.append(newItem);
    });
});
