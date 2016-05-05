JDL-Studio
=======

Hello, this is [JDL-Studio](https://jhipster.github.io/jdl-studio/), a tool for drawing UML diagrams for [JHipster](https://jhipster.github.io) based on the [JDL syntax](https://jhipster.github.io/jdl). It tries to keep its syntax visually as close as possible to the generated UML diagram without resorting to ASCII drawings.

Created by [Deepu KS](https://github.com/deepu105). Heavily inspired and adapted from  [nomnoml](https://github.com/skanaar/nomnoml)

### JDL-Studio was made possible by these cool projects

- [nomnoml](https://github.com/skanaar/nomnoml)
- [dagre](https://github.com/cpettitt/dagre)
- [lodash](http://lodash.com)
- [peg.js](http://pegjs.org/)
- [zepto](http://zeptojs.com/)
- [codemirror](https://codemirror.net/)
- [solarized](http://ethanschoonover.com/solarized)
- [Linearicons](https://linearicons.com/free)

## Web application

The JDL-Studio web application is a simple editor with a live preview. It is purely client side and changes are saved to the browser's _localStorage_, so your diagram should be here the next time, (but no guarantees).

### Interaction

The canvas can be panned and zoomed by dragging and scrolling in the right hand third of the canvas. Downloaded image files will be given the filename in the `#title` directive.

### syntax

refer [JDL syntax](https://jhipster.github.io/jdl)

### Directives

    #arrowSize: 1
    #bendSize: 0.3
    #direction: down | right
    #gutter: 5
    #edgeMargin: 0
    #edges: hard | rounded
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

## Contributing

If you want to contribute to the project more info is available in [CONTRIBUTING.md](CONTRIBUTING.md).
