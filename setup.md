# Setup

## Project Structure

The following project structure is expected:
```
root
|       .gitignore
|       README.md
|       package.json (not include in repository)
|       package-lock.json (not include in repository)
|       setup.md
|       credits.md
|
+---node_modules (not included in repository)
|       (npm packages)
|
|---code
|   |       index.html
|   |       
|   |---css
|   |   .       index.css
|   |
|   |---js
|   |   |       index.js
|   |   .       (javascript code)
|   |
|   |---lib
|   |   |       webgl-utils.js
|   |   .       webgl-debug.js
|   |
|   \---assets
|       |---models
|       |   .   (models)
|       |
|       |---textures
|       |   .   (textures)
|       |       
|       .       (other assets)
|
\---design
       (design documents and decisions)
```

## NPM Packages
This projects uses the following npm packages:

    - three.js
    - dat.gui
    - gl-matrix

Installation (in root folder):
```bat
npm install three
npm install dat.gui
npm install gl-matrix
```

## Libraries
This project users the following libraries:

    - webgl-utils
    - webgl-debug

They come preinstalled in this repository, but their repositories can be found online (see [credits](/credits.md))

## Page Access
For ease of use and of testing, the "web server" is expected to run in the root folder.

Therefore, the link to the assignment page should be something like `http://localhost:4000/index.html`