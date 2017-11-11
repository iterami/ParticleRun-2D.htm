'use strict';

function draw_logic(){
    canvas_buffer.save();

    canvas_buffer.translate(
      canvas_properties['width-half'] - camera_x,
      canvas_properties['height-half'] - camera_y
    );

    // Draw background.
    canvas_setproperties({
      'properties': {
        'fillStyle': '#111',
      },
    });
    canvas_buffer.fillRect(
      boundaries['x'],
      boundaries['y'],
      boundaries['width'],
      boundaries['height']
    );

    // Draw gates and particles.
    core_group_modify({
      'groups': [
        'gate',
        'particle',
      ],
      'todo': function(entity){
          canvas_setproperties({
            'properties': {
              'fillStyle': core_entities[entity]['color'],
            },
          });
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
    if(core_keys[core_storage_data['move-↓']]['state']
      && camera_y < boundaries['y'] + boundaries['height']){
        camera_y += core_storage_data['scroll-speed'];
    }

    // Move camera left.
    if(core_keys[core_storage_data['move-←']]['state']
      && camera_x > boundaries['x']){
        camera_x -= core_storage_data['scroll-speed'];
    }

    // Move camera right.
    if(core_keys[core_storage_data['move-→']]['state']
      && camera_x < boundaries['x'] + boundaries['width']){
        camera_x += core_storage_data['scroll-speed'];
    }

    // Move camera up.
    if(core_keys[core_storage_data['move-↑']]['state']
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

    core_group_modify({
      'groups': [
        'gate',
      ],
      'todo': function(gate){
          if(core_entities[gate]['interval'] > 0
            && frame_counter % core_entities[gate]['interval'] === 0){
              core_entities[gate]['change']();
          }

          core_group_modify({
            'groups': [
              'particle',
            ],
            'todo': function(particle){
                if(math_rectangle_overlap({
                  'h0': core_entities[particle]['height'],
                  'h1': core_entities[gate]['height'],
                  'w0': core_entities[particle]['width'],
                  'w1': core_entities[gate]['width'],
                  'x0': core_entities[particle]['x'],
                  'x1': core_entities[gate]['x'],
                  'y0': core_entities[particle]['y'],
                  'y1': core_entities[gate]['y'],
                })){
                    if(core_entities[gate]['event'] !== false){
                        core_entities[gate]['event'](particle);
                    }
                }
            },
        });
      },
    });

    core_ui_update({
      'ids': {
        'particles': core_entity_info['particle']['count'] + '/' + core_storage_data['max-particles'],
      },
    });
}

function repo_init(){
    core_repo_init({
      'entities': {
        'gate': {
          'properties': {
            'change': false,
            'color': '#fff',
            'event': false,
            'height': 40,
            'interval': 0,
            'width': 40,
          },
        },
        'particle': {
          'properties': {
            'color': '#fff',
          },
        },
      },
      'events': {
        'test': {
          'onclick': function(){
              canvas_setmode({
                'newgame': true,
              });
          },
        },
      },
      'globals': {
        'boundaries': {},
        'camera_x': 0,
        'camera_y': 0,
        'frame_counter': 0,
      },
      'info': '<input id=test type=button value="Test Level">',
      'keybinds': {
        72: {
          'todo': function(){
              camera_x = 0;
              camera_y = 0;
          },
        },
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
      'ui': '<span id=ui-particles></span> Particles',
    });
    canvas_init();
}
