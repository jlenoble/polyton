import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing adding properties', function () {
  it(`Adding `, function () {
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

    const Polyton = PolytonFactory(Name, ['literal'], undefined, {
      properties: {
        names: {
          get () {
            return this.map(name => name.getName());
          },
        },
      },
    });

    const polyton = new Polyton('Eric', 'Charles', 'Betty');
    expect(polyton.names).to.eql(['Eric', 'Charles', 'Betty']);
  });
});
