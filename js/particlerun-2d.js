'use strict';

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
    core_group_modify({
      'groups': [
        'particle',
      ],
      'todo': function(entity){
          canvas_buffer.fillRect(
            core_entities[entity]['x'],
            core_entities[entity]['y'],
            core_entities[entity]['width'],
            core_entities[entity]['height']
          );
      },
    });

    canvas_buffer.restore();
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

    core_group_modify({
      'groups': [
        'particle',
      ],
      'todo': function(entity){
          core_entities[entity]['x'] += core_entities[entity]['dx'];
          core_entities[entity]['y'] += core_entities[entity]['dy'];

          if(!math_rectangle_overlap({
            'h0': core_entities[entity]['height'],
            'h1': boundaries['height'],
            'w0': core_entities[entity]['width'],
            'w1': boundaries['width'],
            'x0': core_entities[entity]['x'],
            'x1': boundaries['x'],
            'y0': core_entities[entity]['y'],
            'y1': boundaries['y'],
          })){
              core_entity_remove({
                'entities': [
                  entity,
                ],
              });
          }
      },
    });

    for(var gate in gates){
        if(gates[gate]['interval'] > 0
          && frame_counter % gates[gate]['interval'] === 0){
            gates[gate]['event']();
        }

        core_group_modify({
          'groups': [
            'particle',
          ],
          'todo': function(entity){
              if(math_rectangle_overlap({
                'h0': core_entities[entity]['height'],
                'h1': gates[gate]['height'],
                'w0': core_entities[entity]['width'],
                'w1': gates[gate]['width'],
                'x0': core_entities[entity]['x'],
                'x1': gates[gate]['x'],
                'y0': core_entities[entity]['y'],
                'y1': gates[gate]['y'],
              })){
                  if(gates[gate]['destroy']){
                      core_entity_remove({
                        'entities': [
                          entity,
                        ],
                      });

                  }else{
                      if(gates[gate]['dx'] !== false){
                          core_entities[entity]['dx'] = gates[gate]['dx'];
                      }
                      if(gates[gate]['dy'] !== false){
                          core_entities[entity]['dy'] = gates[gate]['dy'];
                      }
                  }
              }
          },
        });
    }

    core_ui_update({
      'ids': {
        'particles': core_entity_info['particle']['count'] + '/' + core_storage_data['max-particles'],
        'x': camera_x,
        'y': camera_y,
      },
    });
}

function repo_init(){
    core_repo_init({
      'info': '<input onclick=canvas_setmode({newgame:true}) type=button value="Test Level">',
      'keybinds': {
        65: {},
        68: {},
        72: {
          'todo': function(){
              camera_x = 0;
              camera_y = 0;
          },
        },
        83: {},
        87: {},
      },
      'menu': true,
      'storage': {
        'max-particles': 1000,
        'particle-height': 5,
        'particle-width': 5,
        'scroll-speed': 5,
      },
      'storage-menu': '<table><tr><td><input id=max-particles><td>Max Particles<tr><td><input id=particle-height><td>Particle Height<tr><td><input id=particle-width><td>Particle Width<tr><td><input id=scroll-speed><td>Scroll Speed</table>',
      'title': 'ParticleRun-2D.htm',
      'ui': '<span id=ui-particles></span> Particles<br><span id=ui-x></span>x, <span id=ui-y></span>y',
    });

    core_entity_set({
      'type': 'particle',
    });

    canvas_init();
}

var boundaries = {};
var camera_x = 0;
var camera_y = 0;
var frame_counter = 0;
var gates = [];
