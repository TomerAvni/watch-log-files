(function() {
	var socket = new mySocket();
	$(document).ready(function() {
		getBaseFileContent($('.log-file-item.selected-item').find('a').attr('href'));
		$("#clearLog").on('click', clearContent);
		$(".log-file-item").on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$('.log-file-item').removeClass('selected-item');
			var filename = $(this).addClass('selected-item').find('a').attr('href');
			getBaseFileContent(filename);
		})
	});

	function getBaseFileContent(filename) {
		clearContent();
		setHeader(filename);
		$.ajax({
		  url: '/api/log?top=50&file=' + filename,
		  method: 'GET',
		  success: fileLoaded,
		});

		// if exits, cancel!
		socket.watch('http://localhost:4200', filename);
	}

	function clearContent() {
		$("#main-content").html("");
	}

	function setHeader(text) {
		$('#file-name-header').text(text);
	}

	function fileLoaded(result) {
		$('#main-content').html(result.data);
		if ($('#scrollIntoView').prop( "checked")) {
			setTimeout(function() {
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			});

		}
	}

	// function nl2br (str, is_xhtml) {   
 //    	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
 //    	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
	// }	
}())