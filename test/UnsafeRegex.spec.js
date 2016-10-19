const expect = require('chai').expect;
const config = require('./config');

const UnsafeRegex = require('../lib/models/UnsafeRegex.class');

describe('UnsafeRegex', function(){
  describe('#constructor()', function() {
    const unsafe = new UnsafeRegex(config.unsaferegex, 1);
    const badunsafe = new UnsafeRegex('a bad position', 'very bad');

    it('should have a regex', function() {
      expect(unsafe.regex).to.equal(config.unsaferegex);
      expect(badunsafe.regex).to.equal('a bad position');
    });

    it('should have a position that is a number', function() {
      expect(unsafe.position).to.be.a('number').and.to.equal(1);
      expect(badunsafe.position).to.be.a('number').and.to.equal(-1);
    });
  });
});
