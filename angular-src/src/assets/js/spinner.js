var opts1 = {
  lines: 7 // The number of lines to draw
, length: 20 // The length of each line
, width: 17 // The line thickness
, radius: 38 // The radius of the inner circle
, scale: 0.5 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.4 // Opacity of the lines
, rotate: 9 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1.5 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}
var opts2 = {
  lines: 7 // The number of lines to draw
, length: 0 // The length of each line
, width: 23 // The line thickness
, radius: 49 // The radius of the inner circle
, scale: 0.25 // Scales overall size of the spinner
, corners: 0.7 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.4 // Opacity of the lines
, rotate: 79 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1.4 // Rounds per second
, trail: 91 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}
var target = document.getElementById('loading');
var spinner = new Spinner(opts2).spin(target);