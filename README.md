# JDL-Studio

Hello, this is [JDL-Studio](http://www.jhipster.tech//jdl-studio/), an online tool for drawing UML diagrams for [JHipster](http://www.jhipster.tech/) based on the [JDL syntax](http://www.jhipster.tech//jdl). It tries to keep its syntax visually as close as possible to the generated UML diagram without resorting to ASCII drawings.

Created by [Deepu KS](https://deepu.tech). Heavily inspired and adapted from [nomnoml](https://github.com/skanaar/nomnoml)

### JDL-Studio was made possible by these cool projects

- [nomnoml](https://github.com/skanaar/nomnoml)
- [dagre](https://github.com/cpettitt/dagre)

## Docker image

The official Docker image is available at https://hub.docker.com/r/jhipster/jdl-studio/

You can use JDL-Studio offline with :

```
docker run --rm -it -p 18080:80 jhipster/jdl-studio
```

The JDL-Studio should be available at: http://localhost:18080 or http://docker-ip:18080

## Web application

The JDL-Studio web application is a simple editor with a live preview. It is purely client side and changes are saved to the browser's _localStorage_, so your diagram should be here the next time, (but no guarantees).

### Interaction

The canvas can be panned and zoomed by dragging and scrolling in the right hand third of the canvas. Downloaded image files will be given the filename in the `#title` directive.

### syntax

The JDL syntax is explained [here](http://www.jhipster.tech//jdl)

### Directives

```
#arrowSize: 1
#bendSize: 0.3
#direction: down | right
#gutter: 5
#edgeMargin: 0
#edges: hard | rounded
#background: transparent
#fill: #eee8d5; #fdf6e3
#fillArrows: false
#font: Calibri
#fontSize: 12
#leading: 1.25
#lineWidth: 3
#padding: 8
#spacing: 40
#stroke: #33322E
#title: filename
#zoom: 1
#acyclicer: greedy
#ranker: network-simplex | tight-tree | longest-path
```

## Contributing

If you want to contribute to the project more info is available in [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). There are two important GIT branches. `src` branch holds the source code and all development needs to be done against that branch. `gh-pages` branch holds the deployable static site that is built from `src`.

## Deploy to production

In order to deploy to production run `npm run deploy`, this will build the `src` branch and move the assets to the gh-pages branch and push it to GitHub, it will update the `https://www.jhipster.tech/jdl-studio/` version and will create a PR to update the `https://start.jhipster.tech`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
Make sure `npm install` is run before running `npm start`

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
