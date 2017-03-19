import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing prototype extension', function () {
  beforeEach(function () {
    class Name {
      constructor (name) {
        this.setName(name);
      }

      setName (name) {
        this.name = name;
      }
      getName (name) {
        return this.name;
      }
    }

    this.Name = Name;
    this.Polyton = PolytonFactory(Name, ['literal'], undefined, {
      extend: {
        getNames () {
          return this.map(name => name.getName());
        },
      },
    });
  });

  it(`Adding a getNames() method`, function () {
    const polyton = new this.Polyton('Eric', 'Charles', 'Betty');
    expect(polyton.getNames()).to.eql(['Eric', 'Charles', 'Betty']);
  });
});
