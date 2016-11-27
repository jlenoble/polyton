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
    this.polyton.at(0).setName(this.name);
  });

  it(`Polyton as [singleton]`, function() {

    expect(this.polyton.length).to.equal(1);
    expect(this.polyton.at(0).name).to.equal(this.name);
    expect(() => {
      this.polyton.at(0).setName('Johnny');
    }).not.to.throw();
    expect(this.polyton.at(0).name).to.equal('Johnny');
    expect(new this.Polyton(this.name).at(0)).to.equal(this.polyton.at(0));
    expect(new this.Polyton(this.name).at(0).name).to.equal('Johnny');
    expect(new this.Polyton(this.name)).to.equal(this.polyton);

  });

  it(`Polyton as [...singletons]`, function() {

    const polyton = new this.Polyton([[this.name], ['Johnny'], ['Amy']]);

    expect(polyton).not.to.equal(this.polyton);
    expect(polyton.length).to.equal(3);
    expect(polyton.at(0).name).to.equal(this.name);
    expect(() => {
      polyton.at(0).setName('Johnny');
    }).not.to.throw();
    expect(polyton.at(0).name).to.equal('Johnny');
    expect(polyton.at(1).name).to.equal('Johnny');
    expect(polyton.at(2).name).to.equal('Amy');
    expect(polyton.at(0)).not.to.equal(polyton.at(1));
    expect(new this.Polyton([[this.name], ['Johnny'], ['Amy']]).at(1))
      .to.equal(polyton.at(1));
    expect(new this.Polyton([[this.name], ['Johnny'], ['Amy']]).at(1).name)
      .to.equal('Johnny');
    expect(new this.Polyton([this.name, 'Johnny', 'Amy']))
      .to.equal(polyton);
    expect(new this.Polyton(this.name, 'Johnny', 'Amy'))
      .to.equal(polyton);

    expect(polyton.get('Jamy')).to.equal(polyton.at(0));
    expect(polyton.get('Johnny')).to.equal(polyton.at(1));
    expect(polyton.get('Amy')).to.equal(polyton.at(2));

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
    this.polyton = new this.Polyton([[this.firstname, this.lastname]]);
  });

  it(`Polyton as [singleton]`, function() {

    expect(this.polyton.at(0).getName()).to.equal(this.firstname
      + ' ' + this.lastname);
    expect(() => {
      this.polyton.at(0).setName('Johnny', 'Brave');
    }).not.to.throw();
    expect(this.polyton.at(0).getName()).to.equal('Johnny Brave');
    expect(new this.Polyton(this.firstname, this.lastname))
      .not.to.equal(this.polyton);
    expect(new this.Polyton([this.firstname, this.lastname]))
      .not.to.equal(this.polyton);
    expect(new this.Polyton([[this.firstname, this.lastname]]))
      .to.equal(this.polyton);

  });

  it(`Polyton as [...singletons]`, function() {

    const polyton = new this.Polyton([
      [this.firstname, this.lastname],
      ['Johnny', 'Brave'],
      ['Amy', 'Smart']
    ]);

    polyton.at(0).setName('Johnny', 'Brave');

    expect(polyton.get('Jamy', 'Doe')).to.equal(this.polyton.at(0));
    expect(polyton.get('Jamy', 'Doe')).to.equal(polyton.at(0));
    expect(polyton.get('Johnny', 'Brave')).to.equal(polyton.at(1));
    expect(polyton.get('Amy', 'Smart')).to.equal(polyton.at(2));
    expect(this.polyton.at(0).getName()).to.equal('Johnny Brave');

  });

});
