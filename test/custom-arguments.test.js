import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing custom arguments within arguments', function () {
  it(`convert, postprocess and reduce`, function () {
    class Name {
      constructor (name) {
        this.name = name;
        this.friends = new Set();
      }
    }

    class Age {
      constructor (age) {
        this.age = age;
      }
    }

    class Gender {
      constructor (gender) {
        this.gender = gender;
      }
    }

    class Country {
      constructor (country) {
        this.country = country;
      }
    }

    class Friend {
      constructor (friend) {
        this.friend = friend;
      }
    }

    const Contacts = PolytonFactory(Name, ['literal'], {
      customArgs: [
        [Name, {
          convert ({name}) {
            return name;
          },
        }],
        [Age, {
          postprocess ({age}) {
            this.age = age;
          },
        }],
        [Gender, {
          postprocess ({gender}) {
            this.gender = gender;
          },
        }],
        [Country, {
          postprocess ({country}) {
            this.country = country;
          },
        }],
        [Friend, {
          reduce (friends) {
            return friends.reduce((array, {friend}) => {
              return array.concat([friend]);
            }, []);
          },
          postprocess (friends) {
            friends.forEach(friend => this.friends.add(
              new Contacts.Singleton(friend)));
          },
        }],
      ],
    }, {unique: true, unordered: true});

    const contacts = new Contacts(
      ['Paul'],
      [new Name('Paula'), new Gender('female')],
      [new Country('England'), 'John', new Age(55)]
    );

    const [paul, paula, john] = contacts.elements;

    expect(paul.name).to.equal('Paul');
    expect(paula.name).to.equal('Paula');
    expect(john.name).to.equal('John');

    expect(paula.gender).to.equal('female');
    expect(john.age).to.equal(55);
    expect(john.country).to.equal('England');

    expect(new Contacts.Singleton('John', new Gender('male'), new Age(56),
      new Country('France'), new Friend('Paula'),
      new Friend('Paul'))).to.equal(john);
    expect(john.gender).to.equal('male');
    expect(john.age).to.equal(56);
    expect(john.country).to.equal('France');

    expect(john.friends.has(paula)).to.be.true;
    expect(john.friends.has(paul)).to.be.true;
    expect(john.friends.size).to.equal(2);
  });
});
