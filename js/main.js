'use strict';

function repo_drawlogic(){
    canvas_buffer.save();

    canvas_buffer.translate(
      canvas_properties['width-half'] - camera_x,
      canvas_properties['height-half'] - camera_y
    );

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

    entity_group_modify({
      'groups': [
        'gate',
        'particle',
      ],
      'todo': function(entity){
          canvas_setproperties({
            'properties': {
              'fillStyle': entity_entities[entity]['color'],
            },
          });
          canvas_buffer.fillRect(
            entity_entities[entity]['x'],
            entity_entities[entity]['y'],
            entity_entities[entity]['width'],
            entity_entities[entity]['height']
         );
      },
    });

    canvas_buffer.restore();
}

function repo_logic(){
    if(core_keys[core_storage_data['move-↓']]['state']
      && camera_y < boundaries['y'] + boundaries['height']){
        camera_y += core_storage_data['scroll-speed'];
    }
    if(core_keys[core_storage_data['move-←']]['state']
      && camera_x > boundaries['x']){
        camera_x -= core_storage_data['scroll-speed'];
    }
    if(core_keys[core_storage_data['move-→']]['state']
      && camera_x < boundaries['x'] + boundaries['width']){
        camera_x += core_storage_data['scroll-speed'];
    }
    if(core_keys[core_storage_data['move-↑']]['state']
      && camera_y > boundaries['y']){
        camera_y -= core_storage_data['scroll-speed'];
    }

    frame_counter += 1;
    if(frame_counter > 99){
        frame_counter = 0;
    }

    entity_group_modify({
      'groups': [
        'particle',
      ],
      'todo': function(entity){
          entity_entities[entity]['x'] += entity_entities[entity]['dx'];
          entity_entities[entity]['y'] += entity_entities[entity]['dy'];

          if(!math_cuboid_overlap({
            'height-0': entity_entities[entity]['height'],
            'height-1': boundaries['height'],
            'width-0': entity_entities[entity]['width'],
            'width-1': boundaries['width'],
            'x-0': entity_entities[entity]['x'],
            'x-1': boundaries['x'],
            'y-0': entity_entities[entity]['y'],
            'y-1': boundaries['y'],
          })){
              entity_remove({
                'entities': [
                  entity,
                ],
              });
          }
      },
    });

    entity_group_modify({
      'groups': [
        'gate',
      ],
      'todo': function(gate){
          if(entity_entities[gate]['interval'] > 0
            && frame_counter % entity_entities[gate]['interval'] === 0){
              entity_entities[gate]['change']();
          }

          entity_group_modify({
            'groups': [
              'particle',
            ],
            'todo': function(particle){
                if(math_cuboid_overlap({
                  'height-0': entity_entities[particle]['height'],
                  'height-1': entity_entities[gate]['height'],
                  'width-0': entity_entities[particle]['width'],
                  'width-1': entity_entities[gate]['width'],
                  'x-0': entity_entities[particle]['x'],
                  'x-1': entity_entities[gate]['x'],
                  'y-0': entity_entities[particle]['y'],
                  'y-1': entity_entities[gate]['y'],
                })){
                    if(entity_entities[gate]['event'] !== false){
                        entity_entities[gate]['event'](particle);
                    }
                }
            },
        });
      },
    });

    core_ui_update({
      'ids': {
        'particles': entity_info['particle']['count'] + '/' + core_storage_data['particle-max'],
      },
    });
}

function repo_escape(){
    if(!entity_entities['gate-0']
      && !core_menu_open){
        core_repo_reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'test': {
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'boundaries': {},
        'camera_x': 0,
        'camera_y': 0,
        'frame_counter': 0,
      },
      'info': '<input id=test type=button value="Test Level">',
      'menu': true,
      'reset': canvas_setmode,
      'storage': {
        'particle-height': 5,
        'particle-max': 1000,
        'particle-width': 5,
        'scroll-speed': 5,
      },
      'storage-menu': '<table><tr><td><input class=mini id=particle-max min=1 step=any type=number><td>Max Particles'
        + '<tr><td><input class=mini id=particle-height min=1 step=any type=number><td>Particle Height'
        + '<tr><td><input class=mini id=particle-width min=1 step=any type=number><td>Particle Width'
        + '<tr><td><input class=mini id=scroll-speed min=1 step=any type=number><td>Scroll Speed</table>',
      'title': 'ParticleRun-2D.htm',
      'ui': '<span id=particles></span> Particles',
    });
    entity_set({
      'properties': {
        'change': false,
        'color': '#fff',
        'event': false,
        'height': 40,
        'interval': 0,
        'width': 40,
      },
      'type': 'gate',
    });
    entity_set({
      'properties': {
        'color': '#fff',
      },
      'type': 'particle',
    });
    canvas_init();
}
