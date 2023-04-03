# Image resizer CLI

This command-line interface helps quickly resize and optimize image files.

## Features

- Resize images quickly and easily
- Supports resizing of single images or entire folders
- Optional flags for controlling image quality, file format, and more
- Easy to use and understand command-line interface

You can specify a file or a folder, along with some optional flags such as `quality`. `lowercase` and `remove-spaces`.

## Installation

You can install the Image Resizer CLI tool using npm. To install, simply run the following command:

```bash
npm install -g img-resizer-cli
```

### Usage

To resize a single image, run the following command:

```bash
npx img-resizer-cli --file <path-to-file> --width <width> --output <path-to-output-folder>
```

If you want to resize a folder, use the `--folder` flag instead of `--file`.

## Examples

Here are some examples of how you can use the Image Resizer CLI tool:

```bash
# Resizing and optimizing a single image
npx img-resizer-cli --file ~/Photos/example.jpg --width 1000 -q 90 -o ~/Photos/resized/

# Resize all images in a folder and its subdirectories to 500 pixels wide and output to a different folder
npx img-resizer-cli --folder ~/Photos/ --width 500 -o ~/Photos/resized/

# Resize images in a folder to 300 pixels wide, convert to GIF format, and remove spaces from the file names
npx img-resizer-cli --folder ~/Photos/ --width 300 --format gif --remove-spaces
```

## Options

| Option                 | Description                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--file` or `--folder` | Specifies the file name to be processed                                                                       |
| `-w`                   | Specifies the width of the output image in pixels                                                             |
| `-o`                   | Specifies the output directory for the processed file. Overwrites the handled file by default if not passed.  |
| `-q`                   | Specifies the quality of the output image on a scale from 1 to 100                                            |
| `--format`             | (Optional) Specifies the file format of the output image. Allowed values: `jpg`, `jpeg`, `png`, `gif`, `webp` |
| `--lowercase`          | (Optional) Converts the file name to lowercase                                                                |
| `--remove-spaces`      | (Optional) Removes spaces from the file name                                                                  |

## Contributing

Contributions to this project are welcome! If you find a bug or have an idea for a new feature, please submit an issue or a pull request.

## License

This project is licensed under the Mozilla Public License 2.0.
