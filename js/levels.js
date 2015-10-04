'use strict';

function load_level(id){
    boundaries = {
      'bottom': 999,
      'left': -999,
      'right': 999,
      'top': -999,
    };

    if(id === 1){
        var level_gates = [
          {
            'color': '#a1a',
            'dy': 1,
            'event': function(){
                this.interval = Math.ceil(Math.random() * 99);

                if(particles.length >= settings['max-particles']){
                    return;
                }

                particles.push({
                  'dx': this['dx'],
                  'dy': this['dy'],
                  'x': this['x'] + Math.floor(Math.random() * this['width']) - 2,
                  'y': this['y'] + Math.floor(Math.random() * this['width']) - 2,
                });
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
                if(Math.random() > .23){
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
                if(Math.random() > .23){
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
