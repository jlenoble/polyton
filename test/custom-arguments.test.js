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

  it(`spread`, function () {
    class Name {
      constructor (name) {
        this.name = name;
      }
    }

    const Names = PolytonFactory(Name, ['literal'], {
      customArgs: [
        [Name, {
          convert ({name}) {
            return name;
          },
        }],
      ],
    }, {
      unordered: true,
      unique: true,

      spread (names) {
        return names.getNames();
      },

      extend: {
        getNames () {
          return this.map(el => el.name);
        },
      },
    });

    const n1 = new Names('Tito', 'Claudio', 'Mario');
    const n2 = new Names('Pipa', 'Claudia', 'Maria');

    expect(n1.getNames()).to.eql(['Tito', 'Claudio', 'Mario']);
    expect(n2.getNames()).to.eql(['Pipa', 'Claudia', 'Maria']);

    const n = new Names(n1, 'François', n2, new Name('Pierre'));

    expect(n.getNames()).to.eql([
      'Tito', 'Claudio', 'Mario',
      'François',
      'Pipa', 'Claudia', 'Maria',
      'Pierre',
    ]);
  });

  it(`shallowSpread`, function () {
    class Person {
      constructor (name) {
        this.name = name;
        this.friends = new Set();
      }

      addFriend (friend) {
        this.friends.add(friend);
        friend.friends.add(this);
      }
    }

    const Friends = PolytonFactory(Person, ['literal'], {
      customArgs: [
        [Person, {
          convert ({name}) {
            return name;
          },
        }],
      ],
    }, {
      unordered: true,
      unique: true,

      shallowSpread (friends) {
        return friends.elements;
      },

      postprocess () {
        for (let i = 0, l = this.length; i < l; i++) {
          for (let j = i+1; j < l; j++) {
            this.elements[i].addFriend(this.elements[j]);
          }
        }
      },

      extend: {
        getNames () {
          return this.map(el => el.name);
        },
      },
    });

    const john = new Person('John');
    const brian = new Person('Brian');
    const sophie = new Person('Sophie');

    const friends = new Friends(john, brian, sophie);
    expect(friends.getNames()).to.eql(['John', 'Brian', 'Sophie']);
    expect(Array.from(friends.get('John').friends).map(el => el.name)).to.eql(
      ['Brian', 'Sophie']);
    expect(Array.from(friends.get('Brian').friends).map(el => el.name)).to.eql(
      ['John', 'Sophie']);
    expect(Array.from(friends.get('Sophie').friends).map(el => el.name)).to.eql(
      ['John', 'Brian']);

    const laetitia = new Person('Lætitia');

    const newFriends = new Friends(laetitia, friends);
    expect(newFriends.getNames()).to.eql(
      ['Lætitia', 'John', 'Brian', 'Sophie']);
    expect(Array.from(newFriends.get('Lætitia').friends).map(el => el.name))
      .to.eql(['John', 'Brian', 'Sophie']);
    expect(Array.from(newFriends.get('John').friends).map(el => el.name))
      .to.eql(['Brian', 'Sophie', 'Lætitia']);
    expect(Array.from(newFriends.get('Brian').friends).map(el => el.name))
      .to.eql(['John', 'Sophie', 'Lætitia']);
    expect(Array.from(newFriends.get('Sophie').friends).map(el => el.name))
      .to.eql(['John', 'Brian', 'Lætitia']);

    expect(Array.from(friends.get('Lætitia').friends).map(el => el.name))
      .to.eql(['John', 'Brian', 'Sophie']);
    expect(Array.from(friends.get('John').friends).map(el => el.name))
      .to.eql(['Brian', 'Sophie', 'Lætitia']);
    expect(Array.from(friends.get('Brian').friends).map(el => el.name))
      .to.eql(['John', 'Sophie', 'Lætitia']);
    expect(Array.from(friends.get('Sophie').friends).map(el => el.name))
      .to.eql(['John', 'Brian', 'Lætitia']);

    // Watch out: Factories make singletons, they don't transform already
    // existing objects into ones.
    expect(laetitia.friends.size).to.equal(0);
    expect(john.friends.size).to.equal(0);
    expect(brian.friends.size).to.equal(0);
    expect(sophie.friends.size).to.equal(0);
  });
});
