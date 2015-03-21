function load_level(){
    gates = [
      {
        'color': '#1a1',
        'dx': 0,
        'dy': 5,
        'height': 40,
        'interval': 0,
        'x': -20,
        'y': -250,
        'width': 40,
      },
      {
        'color': '#aa1',
        'dx': 1,
        'dy': 1,
        'height': 40,
        'interval': 55,
        'switch': function(){
            this.color = this.color == '#aa1'
              ? '#1aa'
              : '#aa1';
            this.dx = this.dx == 1
              ? -1
              : 1;
        },
        'x': -20,
        'y': 0,
        'width': 40,
      },
      {
        'color': '#aa1',
        'dx': 1,
        'dy': -1,
        'height': 40,
        'interval': 42,
        'switch': function(){
            this.color = this.color == '#aa1'
              ? '#1aa'
              : '#aa1';
            this.dx = this.dx == 0
              ? 1
              : 0;
            this.dy = this.dy == -1
              ? -10
              : -1;
        },
        'x': -120,
        'y': 100,
        'width': 40,
      },
      {
        'color': '#aaa',
        'dx': 0,
        'dy': 10,
        'height': 20,
        'interval': 0,
        'x': -140,
        'y': -300,
        'width': 80,
      },
      {
        'color': '#a11',
        'dx': 5,
        'dy': -1,
        'height': 40,
        'interval': 23,
        'switch': function(){
            if(Math.random() > .23){
                return;
            }

            this.color = this.color == '#a11'
              ? '#1a1'
              : '#a11';
            this.dx = this.dx == 5
              ? -1
              : 5;
        },
        'x': 80,
        'y': 100,
        'width': 40,
      },
    ];

    spawner = {
      'color': '#a1a',
      'dx': 0,
      'dy': 1,
      'height': 40,
      'interval': 10,
      'spawn': function(){
        this.interval = Math.ceil(Math.random() * 99);

        if(particles.length >= settings['max-particles']){
            return;
        }

        particles.push({
          'dx': this['dx'],
          'dy': this['dy'],
          'x': this['x'] + 20,
          'y': this['y'] + 20,
        });
      },
      'x': -20,
      'y': -300,
      'width': 40,
    };
}
