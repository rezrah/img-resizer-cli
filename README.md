# Image resizer CLI

This command-line interface allows you to resize images easily. You can specify a file or a folder, an output directory, image width, image quality, image format, and some optional flags such as lowercase filenames and removing spaces from filenames.

To resize a single image, run the following command:

```bash
npx img-resizer-cli@latest --file <path-to-file> --width <width> --output <path-to-output-folder> --quality <quality> --format <image-format>
```

If you want to resize a folder, use the --folder flag instead of --file.

The supported image formats are jpeg, png, gif, and webp.

This project is licensed under the Mozilla Public License 2.0.
