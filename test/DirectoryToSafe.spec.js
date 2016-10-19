const expect = require('chai').expect;
const config = require('./config');

const DirectoryToSafe = require('../lib/models/DirectoryToSafe.class');

describe('DirectoryToSafe', function(){

  describe('#constructor()', function() {
    const directoryWithFiles = new DirectoryToSafe({dirorfile: config.regexdir});
    const directoryWithFile = new DirectoryToSafe({dirorfile: config.unsafefile, limit: 255});
    const directoryEmpty = new DirectoryToSafe({dirorfile: config.emptydir});
    const directoryPhantom = new DirectoryToSafe({dirorfile: config.phantompath});

    context('when path exists and leads to a directory or a file', function() {
      context('when path represents a directory', function() {
        it('should have a directory', function(){
          expect(directoryWithFiles.directory).to.equal(config.regexdir);
        });
        context('when directory has files', function() {
          it('should have an array of files to safe that is not empty', function(){
            expect(directoryWithFiles.filesToSafe).to.be.a('array').and.to.have.length;
          });
        });
        context('when directory is empty', function() {
          it('should have an array of files to safe that is empty', function(){
            expect(directoryEmpty.filesToSafe).to.be.a('array').and.to.be.empty;
          });
        });
        context('when recursive option is true', function() {
          const directoryWithFilesAndDirectories = new DirectoryToSafe({dirorfile: config.regexdir, recursive: true});
          it('should have recursive to true', function() {
            expect(directoryWithFilesAndDirectories.recursive).to.be.true;
          });
          it('should add each file in directory and subdirectories to filesToSafe array', function() {
            expect(directoryWithFilesAndDirectories.filesToSafe).to.have.length(3);
          });
        });
      });

      context('when path represents a file', function() {
        it('should have a directory', function(){
          expect(directoryWithFile.directory).to.equal(config.regexdir);
        });
        it('should have an array of files to safe with only one file', function(){
          expect(directoryWithFile.filesToSafe).to.be.a('array').and.to.have.length(1);
        });
      });
    });

    context('when path does not exist', function() {
      it('should not have a directory', function(){
        expect(directoryPhantom.directory).to.not.exist;
      });
      it('should have an array of files to safe that is empty', function(){
        expect(directoryPhantom.filesToSafe).to.be.a('array').and.to.be.empty;
      });
    });

    context('whenever a path exist or not', function() {
      it('should have a recursive option that is a boolean and false', function(){
        expect(directoryWithFiles.recursive).to.be.a('boolean').and.to.be.false;
        expect(directoryWithFile.recursive).to.be.a('boolean').and.to.be.false;
        expect(directoryEmpty.recursive).to.be.a('boolean').and.to.be.false;
        expect(directoryPhantom.recursive).to.be.a('boolean').and.to.be.false;
      });
      it('should have a map of unsafe files that is empty', function(){
        expect(directoryWithFiles.unsafeFilesMap).to.be.a('map').and.to.be.empty;
        expect(directoryWithFile.unsafeFilesMap).to.be.a('map').and.to.be.empty;
        expect(directoryEmpty.unsafeFilesMap).to.be.a('map').and.to.be.empty;
        expect(directoryPhantom.unsafeFilesMap).to.be.a('map').and.to.be.empty;
      });
      it('should have a limit option that is a number', function(){
        expect(directoryWithFiles.limit).to.be.a('number');
        expect(directoryWithFile.limit).to.be.a('number');
        expect(directoryEmpty.limit).to.be.a('number');
        expect(directoryPhantom.limit).to.be.a('number');
      });
      it('should have a limit option set according to parameter', function() {
        expect(directoryWithFile.limit).to.equal(255);
      });
    });
  });

  describe('#updateDirectoryAndFilesToSafe(path)', function() {

    context('when path represents a directory', function() {
      let directoryPhantom;
      beforeEach(function() {
        directoryPhantom = new DirectoryToSafe({dirorfile: config.phantompath});
      });

      it('should have updated the new directory', function(){
        const directoryPhantom = new DirectoryToSafe({dirorfile: config.phantompath});
        expect(directoryPhantom.directory).to.not.exist;
        directoryPhantom.updateDirectoryAndFilesToSafe(config.regexdir);
        expect(directoryPhantom.directory).to.equal(config.regexdir);
      });
      context('when directory has files', function() {
        it('should have updated the array of files to safe that now is not empty', function(){
          const directoryPhantom = new DirectoryToSafe({dirorfile: config.phantompath});
          expect(directoryPhantom.filesToSafe).to.be.a('array').and.to.be.empty;
          directoryPhantom.updateDirectoryAndFilesToSafe(config.regexdir);
          expect(directoryPhantom.filesToSafe).to.be.a('array').and.to.have.length;
        });
      });
      context('when directory is empty', function() {
        it('should have updated the array of files to safe that now is empty', function(){
          const directoryWithFiles = new DirectoryToSafe({dirorfile: config.regexdir});
          expect(directoryWithFiles.filesToSafe).to.be.a('array').and.to.have.length;
          directoryWithFiles.updateDirectoryAndFilesToSafe(config.emptydir);
          expect(directoryWithFiles.filesToSafe).to.be.a('array').and.to.be.empty;
        });
      });
    });

    context('when path represents a file', function() {
      let directoryPhantom;
      beforeEach(function() {
        directoryPhantom = new DirectoryToSafe({dirorfile: config.phantompath});
      });

      it('should have updated a new directory', function() {
        expect(directoryPhantom.directory).to.not.exist;
        directoryPhantom.updateDirectoryAndFilesToSafe(config.unsafefile);
        expect(directoryPhantom.directory).to.equal(config.regexdir);
      });

      it('should have updated the array of files to safe with only one file', function() {
        expect(directoryPhantom.filesToSafe).to.be.a('array').and.to.be.empty;
        directoryPhantom.updateDirectoryAndFilesToSafe(config.unsafefile);
        expect(directoryPhantom.filesToSafe).to.be.a('array').and.to.have.length(1);
      });
    });

    context('when a path does not exist', function() {
      it('should not throw an error', function() {
        const directoryWithFiles = new DirectoryToSafe({dirorfile: config.regexdir});
        expect(directoryWithFiles.updateDirectoryAndFilesToSafe(config.phantompath)).to.not.throw;
      });
    });
  });

  describe('#watchUnsafeRegexInFiles()', function() {
    it('should add a file to unsafeFilesMap if one or more regex was found', function() {
      expect().to.be.ok();
    });
    it('should delete safe files from unsafeFilesMap', function() {
      expect().to.be.ok();
    });
  });

  describe('#getUnsafeRegexInFilesSync()', function() {
    it('should only add in unsafeFilesMap files with unsafe regex', function() {
      const directoryWithFiles = new DirectoryToSafe({dirorfile: config.regexdir});
      directoryWithFiles.getUnsafeRegexInFilesSync();
      expect(directoryWithFiles.unsafeFilesMap.size).to.equal(1);
    });

    it('should only add in unsafeFilesMap files with unsafe regex recursively', function() {
      const directoryWithFiles = new DirectoryToSafe({dirorfile: config.regexdir, recursive: true});
      directoryWithFiles.getUnsafeRegexInFilesSync();
      expect(directoryWithFiles.unsafeFilesMap.size).to.equal(2);
    });
  });

  describe('#getUnsafeRegexInFiles()', function() {
    it('should only add in unsafeFilesMap files with unsafe regex', function(done) {
      const directoryWithFiles = new DirectoryToSafe({dirorfile: config.regexdir});
      directoryWithFiles.getUnsafeRegexInFiles(() => {
        expect(directoryWithFiles.unsafeFilesMap.size).to.equal(1);
        done();
      });

    });

    it('should only add in unsafeFilesMap files with unsafe regex recursively', function(done) {
      const directoryWithFiles = new DirectoryToSafe({dirorfile: config.regexdir, recursive: true});
      directoryWithFiles.getUnsafeRegexInFiles(() => {
        expect(directoryWithFiles.unsafeFilesMap.size).to.equal(2);
        done();
      });
    });
  });
});
