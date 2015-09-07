'use strict';

function create_gates(new_gates){
    new_gates = new_gates || [{}];
    for(var gate in new_gates){
        gates.push({
          'color': new_gates[gate]['color'] || '#fff',
          'destroy': new_gates[gate]['destroy'] !== void 0
            ? new_gates[gate]['destroy']
            : false,
          'dx': new_gates[gate]['dx'] || 0,
          'dy': new_gates[gate]['dy'] || 0,
          'event': new_gates[gate]['event'] || function(){},
          'height': new_gates[gate]['height'] || 40,
          'interval': new_gates[gate]['interval'] || 0,
          'x': x + new_gates[gate]['x'] || x,
          'y': y + new_gates[gate]['y'] || y,
          'width': new_gates[gate]['width'] || 40,
        });
    }
}

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    buffer.save();
    buffer.translate(
      -camera_x,
      -camera_y
    );

    // Draw gates.
    for(var gate in gates){
        buffer.fillStyle = gates[gate]['color'];
        buffer.fillRect(
          gates[gate]['x'],
          gates[gate]['y'],
          gates[gate]['width'],
          gates[gate]['height']
       );
    }

    // Draw particles.
    buffer.fillStyle = '#fff';
    for(var particle in particles){
        buffer.fillRect(
          particles[particle]['x'],
          particles[particle]['y'],
          5,
          5
        );
    };

    buffer.restore();

    buffer.fillStyle = '#fff';
    // Draw camera position.
    buffer.fillText(
      camera_x + 'x ' + camera_y + 'y',
      5,
      25
    );

    // Draw number of particles
    //   and max-particles.
    buffer.fillText(
      particles.length
        + ' / '
        + settings['max-particles'],
      5,
      50
    );

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    animationFrame = window.requestAnimationFrame(draw);
}

function logic(){
    if(key_left){
        camera_x -= settings['scroll-speed'];
    }

    if(key_right){
        camera_x += settings['scroll-speed'];
    }

    if(key_down){
        camera_y += settings['scroll-speed'];
    }

    if(key_up){
        camera_y -= settings['scroll-speed'];
    }

    frame_counter += 1;
    if(frame_counter > 99){
        frame_counter = 0;
    }

    for(var particle in particles){
        particles[particle]['x'] += particles[particle]['dx'];
        particles[particle]['y'] += particles[particle]['dy'];

        if(particles[particle]['x'] > boundaries['right']
          || particles[particle]['x'] < boundaries['left']
          || particles[particle]['y'] > boundaries['bottom']
          || particles[particle]['y'] < boundaries['top']){
            particles.splice(
              particle,
              1
            );
        }
    }

    for(var gate in gates){
        if(gates[gate]['interval'] > 0
          && frame_counter % gates[gate]['interval'] === 0){
            gates[gate]['event']();
        }

        for(var particle in particles){
            if(particles[particle]['x'] > gates[gate]['x']
              && particles[particle]['x'] < gates[gate]['x'] + gates[gate]['width']
              && particles[particle]['y'] > gates[gate]['y']
              && particles[particle]['y'] < gates[gate]['y'] + gates[gate]['height']){
                if(gates[gate]['destroy']){
                    particles.splice(
                      particle,
                      1
                    );
                    continue;
                }

                particles[particle]['dx'] = gates[gate]['dx'];
                particles[particle]['dy'] = gates[gate]['dy'];
            }
        }
    }
}

function play_audio(id){
    if(settings['audio-volume'] <= 0){
        return;
    }

    document.getElementById(id).currentTime = 0;
    document.getElementById(id).play();
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('movement-keys').value = 'WASD';
    document.getElementById('max-particles').value = 1000;
    document.getElementById('ms-per-frame').value = 25;
    document.getElementById('reset-camera-key').value = 'H';
    document.getElementById('scroll-speed').value = 5;

    save();
}

function resize(){
    if(mode <= 0){
        return;
    }

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;

    buffer.font = '23pt sans-serif';
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'max-particles': 1000,
      'ms-per-frame': 25,
      'scroll-speed': 5,
    };
    for(var id in ids){
        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value == ids[id]){
            window.localStorage.removeItem('ParticleRun-2D.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = parseFloat(document.getElementById(id).value);
            window.localStorage.setItem(
              'ParticleRun-2D.htm-' + id,
              settings[id]
            );
        }
    }

    ids = {
      'movement-keys': 'WASD',
      'reset-camera-key': 'H',
    };
    for(id in ids){
        if(document.getElementById(id).value === ids[id]){
            window.localStorage.removeItem('ParticleRun-2D.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = document.getElementById(id).value;
            window.localStorage.setItem(
              'ParticleRun-2D.htm-' + id,
              settings[id]
            );
        }
    }
}

