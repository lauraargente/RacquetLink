  var loadFile = function(event) {
      var image = document.getElementById('output');
      var profileLabel = document.getElementById('profile-image-label');
      profileLabel.style.visibility = 'hidden'
      image.src = URL.createObjectURL(event.target.files[0]);
      // image.style.border = '4px solid white'
  };