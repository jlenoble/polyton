import {expect} from 'chai';
import {PolytonFactory} from '../src/polyton';
import path from 'path';
import untildify from 'untildify';

describe('Testing get methods - PlaneEquation', function () {
  before(function () {
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

    // Create a Polyton type as
    // list of PlaneEquations initialized from lists of literals
    const Polyton = PolytonFactory(PlaneEquation, ['literal', 'literal',
      'literal', 'literal'], undefined, {unordered: true});

    const planes = Polyton( // Instantiate an actual polyton
      [0, 0, 1, 0], // xOy
      [0, 1, 0, 0], // xOz
      [1, 0, 0, 0] // yOz
    );
    const Origin = [0, 0, 0];

    Object.assign(this, {PlaneEquation, Polyton, planes, Origin});
  });

  it(`Testing instance Polyton get method`, function () {
    expect(this.planes.get(1, 0, 0, 0).hasPoint(...this.Origin)).to.be.true;
    expect(this.planes.get(0, 1, 0, 0).hasPoint(...this.Origin)).to.be.true;
    expect(this.planes.get(0, 0, 1, 0).hasPoint(...this.Origin)).to.be.true;
    expect(() => this.planes.get(1, 0, 0, 3).hasPoint(...this.Origin)).to.throw(
      TypeError, `Cannot read property 'hasPoint' of undefined`);
  });

  it(`Testing Polyton get static method`, function () {
    const planes = this.Polyton.get([0, 0, 1, 0], [0, 1, 0, 0], [1, 0, 0, 0]);

    expect(planes).to.equal(this.planes);
    expect(this.Polyton.get([0, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0]))
      .to.equal(this.planes);
    expect(this.Polyton.get([1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0]))
      .to.equal(this.planes);
    expect(this.Polyton.get([1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]))
      .not.to.equal(this.planes); // Make sure the unordering is not deep
  });
});

describe('Testing get methods - Paths', function () {
  before(function () {
    class Path {
      constructor (_path) {
        Object.defineProperty(this, 'path', {
          value: path.resolve(untildify(_path)),
          enumerable: true,
        });
      }
    }

    const Paths = PolytonFactory(Path, ['literal'], {
      customArgs: [
        [String, {
          convert (arg) {
            return path.resolve(untildify(arg));
          },
        }],
      ],
    }, {
      unique: true,

      properties: {
        paths: {
          get () {
            return this.map(el => el.path);
          },
        },
      },
    });

    const paths = new Paths('src', 'test');

    Object.assign(this, {Paths, paths});
  });

  it(`Testing instance Polyton get method`, function () {
    expect(this.paths.get(path.join(process.cwd(), 'src'))).to.equal(
      this.paths.get('src'));
    expect(this.paths.get(path.join(process.cwd(), 'test'))).to.equal(
      this.paths.get('test'));
    expect(this.paths.get('test')).not.to.equal(this.paths.get('src'));
  });

  it(`Testing Polyton get static method`, function () {
    expect(this.Paths.get(...this.paths.paths)).to.eql(this.paths);
    expect(this.Paths.looseGet(...this.paths.paths)).to.eql(this.paths);
    expect(this.Paths.get('src', 'test')).to.eql(this.paths);
    expect(this.Paths.looseGet('src', 'test')).to.eql(this.paths);
  });
});
