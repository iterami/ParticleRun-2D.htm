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
    gates = [];

    if(id === 1){

    }else{
        var level_gates = [
          {
            'color': '#a1a',
            'dy': 1,
            'event': function(){
                this.interval = core_random_integer({
                  'max': 99,
                  'todo': 'ceil',
                });

                if(core_entity_info['particle']['count'] < core_storage_data['max-particles']){
                    core_entity_create({
                      'properties': {
                        'dx': this['dx'],
                        'dy': this['dy'],
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
            'dy': 5,
            'width': 60,
            'x': -30,
            'y': -250,
          },
          {
            'color': '#aa1',
            'dx': 1,
            'dy': 1,
            'event': function(){
                this.color = this.color === '#aa1'
                  ? '#1aa'
                  : '#aa1';
                this.dx = this.dx === 1
                  ? -1
                  : 1;
            },
            'interval': 55,
            'x': -30,
            'width': 60,
          },
          {
            'color': '#aa1',
            'dx': 1,
            'dy': -1,
            'event': function(){
                this.color = this.color === '#aa1'
                  ? '#1aa'
                  : '#aa1';
                this.dx = this.dx === 0
                  ? 1
                  : 0;
                this.dy = this.dy === -1
                  ? -10
                  : -1;
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
            'dy': 10,
            'height': 20,
            'x': -140,
            'y': -300,
            'width': 80,
          },
          {
            'color': '#a11',
            'dx': 5,
            'dy': -1,
            'event': function(){
                if(core_random_boolean({
                  'chance': .23,
                })){
                    return;
                }

                this.color = this.color === '#a11'
                  ? '#1a1'
                  : '#a11';
                this.dx = this.dx === 5
                  ? -1
                  : 5;
            },
            'interval': 23,
            'x': 80,
            'y': 100,
          },
          {
            'color': '#a11',
            'dx': -3,
            'dy': -5,
            'event': function(){
                if(core_random_boolean({
                  'chance': .23,
                })){
                    return;
                }

                this.color = this.dx === -3
                  ? '#a11'
                  : '#11a';
                this.dx = this.dx === -3
                  ? false
                  : -3;
                this.dy = this.dy === -5
                  ? false
                  : -5;
            },
            'interval': 23,
            'x': 130,
            'y': 80,
          },
        ];
    }

    create_gates(level_gates);
}
