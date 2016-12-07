import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing array behavior', function() {

  beforeEach(function() {
    class Name {
      constructor(name) {
        this.setName(name);
      }

      setName(name) {
        this.name = name;
      }
      getName() {
        return this.name;
      }
    }

    this.Name = Name;
    this.Polyton = PolytonFactory(Name, ['literal']);
  });

  it(`Testing forEach()`, function() {

    const polyton = new this.Polyton('Jamy', 'Henry', 'Carla');
    polyton.forEach(el => el.setName('George'));

    expect(polyton.elements.map(name => name.getName()))
      .to.eql(['George', 'George', 'George']);

  });

  it(`Testing map()`, function() {

    const polyton = new this.Polyton('Jamy', 'Henry', 'Carla');

    expect(polyton.map(name => name.getName()))
      .to.eql(['Jamy', 'Henry', 'Carla']);

  });

});
