import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing Polyton on type Name', function () {
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

  it(`Unique argument ('Jamy')`, function () {
    const Polyton = this.Polyton;

    const p = new Polyton('Jamy');
    expect(p.length).to.equal(1);
    expect(p.elements).to.be.instanceof(Array);
    expect(p.elements[0]).not.to.be.undefined;
    expect(p.elements[0]).to.be.instanceof(this.Name);
    expect(p.elements[0].name).to.equal('Jamy');

    const name = p.get('Jamy');
    expect(name.name).to.equal('Jamy');

    name.setName('Henry');
    expect(name.name).not.to.equal('Jamy');
    expect(p.get('Jamy').name).to.equal('Henry');

    expect(p.get('Henry')).to.be.undefined;
    expect(p.get('Jamy')).to.equal(name); // 'Jamy': index once and for all

    expect(p).to.equal(new Polyton('Jamy')); // Polytons are singletons
  });

  it(`Arguments ('Jamy', 'Henry', 'Carla')`, function () {
    const Polyton = this.Polyton;
    const names = ['Jamy', 'Henry', 'Carla'];

    const p = new Polyton(...names);
    expect(p.length).to.equal(3);
    expect(p.elements).to.be.instanceof(Array);

    p.elements.forEach((el, i) => {
      expect(el).not.to.be.undefined;
      expect(el).to.be.instanceof(this.Name);
      expect(el.name).to.equal(names[i]);

      const name = p.get(names[i]);
      expect(name.name).to.equal(names[i]);

      name.setName('George');
      expect(name.name).not.to.equal(names[i]);
      expect(p.get(names[i]).name).to.equal('George');
      expect(p.get(names[i])).to.equal(name);

      expect(p.get('George')).to.be.undefined;
    });

    expect(p).to.equal(new Polyton(...names)); // Singleton!
  });
});

describe('Testing Polyton on type FullName', function () {
  beforeEach(function () {
    class FullName {
      constructor (firstname, lastname) {
        this.setName(firstname, lastname);
      }

      setName (firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
      }
      getName () {
        return this.firstname + ' ' + this.lastname;
      }
    }

    this.FullName = FullName;
    this.Polyton = PolytonFactory(FullName,
      ['literal', 'literal']);
  });

  it(`Unique argument (['Jamy', 'Doe'])`, function () {
    const Polyton = this.Polyton;

    const p = new Polyton(['Jamy', 'Doe']);
    expect(p.length).to.equal(1);
    expect(p.elements).to.be.instanceof(Array);
    expect(p.elements[0]).not.to.be.undefined;
    expect(p.elements[0]).to.be.instanceof(this.FullName);
    expect(p.elements[0].getName()).to.equal('Jamy Doe');

    const name = p.get('Jamy', 'Doe');
    expect(name.getName()).to.equal('Jamy Doe');

    name.setName('Henry', 'Ford');
    expect(name.getName()).not.to.equal('Jamy Doe');
    expect(p.get('Jamy', 'Doe').getName()).to.equal('Henry Ford');
    expect(p.get('Jamy', 'Doe')).to.equal(name);

    expect(p.get('Henry', 'Ford')).to.be.undefined;

    expect(p).to.equal(new Polyton(['Jamy', 'Doe']));
  });

  it(`Arguments ('Jamy', 'Henry', 'Carla')`, function () {
    const Polyton = this.Polyton;
    const names = [['Jamy', 'Doe'], ['Henry', 'Ford'], ['Carla', 'Stone']];

    const p = new Polyton(...names);
    expect(p.length).to.equal(3);
    expect(p.elements).to.be.instanceof(Array);

    p.elements.forEach((el, i) => {
      expect(el).not.to.be.undefined;
      expect(el).to.be.instanceof(this.FullName);
      expect(el.getName()).to.equal(names[i].join(' '));

      const name = p.get(...names[i]);
      expect(name.getName()).to.equal(names[i].join(' '));

      name.setName('George', 'Bleep');
      expect(name.getName()).not.to.equal(names[i].join(' '));
      expect(p.get(...names[i]).getName()).to.equal('George Bleep');
      expect(p.get(...names[i])).to.equal(name);

      expect(p.get('George', 'Bleep')).to.be.undefined;
    });

    expect(p).to.equal(new Polyton(...names));
  });
});
