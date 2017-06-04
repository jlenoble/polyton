import {expect} from 'chai';
import {PolytonFactory} from '../../src/polyton';

describe('Testing README examples', function () {
  it(`Usage example`, function () {
    class PlaneEquation { // Type for all the singletons within the Polyton
      constructor (a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
      }
      hasPoint (x, y, z) {
        return Math.abs(this.a * x + this.b * y + this.c * z + this.d) < 1e-10;
      }
    }

    const Polyton = PolytonFactory(PlaneEquation, ['literal', 'literal',
      'literal', 'literal']); // Create a Polyton type as list of PlaneEquations
      // initialized from lists of literals

    const planes = Polyton( // Instantiate an actual polyton
      [0, 0, 1, 0], // xOy
      [0, 1, 0, 0], // xOz
      [1, 0, 0, 0] // yOz
    );
    const Origin = [0, 0, 0];

    // Now you can recall plane equations using only the arguments though they
    // are not in scope

    expect(planes.get(1, 0, 0, 0).hasPoint(...Origin)).to.be.true;
    expect(planes.get(0, 1, 0, 0).hasPoint(...Origin)).to.be.true;
    expect(planes.get(0, 0, 1, 0).hasPoint(...Origin)).to.be.true;
    expect(() => planes.get(1, 0, 0, 3).hasPoint(...Origin)).to.throw(TypeError,
      `Cannot read property 'hasPoint' of undefined`);

    expect(Polyton.get(
      [0, 0, 1, 0], // xOy
      [0, 1, 0, 0], // xOz
      [1, 0, 0, 0] // yOz
    )).to.equal(planes);
    expect(Polyton.get(
      [1, 0, 0, 0], // yOz
      [0, 1, 0, 0], // xOz
      [0, 0, 1, 0] // xOy
    )).not.to.equal(planes);
  });
});
