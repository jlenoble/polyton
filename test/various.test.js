import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';

describe('Testing PolytonFactory with various arguments', function() {

  [
    {
      title: `Type String and options ['literal']`,
      Type: String,
      options: ['literal'],
      args: ['Jamy'],
      get: 'toString'
    },
    {
      title: `Type String and options ['literal'], multiple inputs`,
      Type: String,
      options: ['literal'],
      args: ['Jamy', 'Bob', 'Bill'],
      get: 'toString'
    },
    {
      title: `Type Number and options ['literal']`,
      Type: Number,
      options: ['literal'],
      args: [12],
      get: 'valueOf'
    },
    {
      title: `Type Number and options ['literal'], multiple inputs`,
      Type: Number,
      options: ['literal'],
      args: [12, 21, 64],
      get: 'valueOf'
    }
  ].forEach(test => {

    const {title, Type, options, args, get} = test;

    it(title, function() {

      const Polyton = PolytonFactory(Type, options);

      const p = new Polyton(...args);
      expect(p.length).to.equal(args.length);
      p.elements.forEach((el, i) => {
        expect(el[get]()).to.equal(args[i]);
      });

      expect(p).to.equal(new Polyton(...args));
    });

  });

});
