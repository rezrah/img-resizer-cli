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

  it('can resize a single file', async () => {
    const fileName = 'mock-image-1.png';
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
    const outputFile1 = path.join(outDir, `mock-image-1.png`);
    const { width, height } = await sharp(outputFile1).metadata();
    expect(width).toBe(1000);
    expect(height).toBeGreaterThan(0);

    const outputFile2 = path.join(outDir, `mock-image-2.png`);
    const { width: width2, height: height2 } = await sharp(
      outputFile2
    ).metadata();
    expect(width2).toBe(1000);
    expect(height2).toBeGreaterThan(0);
  });
});
