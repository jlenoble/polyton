import {expect} from 'chai';
import {BasePolytonFactory} from '../src/polyton';

describe('Testing BasePolyton on type Name', function() {

  before(function() {
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
    this.BasePolyton = BasePolytonFactory(Name);
  });

  it(`Unique argument ('Jamy')`, function() {

    const BasePolyton = this.BasePolyton;

    const p = new BasePolyton('Jamy');
    expect(p.length).to.equal(1);
    expect(p.elements).to.be.instanceof(Array);
    expect(p.elements[0]).not.to.be.undefined;
    expect(p.elements[0]).to.be.instanceof(this.Name);
    expect(p.elements[0].name).to.equal('Jamy');

    const name = p.at(0);
    expect(name.name).to.equal('Jamy');

    name.setName('Henry');
    expect(name.name).not.to.equal('Jamy');
    expect(p.at(0).name).to.equal('Henry');
    expect(p.at(0)).to.equal(name);

    expect(p.get('Henry')).to.be.undefined;
    expect(p.get('Jamy')).to.equal(name); // 'Jamy': index once and for all

  });

});
