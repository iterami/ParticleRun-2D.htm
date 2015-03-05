function load_level(){
    gates = [
      {
        'color': '#1a1',
        'dx': 0,
        'dy': 5,
        'interval': 0,
        'x': 0,
        'y': -250,
      },
      {
        'color': '#aa1',
        'dx': 1,
        'dy': 1,
        'interval': 55,
        'switch': function(){
            this.color = this.color == '#aa1'
              ? '#1aa'
              : '#aa1';
            this.dx = this.dx == 1
              ? -1
              : 1;
        },
        'x': 0,
        'y': 0,
      },
      {
        'color': '#aa1',
        'dx': 1,
        'dy': -1,
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
        'x': -100,
        'y': 100,
      },
      {
        'color': '#aaa',
        'dx': 0,
        'dy': 10,
        'interval': 0,
        'x': -100,
        'y': -300,
      },
      {
        'color': '#a11',
        'dx': 5,
        'dy': -1,
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
        'x': 100,
        'y': 100,
      },
    ];

    spawner = {
      'color': '#a1a',
      'dx': 0,
      'dy': 1,
      'interval': 10,
      'spawn': function(){
        this.interval = Math.ceil(Math.random() * 99);
        particles.push({
          'dx': spawner['dx'],
          'dy': spawner['dy'],
          'x': spawner['x'],
          'y': spawner['y'],
        });
      },
      'x': 0,
      'y': -300,
    };
}
