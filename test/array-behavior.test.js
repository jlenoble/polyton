import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing array behavior', function () {
  beforeEach(function () {
    class Name {
      constructor (name) {
        this.setName(name);
      }

      setName (name) {
        this.name = name;
      }
      getName () {
        return this.name;
      }
    }

    this.Name = Name;
    this.Polyton = PolytonFactory(Name, ['literal']);
  });

  it(`Testing forEach()`, function () {
    const polyton = new this.Polyton('Jamy', 'Henry', 'Carla');
    polyton.forEach(el => el.setName('George'));

    expect(polyton.elements.map(name => name.getName()))
      .to.eql(['George', 'George', 'George']);
  });

  it(`Testing map()`, function () {
    const polyton = new this.Polyton('Jamy', 'Henry', 'Carla');

    expect(polyton.map(name => name.getName()))
      .to.eql(['Jamy', 'Henry', 'Carla']);
  });

  it(`Testing reduce()`, function () {
    const polyton = new this.Polyton('Jamy', 'Henry', 'Carla');

    expect(polyton.reduce((name1, name2) => {
      const _name1 = name1.getName ? name1.getName() : name1;
      const _name2 = name2.getName ? name2.getName() : name2;
      return _name1 + _name2;
    }, 'Bobby')).to.equal('BobbyJamyHenryCarla');
  });

  it(`Testing some()`, function () {
    const polyton = new this.Polyton('Jamy', 'Henry', 'Carla');

    expect(polyton.some(name => name.getName() === 'Henry')).to.be.true;
    expect(polyton.some(name => name.getName() === 'Henriette')).to.be.false;
  });

  it(`Testing every()`, function () {
    const polyton = new this.Polyton('Jamy', 'Henry', 'Carla');

    expect(polyton.every(name => name.getName() !== 'Henry')).to.be.false;
    expect(polyton.every(name => name.getName() !== 'Henriette')).to.be.true;
  });
});
