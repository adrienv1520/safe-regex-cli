const expect = require('chai').expect;
const config = require('./config');

const FileToSafe = require('../lib/models/FileToSafe.class');

describe('FileToSafe', function(){
  describe('#constructor()', function() {
    const safe = new FileToSafe(config.safefile);
    const unsafe = new FileToSafe(config.unsafefile, 255);
    const phantom = new FileToSafe(config.phantompath, 'bad limit');
    context('when file exists', function() {
      it('should have a file path', function() {
        expect(safe.file).to.exist.and.to.equal(config.safefile);
        expect(unsafe.file).to.exist.and.to.equal(config.unsafefile);
      });
    });

    context('when file does not exist', function() {
      it('should not have a file path', function() {
        expect(phantom.file).to.not.exist;
      });
    });

    it('should have a limit option by default', function() {
      expect(safe.limit).to.exist.and.to.be.a('number').and.to.be.above(0);
      expect(phantom.limit).to.exist.and.to.be.a('number').and.to.be.above(0);
    });

    it('should have a limit option according to parameter', function() {
      expect(unsafe.limit).to.exist.and.to.be.a('number').and.to.equal(255);
    });

    it('should have an array of unsafe regex that is empty', function() {
      expect(safe.unsafeRegexArray).to.exist.and.to.be.a('array').and.to.be.empty;
      expect(unsafe.unsafeRegexArray).to.exist.and.to.be.a('array').and.to.be.empty;
      expect(phantom.unsafeRegexArray).to.exist.and.to.be.a('array').and.to.be.empty;
    });
  });

  describe('#getUnsafeRegexInFileSync()', function() {
    const safe = new FileToSafe(config.safefile);
    const unsafe = new FileToSafe(config.unsafefile, 255);
    const phantom = new FileToSafe(config.phantompath, 'bad limit');
    context('when file contains unsafe regex', function() {
      it('should have unsafe regex', function() {
        unsafe.getUnsafeRegexInFileSync();
        expect(unsafe.unsafeRegexArray).to.have.length.above(0);
      });
    });

    context('when file does not contain unsafe regex', function() {
      it('should not have unsafe regex', function() {
        safe.getUnsafeRegexInFileSync();
        expect(safe.unsafeRegexArray).to.be.empty;
      });
    });

    context('when file does not exist', function() {
      it('should not throw', function() {
        expect(phantom.getUnsafeRegexInFileSync).to.not.throw;
      });
      it('should not have unsafe regex', function() {
        phantom.getUnsafeRegexInFileSync();
        expect(phantom.unsafeRegexArray).to.be.empty;
      });
    });
  });

  describe('#getUnsafeRegexInFile()', function() {
    const safe = new FileToSafe(config.safefile);
    const unsafe = new FileToSafe(config.unsafefile, 255);
    const phantom = new FileToSafe(config.phantompath, 'bad limit');
    context('when file contains unsafe regex', function() {
      it('should have unsafe regex', function(done) {
        unsafe.getUnsafeRegexInFile((err) => {
          if (err) return done(err);
          expect(unsafe.unsafeRegexArray).to.have.length.above(0);
          done();
        });
      });
    });

    context('when file does not contain unsafe regex', function() {
      it('should not have unsafe regex', function(done) {
        safe.getUnsafeRegexInFile((err) => {
          if (err) return done(err);
          expect(safe.unsafeRegexArray).to.be.empty;
          done();
        });
      });
    });

    context('when file does not exist', function() {
      it('should have an error and no unsafe regex', function(done) {
        phantom.getUnsafeRegexInFile((err) => {
          expect(err).to.exist.and.to.be.a('error');
          expect(phantom.unsafeRegexArray).to.be.empty;
          done();
        });
      });
    });
  });

  describe('#getUnsafeRegexInData()', function() {
    it('should add unsafe regex-style "/ /", new RegExp(...) and new RegExp(..., ...) to unsafeRegexArray', function() {
      const phantom = new FileToSafe(config.phantompath);
      expect(phantom.unsafeRegexArray).to.be.empty;

      phantom.getUnsafeRegexInData("/(safe+){10}/");
      expect(phantom.isUnsafe()).to.be.true;
      expect(phantom.unsafeRegexArray[0].regex.toString()).to.equal('/(safe+){10}/');

      phantom.unsafeRegexArray = [];

      phantom.getUnsafeRegexInData('/(safe-regex-cli+){10}/g');
      expect(phantom.isUnsafe()).to.be.true;
      expect(phantom.unsafeRegexArray[0].regex.toString()).to.equal('/(safe-regex-cli+){10}/g');


      // for (const [regex, data] of config.unsafemap) {
      //   safe.getUnsafeRegexInData(data);
      //
      //   let i = safe.unsafeRegexArray.length - 1;
      //   console.log('iiiiiii = ' + i);
      //   if (i >= 0) {
      //     expect(regex).to.equal(safe.unsafeRegexArray[safe.unsafeRegexArray.length - 1].regex.toString());
      //   }
      // }

    });
  });
});
