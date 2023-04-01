Image Resizer
Image Resizer is a Node.js command line utility to resize images in a given folder and its subdirectories. It supports various output formats and allows you to customize the quality of the resized images.

Features
Resize images in a specified folder and its subdirectories
Customize the width of the resized images
Set the output format (JPEG, PNG, or WEBP)
Set the quality of the output images
Optionally lowercase the filenames
Optionally remove spaces from the filenames
Save resized images to a specified output folder or the same location as the input folder
Prerequisites
Node.js (https://nodejs.org/)
npm (comes bundled with Node.js)
Installation
Clone this repository or download the source code.
Navigate to the project directory using the command line.
Run npm install to install the required dependencies.
Usage
arduino
Copy code
Usage: node index.js -f [folder] -w [width] [-o output] [-q quality] [-t format] [--lowercase] [--remove-spaces]

Options:
  -f, --folder       Input folder (required)
  -w, --width        Width of resized images (required)
  -o, --output       Output folder (optional, default: same as input folder)
  -q, --quality      Quality for output images (optional, default: 100)
  -t, --format       Output format (jpeg, png, webp) (optional, default: jpeg)
  --lowercase        Lowercase filenames (optional)
  --remove-spaces    Remove spaces from filenames (optional)
Example
To resize all images in the input folder with a width of 800px, save them as PNG with a quality of 90, and store the resized images in the output folder, run:

css
Copy code
node index.js -f input -w 800 -o output -q 90 -t png
If you also want to lowercase filenames and remove spaces from them, run:

css
Copy code
node index.js -f input -w 800 -o output -q 90 -t png --lowercase --remove-spaces
License
This project is licensed under the MIT License. See the LICENSE file for details.