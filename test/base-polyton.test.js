import {expect} from 'chai';
import {SingletonFactory} from 'singletons';
import {toArray} from 'argu';
import {BasePolytonFactory} from '../src/base-polyton';

describe('Testing BasePolyton on type Name', function () {
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
    const BasePolyton = BasePolytonFactory(
      SingletonFactory(Name, ['literal']),
      {}
    );
    this.BasePolyton = function (...args) {
      return new BasePolyton(...args.map(arg => toArray(arg)));
    };
  });

  it(`Unique argument ('Jamy')`, function () {
    const BasePolyton = this.BasePolyton;

    const p = new BasePolyton('Jamy');
    expect(p.length).to.equal(1);
    expect(p.elements).to.be.instanceof(Array);
    expect(p.elements[0]).not.to.be.undefined;
    expect(p.elements[0]).to.be.instanceof(this.Name);
    expect(p.elements[0].name).to.equal('Jamy');

    const name = p.get('Jamy');
    expect(name.name).to.equal('Jamy');

    name.setName('Henry');
    expect(name.name).not.to.equal('Jamy');
    expect(name.name).to.equal('Henry');
    expect(p.get('Jamy').name).to.equal('Henry');
    expect(p.get('Jamy')).to.equal(name); // 'Jamy': index once and for all

    expect(p).not.to.equal(new BasePolyton('Jamy'));
    expect((new BasePolyton('Jamy')).get('Jamy')).to.equal(name);
  });

  it(`Arguments ('Jamy', 'Henry', 'Carla')`, function () {
    const BasePolyton = this.BasePolyton;
    const names = ['Jamy', 'Henry', 'Carla'];

    const p = new BasePolyton(...names);
    expect(p.length).to.equal(3);
    expect(p.elements).to.be.instanceof(Array);

    p.elements.forEach((el, i) => {
      expect(el).not.to.be.undefined;
      expect(el).to.be.instanceof(this.Name);
      expect(el.name).to.equal(names[i]);

      const name = p.get(el.name);
      expect(name.name).to.equal(names[i]);

      name.setName('George');
      expect(name.name).not.to.equal(names[i]);
      expect(p.get(names[i]).name).to.equal('George');
      expect(p.get(names[i])).to.equal(name);

      expect(p.get('George')).to.be.undefined;
    });

    expect(p).not.to.equal(new BasePolyton(...names));
    (new BasePolyton(...names)).elements.forEach((el, i) => {
      expect(el).to.equal(p.get(names[i]));
    });
  });
});

describe('Testing BasePolyton on type FullName', function () {
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
    const BasePolyton = BasePolytonFactory(
      SingletonFactory(FullName, ['literal', 'literal']),
      {}
    );
    this.BasePolyton = function (...args) {
      return new BasePolyton(...args.map(arg => toArray(arg)));
    };
  });

  it(`Unique argument (['Jamy', 'Doe'])`, function () {
    const BasePolyton = this.BasePolyton;

    const p = new BasePolyton(['Jamy', 'Doe']);
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
    expect(p).not.to.equal(new BasePolyton(['Jamy', 'Doe']));
    expect((new BasePolyton(['Jamy', 'Doe'])).get('Jamy', 'Doe'))
      .to.equal(name);
  });

  it(`Arguments ('Jamy', 'Henry', 'Carla')`, function () {
    const BasePolyton = this.BasePolyton;
    const names = [['Jamy', 'Doe'], ['Henry', 'Ford'], ['Carla', 'Stone']];

    const p = new BasePolyton(...names);
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

    expect(p).not.to.equal(new BasePolyton(...names));
    (new BasePolyton(...names)).elements.forEach((el, i) => {
      expect(el).to.equal(p.get(...names[i]));
    });
  });
});
