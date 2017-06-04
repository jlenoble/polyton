import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing complex arguments', function () {
  it(`basePolytonSingletonOptions = [{unordered: true, unique: true}]`,
  function () {
    class Person {
      constructor (firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
      }
    }

    const Team = PolytonFactory(Person, ['literal', 'literal'],
      [{unordered: true, unique: true}]);

    const t1 = new Team(['David', 'Grey'], ['Philip', 'Strong'], ['Al',
      'Short'], ['Patrick', 'Barnes']);
    const t2 = new Team(['David', 'Grey'], ['Philip', 'Strong'], ['Al',
      'Short'], ['Patrick', 'Barnes']);
    const t3 = new Team(['Philip', 'Strong'], ['Al', 'Short'],
      ['David', 'Grey'], ['Patrick', 'Barnes']);
    const t4 = new Team(['Philip', 'Strong'], ['Al', 'Short'], ['Al', 'Short'],
      ['David', 'Grey'], ['Patrick', 'Barnes'], ['Al', 'Short']);

    expect(t1).to.equal(t2);
    expect(t1).to.equal(t3);
    expect(t1).to.equal(t4);
  });

  it(`Different objects with same literal expansion`, function () {
    class Person {
      constructor (firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
      }
    }

    const Does = PolytonFactory(Person, ['object']);

    const p1 = new Person('John', 'Doe');
    const p2 = new Person('John', 'Doe');
    const p3 = new Person('John', 'Doe');
    const p4 = new Person('John', 'Doe');

    let d1 = new Does(p1, p2, p3, p4);
    let d2 = new Does(p1, p2, p3, p4);
    let d3 = new Does(p4, p2, p3, p1);

    expect(d1).to.equal(d2);
    expect(d1).not.to.equal(d3);

    const Does2 = PolytonFactory(Person, [{
      type: 'option',
      sub: {p: 'object'},
    }]);

    d1 = new Does2({p: p1}, {p: p2}, {p: p3}, {p: p4});
    d2 = new Does2({p: p1}, {p: p2}, {p: p3}, {p: p4});
    d3 = new Does2({p: p4}, {p: p2}, {p: p3}, {p: p1});

    expect(d1).to.equal(d2);
    expect(d1).not.to.equal(d3);
  });
});
