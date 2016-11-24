import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';
import {ogArgs} from 'one-go';

describe('Testing Polyton on type Name', function() {

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

    this.name = 'Jamy';
    this.Polyton = PolytonFactory(Name);
    this.polyton = new this.Polyton(this.name);
  });

  afterEach(function() {
    this.polyton.setName(this.name);
  });

  it(`Polyton as singleton`, function() {

    expect(this.polyton.name).to.equal(this.name);
    expect(() => {
      this.polyton.setName('Johnny');
    }).not.to.throw();
    expect(this.polyton.name).to.equal('Johnny');
    expect(new this.Polyton(this.name)).to.equal(this.polyton);

  });

  it(`Polyton as array of singletons`, function() {

    const polyton = new this.Polyton([[this.name], ['Johnny'], ['Amy']]);

    polyton.setName('Johnny');

    expect(polyton.get('Jamy')).to.equal(this.polyton);
    expect(polyton.get('Johnny')).not.to.equal(this.polyton);
    expect(this.polyton.name).to.equal('Johnny');

    polyton.setName(ogArgs('Paris', 'London', 'New York'));

    expect(polyton.get('Jamy')).to.equal(this.polyton);
    expect(this.polyton.name).to.equal('Paris');
    expect(polyton.getName()).to.eql(['Paris', 'London', 'New York']);

  });

});

describe('Testing Polyton on type FullName', function() {

  before(function() {
    class FullName {
      constructor(firstname, lastname) {
        this.setName(firstname, lastname);
      }

      setName(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
      }
      getName() {
        return this.firstname + ' ' + this.lastname;
      }
    }

    this.firstname = 'Jamy';
    this.lastname = 'Doe';
    this.Polyton = PolytonFactory(FullName, ['literal', 'literal']);
    this.polyton = new this.Polyton(this.firstname, this.lastname);
  });

  afterEach(function() {
    this.polyton.setName(this.firstname, this.lastname);
  });

  it(`Polyton as singleton`, function() {

    expect(this.polyton.getName()).to.equal(this.firstname
      + ' ' + this.lastname);
    expect(() => {
      this.polyton.setName('Johnny', 'Brave');
    }).not.to.throw();
    expect(this.polyton.getName()).to.equal('Johnny Brave');
    expect(new this.Polyton(this.firstname, this.lastname))
      .to.equal(this.polyton);

  });

  it(`Polyton as array of singletons`, function() {

    const polyton = new this.Polyton([
      [this.firstname, this.lastname],
      ['Johnny', 'Brave'],
      ['Amy', 'Smart']
    ]);

    polyton.setName('Johnny', 'Brave');

    expect(polyton.get('Jamy', 'Doe')).to.equal(this.polyton);
    expect(polyton.get('Johnny', 'Brave')).not.to.equal(this.polyton);
    expect(this.polyton.getName()).to.equal('Johnny Brave');

    polyton.setName(ogArgs(
      ['Paris', 'France'],
      ['London', 'England'],
      ['New York', 'United-States']
    ));

    expect(polyton.get('Jamy', 'Doe')).to.equal(this.polyton);
    expect(this.polyton.getName()).to.equal('Paris France');
    expect(polyton.getName()).to.eql(['Paris France', 'London England',
      'New York United-States']);

  });

});
