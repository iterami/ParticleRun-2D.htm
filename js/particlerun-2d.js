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
          'x': new_gates[gate]['x'] || 0,
          'y': new_gates[gate]['y'] || 0,
          'width': new_gates[gate]['width'] || 40,
        });
    }
}

function create_particles(new_particles){
    if(particles.length >= core_storage_data['max-particles']){
        return;
    }

    new_particles = new_particles || [{}];
    for(var particle in new_particles){
        particles.push({
          'dx': new_particles[particle]['dx'] || 0,
          'dy': new_particles[particle]['dy'] || 0,
          'height': new_particles[particle]['height'] || core_storage_data['particle-height'],
          'width': new_particles[particle]['width'] || core_storage_data['particle-width'],
          'x': new_particles[particle]['x'] || 0,
          'y': new_particles[particle]['y'] || 0,
        });
    }
}

function draw_logic(){
    canvas_buffer.save();
    canvas_buffer.translate(
      canvas_x - camera_x,
      canvas_y - camera_y
    );

    // Draw background.
    canvas_buffer.fillStyle = '#111';
    canvas_buffer.fillRect(
      boundaries['x'],
      boundaries['y'],
      boundaries['width'],
      boundaries['height']
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
          particles[particle]['width'],
          particles[particle]['height']
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
        + core_storage_data['max-particles'],
      5,
      50
    );
}

function logic(){
    // Move camera down.
    if(core_keys[83]['state']
      && camera_y < boundaries['y'] + boundaries['height']){
        camera_y += core_storage_data['scroll-speed'];
    }

    // Move camera left.
    if(core_keys[65]['state']
      && camera_x > boundaries['x']){
        camera_x -= core_storage_data['scroll-speed'];
    }

    // Move camera right.
    if(core_keys[68]['state']
      && camera_x < boundaries['x'] + boundaries['width']){
        camera_x += core_storage_data['scroll-speed'];
    }

    // Move camera up.
    if(core_keys[87]['state']
      && camera_y > boundaries['y']){
        camera_y -= core_storage_data['scroll-speed'];
    }

    frame_counter += 1;
    if(frame_counter > 99){
        frame_counter = 0;
    }

    for(var particle in particles){
        particles[particle]['x'] += particles[particle]['dx'];
        particles[particle]['y'] += particles[particle]['dy'];

        if(!math_rectangle_overlap({
          'h0': particles[particle]['height'],
          'h1': boundaries['height'],
          'w0': particles[particle]['width'],
          'w1': boundaries['width'],
          'x0': particles[particle]['x'],
          'x1': boundaries['x'],
          'y0': particles[particle]['y'],
          'y1': boundaries['y'],
        })){
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
            if(math_rectangle_overlap({
              'h0': particles[particle]['height'],
              'h1': gates[gate]['height'],
              'w0': particles[particle]['width'],
              'w1': gates[gate]['width'],
              'x0': particles[particle]['x'],
              'x1': gates[gate]['x'],
              'y0': particles[particle]['y'],
              'y1': gates[gate]['y'],
            })){
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

function repo_init(){
    core_repo_init({
      'keybinds': {
        65: {},
        68: {},
        72: {
          'todo': function(){
              camera_x = 0;
              camera_y = 0;
          },
        },
        81: {
          'todo': canvas_menu_quit,
        },
        83: {},
        87: {},
      },
      'storage': {
        'audio-volume': 1,
        'max-particles': 1000,
        'ms-per-frame': 25,
        'particle-height': 5,
        'particle-width': 5,
        'scroll-speed': 5,
      },
      'title': 'ParticleRun-2D.htm',
    });
    canvas_init();
}

function setmode_logic(newgame){
    gates = [];
    particles = [];

    // Main menu mode.
    if(canvas_mode === 0){
        document.getElementById('wrap').innerHTML = '<div><div><a onclick=canvas_setmode({mode:1,newgame:true})>Test Level</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Menu</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=max-particles>Max Particles<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<input id=particle-height>Particle Height<br>'
          + '<input id=particle-width>Particle Width<br>'
          + '<input id=scroll-speed>Scroll Speed<br>'
          + '<a onclick=core_storage_reset()>Reset Settings</a></div></div>';
        core_storage_update();

    // New game mode.
    }else{
        if(newgame){
            core_storage_save();
        }

        camera_x = 0;
        camera_y = 0;
        frame_counter = 0;
    }
}

var boundaries = {};
var camera_x = 0;
var camera_y = 0;
var frame_counter = 0;
var gates = [];
var particles = [];
