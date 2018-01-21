
var mode = null

$('.upload-btn').on('click', function (){

	var ele = $(this);
	if(ele.hasClass("encrypt")){
		mode = "encrypt";
	}else{
		mode = "decrypt"
	}

    $('#upload-input').click();
    $('.progress').show();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      console.log(file.type);
      var requiredType = "image/jpeg"
      if(mode == "decrypt"){
      	requiredType = "audio/x-wav"
      }

      if(file.type == requiredType){

         // add the files to formData object for the data payload
         formData.append('uploads[]', file, file.name);
  	  }else{
  	  	var errorMsg = file.name + " is not a valid type for " + mode + 
  	  	"\n Expected: "+requiredType+" - Found: "+file.type
  	  	alert(errorMsg);
  	  	throw errorMsg;
  	  }
    }

    $.ajax({
      url: 'localhost:8000/uploads',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      error: function(data){
          console.log('upload failed miserably!\n');
          console.dir(data);
      },
      xhr: function() {
      	console.log("hellooooooo");

        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

    mode = null;
  }
});