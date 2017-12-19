import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing more methods on elements', function () {
  it(`Testing forEachPair()`, function () {
    const Polyton = PolytonFactory(String, ['literal']);
    const polyton = new Polyton('a', 'b', 'c');

    const strings = [];
    polyton.forEachPair((s1, s2) => {
      strings.push(s1 + s2);
    });

    expect(strings).to.eql([
      'ab', 'ac',
      'ba', 'bc',
      'ca', 'cb',
    ]);
  });

  it(`Testing forEachTriangular()`, function () {
    const Polyton = PolytonFactory(Number, ['literal']);
    const polyton = new Polyton(2015, 2016, 2017);

    const copyrights = [];
    polyton.forEachTriangular((n1, n2) => {
      copyrights.push(`© ${n1}-${n2} John Doe (jdoe@example.com)`);
    });

    expect(copyrights).to.eql([
      '© 2015-2016 John Doe (jdoe@example.com)',
      '© 2015-2017 John Doe (jdoe@example.com)',
      '© 2016-2017 John Doe (jdoe@example.com)',
    ]);
  });

  it(`Testing mapPair()`, function () {
    const Polyton = PolytonFactory(String, ['literal']);
    const polyton = new Polyton('a', 'b', 'c');

    expect(polyton.mapPair((s1, s2) => {
      return s1 + s2;
    })).to.eql([
      'ab', 'ac',
      'ba', 'bc',
      'ca', 'cb',
    ]);
  });

  it(`Testing mapTriangular()`, function () {
    const Polyton = PolytonFactory(Number, ['literal']);
    const polyton = new Polyton(2015, 2016, 2017);

    expect(polyton.mapTriangular((n1, n2) => {
      return `© ${n1}-${n2} John Doe (jdoe@example.com)`;
    })).to.eql([
      '© 2015-2016 John Doe (jdoe@example.com)',
      '© 2015-2017 John Doe (jdoe@example.com)',
      '© 2016-2017 John Doe (jdoe@example.com)',
    ]);
  });
});
