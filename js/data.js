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

    if(id === 1){

    }else{
        var level_gates = [
          {
            'color': '#a1a',
            'change': function(){
                this.interval = core_random_integer({
                  'max': 99,
                  'todo': 'ceil',
                });

                if(core_entity_info['particle']['count'] < core_storage_data['max-particles']){
                    core_entity_create({
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
                core_entities[particle]['dy'] *= 1.1;
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
                core_entities[particle]['dx'] = this.color === '#aa1'
                  ? 1
                  : -1;
                core_entities[particle]['dy'] = 1;
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
                    core_entities[particle]['dx'] = 1;
                    core_entities[particle]['dy'] = -1;

                }else{
                    core_entities[particle]['dx'] = 0;
                    core_entities[particle]['dy'] = -10;
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
                core_entities[particle]['dy'] *= -1;
            },
            'height': 20,
            'x': -140,
            'y': -300,
            'width': 80,
          },
          {
            'color': '#a11',
            'change': function(){
                if(core_random_boolean({
                  'chance': .23,
                })){
                    return;
                }

                this.color = this.color === '#a11'
                  ? '#1a1'
                  : '#a11';
            },
            'event': function(particle){
                if(this.color === '#1a1'){
                    core_entities[particle]['dx'] = -1;

                }else{
                    core_entities[particle]['dx'] = 5;
                }

                core_entities[particle]['dy'] = -1;
            },
            'interval': 23,
            'x': 80,
            'y': 100,
          },
          {
            'color': '#a11',
            'change': function(){
                if(core_random_boolean({
                  'chance': .23,
                })){
                    return;
                }

                this.color = this.color === '#11a'
                  ? '#a11'
                  : '#11a';
            },
            'event': function(particle){
                if(this.color === '#11a'){
                    core_entities[particle]['dx'] = -3;
                    core_entities[particle]['dy'] = -5;
                }
            },
            'interval': 23,
            'x': 130,
            'y': 80,
          },
        ];
    }

    for(var gate in level_gates){
        core_entity_create({
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
