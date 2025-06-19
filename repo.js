'use strict';

function load_data(id){
    reset_camera();
    frame_counter = 0;
    let level_gates = [];

    if(id === 1){

    }else{
        level_gates = [
          {
            'color': '#a1a',
            'change': function(){
                this.interval = core_random_integer(99) + 1;

                if(entity_info.particle.count < core_storage_data.particle_max){
                    entity_create({
                      'properties': {
                        'dx': 0,
                        'dy': 1,
                        'height': core_storage_data.particle_height,
                        'width': core_storage_data.particle_width,
                        'x': this.x + core_random_integer(this.width) - 2,
                        'y': this.y + core_random_integer(this.width) - 2,
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
                particle.dy *= 1.1;
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
                particle.dx = this.color === '#aa1'
                  ? 1
                  : -1;
                particle.dy = 1;
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
                    particle.dx = 1;
                    particle.dy = -1;

                }else{
                    particle.dx = 0;
                    particle.dy = -10;
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
                particle.dy *= -1;
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
                    particle.dx = -1;

                }else{
                    particle.dx = 5;
                }

                particle.dy = -1;
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
                    particle.dx = -3;
                    particle.dy = -5;
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
          'id': 'gate_' + gate,
          'properties': level_gates[gate],
          'types': [
            'gate',
          ],
        });
    }
}

function repo_drawlogic(){
    canvas.save();

    canvas.translate(
      canvas_properties.width_half - camera_x,
      canvas_properties.height_half - camera_y
    );

    entity_group_modify({
      'groups': [
        'gate',
        'particle',
      ],
      'todo': function(entity){
          canvas_setproperties({
            'fillStyle': entity.color,
          });
          canvas.fillRect(
            entity.x,
            entity.y,
            entity.width,
            entity.height
         );
      },
    });

    canvas.restore();
}

function repo_escape(){
    if(!entity_entities.gate_0
      && !core_menu_open){
        canvas_setmode();
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            if(entity_entities.gate_0){
                event.preventDefault();
            }
        },
      },
      'events': {
        'reset_camera': {
          'onclick': function(){
              reset_camera();
              core_escape();
          },
        },
        'test': {
          'onclick': canvas_setmode,
        },
      },
      'globals': {
        'camera_x': 0,
        'camera_y': 0,
        'edge_x': 250,
        'edge_y': 300,
        'frame_counter': 0,
      },
      'info': '<button id=test type=button>Test Level</button><button id=reset_camera type=button>Reset Camera</button>',
      'menu': true,
      'pointerbinds': {},
      'storage': {
        'particle_height': 5,
        'particle_max': 1000,
        'particle_width': 5,
        'scroll_speed': 5,
      },
      'storage_controls': true,
      'storage-menu': '<table><tr><td><input class=mini id=particle_max min=1 step=1 type=number><td>Max Particles'
        + '<tr><td><input class=mini id=particle_height min=1 step=any type=number><td>Particle Height'
        + '<tr><td><input class=mini id=particle_width min=1 step=any type=number><td>Particle Width'
        + '<tr><td><input class=mini id=scroll_speed min=1 step=any type=number><td>Scroll Speed</table>',
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
    canvas_init({
      'cursor': 'pointer',
    });
}

function repo_logic(){
    if(core_pointer['down-0']){
        camera_x -= core_pointer['movement-x'];
        camera_y -= core_pointer['movement-y'];
    }
    if(core_keys[core_storage_data['move-↓']].state){
        camera_y += core_storage_data.scroll_speed;
    }
    if(core_keys[core_storage_data['move-←']].state){
        camera_x -= core_storage_data.scroll_speed;
    }
    if(core_keys[core_storage_data['move-→']].state){
        camera_x += core_storage_data.scroll_speed;
    }
    if(core_keys[core_storage_data['move-↑']].state){
        camera_y -= core_storage_data.scroll_speed;
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
          entity.x += entity.dx;
          entity.y += entity.dy;

          if(entity.x < -edge_x
            || entity.x > edge_x
            || entity.y < -edge_y
            || entity.y > edge_y){
              entity_remove({
                'entities': [
                  entity.id,
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
          if(gate.interval > 0
            && frame_counter % gate.interval === 0){
              gate.change();
          }

          entity_group_modify({
            'groups': [
              'particle',
            ],
            'todo': function(particle){
                if(math_cuboid_overlap({
                  'height0': particle.height,
                  'height1': gate.height,
                  'width0': particle.width,
                  'width1': gate.width,
                  'x0': particle.x,
                  'x1': gate.x,
                  'y0': particle.y,
                  'y1': gate.y,
                })){
                    if(gate.event !== false){
                        gate.event(particle);
                    }
                }
            },
        });
      },
    });

    core_ui_update({
      'ids': {
        'particles': entity_info.particle.count + '/' + core_storage_data.particle_max,
      },
    });
}

function reset_camera(){
    camera_x = 0;
    camera_y = 0;
}
