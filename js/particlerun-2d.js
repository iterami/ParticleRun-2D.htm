'use strict';

function create_gates(new_gates){
    new_gates = new_gates || [{}];
    for(var gate in new_gates){
        gates.push({
          'color': new_gates[gate]['color'] || '#fff',
          'destroy': new_gates[gate]['destroy'] !== void 0
            ? new_gates[gate]['destroy']
            : false,
          'dx': new_gates[gate]['dx'] || false,
          'dy': new_gates[gate]['dy'] || false,
          'event': new_gates[gate]['event'] || function(){},
          'height': new_gates[gate]['height'] || 40,
          'interval': new_gates[gate]['interval'] || 0,
          'x': canvas_x + new_gates[gate]['x'] || canvas_x,
          'y': canvas_y + new_gates[gate]['y'] || canvas_y,
          'width': new_gates[gate]['width'] || 40,
        });
    }
}

function draw_logic(){
    canvas_buffer.save();
    canvas_buffer.translate(
      -camera_x,
      -camera_y
    );

    // Draw gates.
    for(var gate in gates){
        canvas_buffer.fillStyle = gates[gate]['color'];
        canvas_buffer.fillRect(
          gates[gate]['x'],
          gates[gate]['y'],
          gates[gate]['width'],
          gates[gate]['height']
       );
    }

    // Draw particles.
    canvas_buffer.fillStyle = '#fff';
    for(var particle in particles){
        canvas_buffer.fillRect(
          particles[particle]['x'],
          particles[particle]['y'],
          5,
          5
        );
    };

    canvas_buffer.restore();

    canvas_buffer.fillStyle = '#fff';
    // Draw camera position.
    canvas_buffer.fillText(
      camera_x + 'x ' + camera_y + 'y',
      5,
      25
    );

    // Draw number of particles
    //   and max-particles.
    canvas_buffer.fillText(
      particles.length
        + '/'
        + settings_settings['max-particles'],
      5,
      50
    );
}

function logic(){
    if(canvas_menu){
        return;
    }

    if(key_left){
        camera_x -= settings_settings['scroll-speed'];
    }

    if(key_right){
        camera_x += settings_settings['scroll-speed'];
    }

    if(key_down){
        camera_y += settings_settings['scroll-speed'];
    }

    if(key_up){
        camera_y -= settings_settings['scroll-speed'];
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

                if(gates[gate]['dx'] !== false){
                    particles[particle]['dx'] = gates[gate]['dx'];
                }
                if(gates[gate]['dy'] !== false){
                    particles[particle]['dy'] = gates[gate]['dy'];
                }
            }
        }
    }
}

function setmode_logic(newgame){
    gates = [];
    particles = [];

    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick=canvas_setmode({mode:1,newgame:true})>Test Level</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Menu<br>'
          + '<input id=movement-keys maxlength=4>Camera ↑←↓→<br>'
          + '<input id=reset-camera-key maxlength=1>Reset Camera</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=max-particles>Max Particles<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<input id=scroll-speed>Scroll Speed<br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // New game mode.
    }else{
        if(newgame){
            settings_save();
        }

        camera_x = 0;
        camera_y = 0;
        frame_counter = 0;
        key_left = false;
        key_right = false;
    }
}

var boundaries = {};
var camera_x = 0;
var camera_y = 0;
var drag = false;
var drag_x = 0;
var drag_y = 0;
var frame_counter = 0;
var gates = [];
var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var particles = [];

window.onload = function(){
    settings_init({
      'prefix': 'ParticleRun-2D.htm-',
      'settings': {
        'audio-volume': 1,
        'movement-keys': 'WASD',
        'max-particles': 1000,
        'ms-per-frame': 25,
        'reset-camera-key': 'H',
        'scroll-speed': 5,
      },
    });
    canvas_init();

    window.onkeydown = function(e){
        if(canvas_mode <= 0){
            return;
        }

        var key = e.keyCode || e.which;

        // ESC: menu.
        if(key === 27){
            canvas_menu_toggle();
            return;
        }

        key = String.fromCharCode(key);

        if(key === settings_settings['movement-keys'][0]){
            key_up = true;

        }else if(key === settings_settings['movement-keys'][1]){
            key_left = true;

        }else if(key === settings_settings['movement-keys'][2]){
            key_down = true;

        }else if(key === settings_settings['movement-keys'][3]){
            key_right = true;

        }else if(key === settings_settings['reset-camera-key']){
            camera_x = 0;
            camera_y = 0;

        }else if(key === 'Q'){
            canvas_menu_quit();
        }
    };

    window.onkeyup = function(e){
        var key = String.fromCharCode(e.keyCode || e.which);

        if(key === settings_settings['movement-keys'][0]){
            key_up = false;

        }else if(key === settings_settings['movement-keys'][1]){
            key_left = false;

        }else if(key === settings_settings['movement-keys'][2]){
            key_down = false;

        }else if(key === settings_settings['movement-keys'][3]){
            key_right = false;
        }
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
};
