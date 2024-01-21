'use strict';

function load_data(id){
    boundaries = {
      'height': 500,
      'width': 500,
      'x': -250,
      'y': -300,
    };
    camera_x = 0;
    camera_y = 0;
    frame_counter = 0;
    let level_gates = [];

    if(id === 1){

    }else{
        level_gates = [
          {
            'color': '#a1a',
            'change': function(){
                this.interval = core_random_integer({
                  'max': 99,
                  'todo': 'ceil',
                });

                if(entity_info['particle']['count'] < core_storage_data['particle-max']){
                    entity_create({
                      'properties': {
                        'dx': 0,
                        'dy': 1,
                        'height': core_storage_data['particle-height'],
                        'width': core_storage_data['particle-width'],
                        'x': this['x'] + core_random_integer({
                          'max': this['width'],
                        }) - 2,
                        'y': this['y'] + core_random_integer({
                          'max': this['width'],
                        }) - 2,
                      },
                      'types': [
                        'particle',
                      ],
                    });
                }
            },
            'interval': 10,
            'x': -20,
            'y': -300,
          },
          {
            'color': '#1a1',
            'event': function(particle){
                entity_entities[particle]['dy'] *= 1.1;
            },
            'width': 60,
            'x': -30,
            'y': -250,
          },
          {
            'color': '#aa1',
            'change': function(){
                this.color = this.color === '#aa1'
                  ? '#1aa'
                  : '#aa1';
            },
            'event': function(particle){
                entity_entities[particle]['dx'] = this.color === '#aa1'
                  ? 1
                  : -1;
                entity_entities[particle]['dy'] = 1;
            },
            'interval': 55,
            'x': -30,
            'width': 60,
          },
          {
            'color': '#aa1',
            'change': function(){
                this.color = this.color === '#aa1'
                  ? '#1aa'
                  : '#aa1';
            },
            'event': function(particle){
                if(this.color === '#aa1'){
                    entity_entities[particle]['dx'] = 1;
                    entity_entities[particle]['dy'] = -1;

                }else{
                    entity_entities[particle]['dx'] = 0;
                    entity_entities[particle]['dy'] = -10;
                }
            },
            'interval': 42,
            'x': -120,
            'y': 100,
          },
          {
            'color': '#222',
            'height': 20,
            'x': -140,
            'y': -150,
            'width': 80,
          },
          {
            'color': '#aaa',
            'event': function(particle){
                entity_entities[particle]['dy'] *= -1;
            },
            'height': 20,
            'x': -140,
            'y': -300,
            'width': 80,
          },
          {
            'color': '#a11',
            'change': function(){
                if(core_random_boolean(.23)){
                    return;
                }

                this.color = this.color === '#a11'
                  ? '#1a1'
                  : '#a11';
            },
            'event': function(particle){
                if(this.color === '#1a1'){
                    entity_entities[particle]['dx'] = -1;

                }else{
                    entity_entities[particle]['dx'] = 5;
                }

                entity_entities[particle]['dy'] = -1;
            },
            'interval': 23,
            'x': 80,
            'y': 100,
          },
          {
            'color': '#a11',
            'change': function(){
                if(core_random_boolean(.23)){
                    return;
                }

                this.color = this.color === '#11a'
                  ? '#a11'
                  : '#11a';
            },
            'event': function(particle){
                if(this.color === '#11a'){
                    entity_entities[particle]['dx'] = -3;
                    entity_entities[particle]['dy'] = -5;
                }
            },
            'interval': 23,
            'x': 130,
            'y': 80,
          },
        ];
    }

    for(const gate in level_gates){
        entity_create({
          'id': 'gate-' + gate,
          'properties': {
            'change': level_gates[gate]['change'],
            'color': level_gates[gate]['color'],
            'event': level_gates[gate]['event'],
            'height': level_gates[gate]['height'],
            'interval': level_gates[gate]['interval'],
            'width': level_gates[gate]['width'],
            'x': level_gates[gate]['x'],
            'y': level_gates[gate]['y'],
          },
          'types': [
            'gate',
          ],
        });
    }
}

function repo_drawlogic(){
    canvas.save();

    canvas.translate(
      canvas_properties['width-half'] - camera_x,
      canvas_properties['height-half'] - camera_y
    );

    canvas_setproperties({
      'properties': {
        'fillStyle': '#111',
      },
    });
    canvas.fillRect(
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
          canvas.fillRect(
            entity_entities[entity]['x'],
            entity_entities[entity]['y'],
            entity_entities[entity]['width'],
            entity_entities[entity]['height']
         );
      },
    });

    canvas.restore();
}

function repo_logic(){
    if(core_mouse['down-0']){
        camera_x -= core_mouse['movement-x'];
        camera_y -= core_mouse['movement-y'];
    }
    if(core_keys[core_storage_data['move-↓']]['state']){
        camera_y += core_storage_data['scroll-speed'];
    }
    if(core_keys[core_storage_data['move-←']]['state']){
        camera_x -= core_storage_data['scroll-speed'];
    }
    if(core_keys[core_storage_data['move-→']]['state']){
        camera_x += core_storage_data['scroll-speed'];
    }
    if(core_keys[core_storage_data['move-↑']]['state']){
        camera_y -= core_storage_data['scroll-speed'];
    }

    if(camera_x < boundaries['x']){
        camera_x = boundaries['x'];

    }else if(camera_x > boundaries['x'] + boundaries['width']){
        camera_x = boundaries['x'] + boundaries['width'];
    }
    if(camera_y < boundaries['y']){
        camera_y = boundaries['y'];

    }else if(camera_y > boundaries['y'] + boundaries['height']){
        camera_y = boundaries['y'] + boundaries['height'];
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
