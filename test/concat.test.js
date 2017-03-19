import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing concatenation', function () {
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
    this.Polyton = PolytonFactory(Name, ['literal']);
  });

  it(`Testing with class Name`, function () {
    const p1 = new this.Polyton('Eric', 'Charles', 'Betty');
    const p2 = p1.concat('Albert', 'Mary');

    expect(p2).to.equal(new this.Polyton('Eric', 'Charles', 'Betty', 'Albert',
      'Mary'));
  });
});