function setmode(newmode, newgame){
    window.cancelAnimationFrame(animationFrame);
    window.clearInterval(interval);

    gates = [];
    particles = [];

    mode = newmode;

    // New game mode.
    if(mode > 0){
        // If it's a newgame from the main menu, save settings.
        if(newgame){
            save();
        }

        // Reset.
        camera_x = 0;
        camera_y = 0;
        frame_counter = 0;
        key_left = false;
        key_right = false;

        // If it's a newgame from the main menu, setup canvas and buffers.
        if(newgame){
            document.body.innerHTML =
              '<canvas id=canvas></canvas><canvas id=buffer></canvas>';

            var contextAttributes = {
              'alpha': false,
            };
            buffer = document.getElementById('buffer').getContext(
              '2d',
              contextAttributes
            );
            canvas = document.getElementById('canvas').getContext(
              '2d',
              contextAttributes
            );

            resize();
        }

        load_level(mode);

        animationFrame = window.requestAnimationFrame(draw);
        interval = window.setInterval(
          'logic()',
          settings['ms-per-frame']
        );

        return;
    }

    // Main menu mode.
    buffer = 0;
    canvas = 0;

    document.body.innerHTML = '<div><div><a onclick="setmode(1, true)">Test Level</a></div></div><div class=right><div><input disabled value=ESC>Main Menu<br><input id=movement-keys maxlength=4 value='
      + settings['movement-keys'] + '>Camera ↑←↓→<br><input id=reset-camera-key maxlength=1 value='
      + settings['reset-camera-key'] + '>Reset Camera</div><hr><div><input id=audio-volume max=1 min=0 step=.01 type=range value='
      + settings['audio-volume'] + '>Audio<br><input id=max-particles value='
      + settings['max-particles'] + '>Max Particles<br><input id=ms-per-frame value='
      + settings['ms-per-frame'] + '>ms/Frame<br><input id=scroll-speed value='
      + settings['scroll-speed'] + '>Scroll Speed<br><a onclick=reset()>Reset Settings</a></div></div>';
}

var animationFrame = 0;
var boundaries = {};
var buffer = 0;
var camera_x = 0;
var camera_y = 0;
var canvas = 0;
var drag = false;
var drag_x = 0;
var drag_y = 0;
var frame_counter = 0;
var gates = [];
var height = 0;
var interval = 0;
var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var mode = 0;
var particles = [];
var settings = {
  'audio-volume': window.localStorage.getItem('ParticleRun-2D.htm-audio-volume') !== null
    ? parseFloat(window.localStorage.getItem('ParticleRun-2D.htm-audio-volume'))
    : 1,
  'movement-keys': window.localStorage.getItem('ParticleRun-2D.htm-movement-keys') || 'WASD',
  'max-particles': parseInt(window.localStorage.getItem('ParticleRun-2D.htm-max-particles')) || 1000,
  'ms-per-frame': parseInt(window.localStorage.getItem('ParticleRun-2D.htm-ms-per-frame')) || 25,
  'reset-camera-key': window.localStorage.getItem('ParticleRun-2D.htm-reset-camera-key') || 'H',
  'scroll-speed': window.localStorage.getItem('ParticleRun-2D.htm-scroll-speed') || 5,
};
var x = 0;
var width = 0;
var y = 0;

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        setmode(
          0,
          true
        );
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings['movement-keys'][0]){
        key_up = true;

    }else if(key === settings['movement-keys'][1]){
        key_left = true;

    }else if(key === settings['movement-keys'][2]){
        key_down = true;

    }else if(key === settings['movement-keys'][3]){
        key_right = true;

    }else if(key === settings['reset-camera-key']){
        camera_x = 0;
        camera_y = 0;
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][0]){
        key_up = false;

    }else if(key === settings['movement-keys'][1]){
        key_left = false;

    }else if(key === settings['movement-keys'][2]){
        key_down = false;

    }else if(key === settings['movement-keys'][3]){
        key_right = false;
    }
};

window.onload = function(e){
    setmode(
      0,
      true
    );
};

window.onmousedown =
  window.ontouchstart = function(e){
    drag = true;
    drag_x = e.pageX;
    drag_y = e.pageY;
};

window.onmousemove =
  window.ontouchmove = function(e){
    if(!drag){
        return;
    }

    camera_x += drag_x - e.pageX;
    camera_y += drag_y - e.pageY;
    drag_x = e.pageX;
    drag_y = e.pageY;
};

window.onmouseup =
  window.ontouchend = function(e){
    drag = false;
};

window.onresize = resize;
