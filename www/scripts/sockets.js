function mySocket() {
	var socket;
	var delayedScrollToBottom = new DelayedFunction(scrollToBottomQueue, 1000);

	this.watch = function(url, filename) {
		var watchFilename = function() {
			socket.emit('watch', filename);
		};

		if (socket) {
			socket.emit('unwatch');
			watchFilename();
		} else {
			init(url, watchFilename);
		}
	};

	function init(url, onConnection) {
		socket = io.connect(url/*'http://localhost:4200'*/);

		socket.on('connect', onConnection);
		socket.on('broad', function(data) {
	    	$('#main-content').append('<section>' + data.value + '</section>');
		    if ($('#scrollIntoView').prop( "checked")) {
				delayedScrollToBottom.set(Math.random());
			}
		});
	}

	

	
	 // $('form').submit(function(e){
	 //     e.preventDefault();
	 //     var message = $('#chat_input').val();
	 //     socket.emit('messages', message);
	 // });

	function scrollToBottomQueue() {
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
	}


	function DelayedFunction(toPerform, lengthToDelay) {
	    var value = null;
	    var func = toPerform;
	    var delay = lengthToDelay ? lengthToDelay : 700;
	    var timeoutFunctionPointer = null;
	    var lastValue = null;

	    this.set = function (valueToSet) {

	        if (timeoutFunctionPointer) {
	            clearTimeout(timeoutFunctionPointer);
	        }

	        value = valueToSet;
	        if (valueToSet == null) {
	            return;
	        }

	        timeout();
	    };

	    function timeout() {
	        timeoutFunctionPointer = setTimeout(function () {
	            timeoutFunctionPointer = null;
	            func(value);
	        }, delay);
	    }
	}
}