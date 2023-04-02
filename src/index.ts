import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import yargs from 'yargs';
import cliProgress from 'cli-progress';
import colors from 'colors';

interface CommandLineArguments {
  f: string;
  w: number;
  o: string;
  q: number;
  t: string;
  format?: 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp';
  lowercase?: boolean;
  'remove-spaces'?: boolean;
  _: (string | number)[];
  $0: string;
}

// Parse command line arguments
const argv = yargs
  .usage(
    'Usage: $0 -f [file/folder] -w [width] [-o output] [-q quality] [-t format] [--lowercase] [--remove-spaces]'
  )
  .demandOption(['f', 'w'])
  .alias('f', ['file', 'folder'])
  .option('o', {
    alias: 'output',
    type: 'string',
    describe: 'Output file/folder',
    default: '',
  })
  .option('w', {
    alias: 'width',
    type: 'number',
    describe: 'Image width',
    default: '',
  })
  .option('q', {
    alias: 'quality',
    type: 'number',
    describe: 'Quality for output images',
    default: 100,
  })
  .option('t', {
    alias: 'format',
    type: 'string',
    describe: 'Output format (jpeg, png, webp)',
    default: 'jpeg',
  })
  .boolean(['lowercase', 'remove-spaces'])
  .help().argv as CommandLineArguments;

const folderPath = path.resolve(argv.f);
const width = argv.w;
const outputPath = argv.o ? path.resolve(argv.o) : '';
const quality = argv.q;
const format = argv.format ? argv.format.toLowerCase() : 'jpeg';

const progressBar = new cliProgress.SingleBar(
  {
    format: `${colors.green('{bar}')} {percentage}% | {value}/{total} files`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  },
  cliProgress.Presets.shades_classic
);

export const isImage = (fileName: string): boolean => {
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = path.extname(fileName).toLowerCase();
  if (extensions.includes(extension)) {
    return true;
  }
  return false;
};

const handleFile = async (filePath: string): Promise<void> => {
  try {
    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
      await handleFolder(filePath, false);
    } else if (isImage(filePath)) {
      const inputBuffer = await fs.promises.readFile(filePath);
      const outputBuffer = await (sharp(inputBuffer).resize({ width }) as any)
        [format]({ quality })
        .toBuffer();

      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      }

      let fileName = path.basename(filePath);

      if (argv.lowercase) {
        fileName = fileName.toLowerCase();
      }
      if (argv['remove-spaces']) {
        fileName = fileName.replace(/ /g, '');
      }

      await fs.promises.writeFile(
        path.join(outputPath || path.dirname(filePath), fileName),
        outputBuffer
      );
      progressBar.increment();
    }
  } catch (error) {
    console.error(`Error processing file: ${filePath}`, error);
  }
};

const handleFolder = async (
  folderPath: string,
  initialCall = true
): Promise<void> => {
  if (initialCall) {
    const totalFiles = await getTotalFilesCount(folderPath);
    progressBar.start(totalFiles, 0);
  }
  try {
    const stats = await fs.promises.stat(folderPath);
    if (stats.isDirectory()) {
      const files = await fs.promises.readdir(folderPath);
      for (const fileName of files) {
        const filePath = path.join(folderPath, fileName);
        await handleFolder(filePath, false);
      }
    } else {
      await handleFile(folderPath);
    }
  } catch (error) {
    console.error(`Error processing folder: ${folderPath}`, error);
  }
  if (initialCall) {
    progressBar.stop();
  }
};

export const getTotalFilesCount = async (dir: string): Promise<number> => {
  let count = 0;

  const processItem = async (itemPath: string) => {
    const stats = await fs.promises.stat(itemPath);
    if (stats.isDirectory()) {
      const files = await fs.promises.readdir(itemPath);
      for (const file of files) {
        await processItem(path.join(itemPath, file));
      }
    } else if (isImage(itemPath)) {
      count++;
    }
  };

  await processItem(dir);

  return count;
};

(async () => {
  await handleFolder(folderPath);
})();
