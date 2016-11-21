import Muter, {captured} from 'muter';
import {expect} from 'chai';
import Polyton from '../src/polyton';

describe('Testing Polyton', function() {

  const muter = Muter(console, 'log');

  it(`Class Polyton says 'Hello!'`, captured(muter, function() {
    new Polyton();
    expect(muter.getLogs()).to.equal('Hello!\n');
  }));

});
