JDL-Studio
=======

Hello, this is [JDL-Studio](http://www.jhipster.tech//jdl-studio/), an online tool for drawing UML diagrams for [JHipster](http://www.jhipster.tech/) based on the [JDL syntax](http://www.jhipster.tech//jdl). It tries to keep its syntax visually as close as possible to the generated UML diagram without resorting to ASCII drawings.

Created by [Deepu KS](https://github.com/deepu105). Heavily inspired and adapted from  [nomnoml](https://github.com/skanaar/nomnoml)

### JDL-Studio was made possible by these cool projects

- [nomnoml](https://github.com/skanaar/nomnoml)
- [dagre](https://github.com/cpettitt/dagre)
- [lodash](http://lodash.com)
- [Jquery](https://jquery.com/)
- [codemirror](https://codemirror.net/)
- [solarized](http://ethanschoonover.com/solarized)
- [Linearicons](https://linearicons.com/free)

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
