const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { spawnSync } = require('child_process');
const { describe, it, expect, afterEach } = require('@jest/globals');

describe('img-resizer-cli', () => {
  afterEach(() => {
    const outDir = path.join(__dirname, 'output/');
    if (fs.existsSync(outDir)) {
      fs.rmdirSync(outDir, { recursive: true });
    }
  });

  afterEach(async () => {
    const backupFiles = await fs.promises.readdir(`${__dirname}/fixtures`);
    const filteredFiles = backupFiles.filter((file) => file.endsWith('.bak'));
    const promises = filteredFiles.map((file) =>
      fs.promises.unlink(`${__dirname}/fixtures/${file}`)
    );
    await Promise.all(promises);
  });

  it('can resize a single file', async () => {
    const fileName = 'Mock-image 1.png';
    const inputFile1 = path.join(__dirname, `fixtures/${fileName}`);
    const outDir = path.join(__dirname, 'output/');

    const { status } = spawnSync('node', [
      'dist/index.js',
      '--file',
      inputFile1,
      '--output',
      outDir,
      '-w',
      '1000',
    ]);
    expect(status).toBe(0);

    expect(fs.existsSync(outDir)).toBe(true);

    const outputFile = path.join(outDir, fileName);
    const { width, height } = await sharp(outputFile).metadata();
    expect(width).toBe(1000);
    expect(height).toBeGreaterThan(0);
  });

  it('can resize multiple files in a folder', async () => {
    const inputFolder = path.join(__dirname, `fixtures/`);
    const outDir = path.join(__dirname, 'output/');

    const { status } = spawnSync('node', [
      'dist/index.js',
      '--folder',
      inputFolder,
      '--output',
      outDir,
      '-w',
      '1000',
    ]);
    expect(status).toBe(0);

    expect(fs.existsSync(outDir)).toBe(true);

    // check if outDir contains the same number of files as inputFolder
    const inputFiles = fs.readdirSync(inputFolder);
    const outputFiles = fs.readdirSync(outDir);
    expect(inputFiles.length).toBe(outputFiles.length);

    // check dimensions are correct
    const outputFile1 = path.join(outDir, `Mock-image 1.png`);
    const { width, height } = await sharp(outputFile1).metadata();
    expect(width).toBe(1000);
    expect(height).toBeGreaterThan(0);

    const outputFile2 = path.join(outDir, `Mock-image 2.png`);
    const { width: width2, height: height2 } = await sharp(
      outputFile2
    ).metadata();
    expect(width2).toBe(1000);
    expect(height2).toBeGreaterThan(0);
  });

  it('should reject invalid quality values', () => {
    const fileName = 'Mock-image 1.png';
    const inputFile1 = path.join(__dirname, `fixtures/${fileName}`);
    const outDir = path.join(__dirname, 'output/');

    // Test with invalid quality value below 0
    const { status: status1, stderr: stderr1 } = spawnSync('node', [
      'dist/index.js',
      '--file',
      inputFile1,
      '--output',
      outDir,
      '-w',
      '1000',
      '-q',
      '-1',
    ]);
    expect(status1).not.toBe(0);
    expect(stderr1.toString()).toContain('Invalid quality value: -1');

    // Test with invalid quality value above 100
    const { status: status2, stderr: stderr2 } = spawnSync('node', [
      'dist/index.js',
      '--file',
      inputFile1,
      '--output',
      outDir,
      '-w',
      '1000',
      '-q',
      '101',
    ]);
    expect(status2).not.toBe(0);
    expect(stderr2.toString()).toContain('Invalid quality value: 101');

    // Test with valid quality value
    const { status: status3 } = spawnSync('node', [
      'dist/index.js',
      '--file',
      inputFile1,
      '--output',
      outDir,
      '-w',
      '1000',
      '-q',
      '50',
    ]);
    expect(status3).toBe(0);
  });

  it('should overwrite input file if no output file is specified', async () => {
    const fileName = 'Mock-image 1.png';
    const inputFile = path.join(__dirname, `fixtures/${fileName}`);
    const backupFile = path.join(__dirname, `fixtures/${fileName}.bak`);
    const inputBuffer = await fs.promises.readFile(inputFile);
    await fs.promises.writeFile(backupFile, inputBuffer); // Backup the input file
    const { status } = spawnSync('node', [
      'dist/index.js',
      '--file',
      inputFile,
      '-w',
      '500',
    ]);

    expect(status).toBe(0);
    const resizedBuffer = await fs.promises.readFile(inputFile);
    const resizedImage = await sharp(resizedBuffer).metadata();
    expect(resizedImage.width).toBe(500);
    expect(resizedImage.height).toBe(333);
    await fs.promises.writeFile(inputFile, inputBuffer); // Restore the input file
    const restoredBuffer = await fs.promises.readFile(inputFile);
    expect(Buffer.compare(inputBuffer, restoredBuffer)).toBe(0);
  });

  // it('should rename image files to lowercase when --lowercase flag is provided', async () => {
  //   const inputFile = path.join(__dirname, 'fixtures/Mock-image 1.png');
  //   const outDir = path.join(__dirname, 'fixtures/');

  //   const { status, stderr } = spawnSync('node', [
  //     'dist/index.js',
  //     '--file',
  //     inputFile,
  //     '-o',
  //     outDir,
  //     '-w',
  //     '600',
  //     '--lowercase',
  //   ]);

  //   console.log(inputFile);
  //   console.log(stderr.toString());

  //   expect(status).toBe(0);

  //   const files = await fs.promises.readdir(outDir);
  //   const renamedFile = files.find((file) => file === 'mock-image 1.png');

  //   expect(renamedFile).toBeDefined();
  //   expect(renamedFile).toBe('mock-image 1.png');
  // });
});
