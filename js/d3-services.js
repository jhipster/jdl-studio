angular.module('d3', [])
  .factory('d3Service', [function(){

    d3.classDiagram = (function() {
        function addMarkers(defs) {
            defs.append('marker')
            .attr({
                'id': 'filledTraiangle',
                viewBox: '0 0 10 10',
                'refX': 10,
                'refY': 5,
                'markerWidth': 10,
                'markerHeight': 10,
                'orient': 'auto'
            })
            .append('path')
            .attr({
                d: 'M10 5 0 0 0 10Z',
                'fill-rule': 'evenodd',
                stroke: 'none',
                fill: 'black'
            });

            defs.append('marker')
            .attr({
                'id': 'triangle',
                viewBox: '0 0 10 10',
                'refX': 10,
                'refY': 5,
                'markerWidth': 10,
                'markerHeight': 10,
                'orient': 'auto'
            })
            .append('path')
            .attr({
                d: 'M10 5 0 0 0 10 Z M8 5 1 8.4 1 1.6Z',
                'fill-rule': 'evenodd',
                stroke: 'none',
                fill: 'black'
            });

            defs.append('marker')
            .attr({
                'id': 'arrowhead',
                viewBox: '0 0 10 10',
                'refX': 10,
                'refY': 5,
                'markerWidth': 10,
                'markerHeight': 10,
                'orient': 'auto'
            })
            .append('path')
            .attr({
                d: 'M10 5 0 10 0 8.7 6.8 5.5 0 5.5 0 4.5 6.8 4.5 0 1.3 0 0Z',
                stroke: 'none',
                fill: 'black'
            });

            defs.append('marker')
            .attr({
                id: 'diamond',
                viewBox: '0 0 16 10',
                refX: 16,
                refY: 5,
                markerWidth: 16,
                markerHeight: 10,
                orient: 'auto'
            })
            .append('path')
            .attr({
                d: 'M-1 5 7.5 0 16 5 7.5 10Z M1.3 5 7.5 8.7 14 5 7.5 1.3Z',
                'fill-rule': 'evenodd',
                stroke: 'none',
                fill: 'black'
            });

            defs.append('marker')
            .attr({
                id: 'filledDiamond',
                viewBox: '0 0 16 10',
                refX: 16,
                refY: 5,
                markerWidth: 16,
                markerHeight: 10,
                orient: 'auto'
            })
            .append('path')
            .attr({
                d: 'M-1 5 7.5 0 16 5 7.5 10Z',
                stroke: 'none',
                fill: 'black'
            });
        }

        function createClasses(svg, classes) {
            var g = svg.selectAll('g.class')
            .data(classes).enter().append('g')
            .attr({
                id: function(d) { return d.name + 'Class'; },
                'class': 'class',
                transform: function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                },
            });

            g.append('rect')
            .attr({
                'width': function(d) { return d.width; },
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': 1
            });

            var classNameG = g.append('g')
            .attr('class', 'name');
            var classNameRects = classNameG.append('rect')
            .attr({
                'width': function(d) { return d.width; },
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': 1
            });
            var classNameTexts = classNameG.append('text')
            .attr('font-size', 12)
            .call(d3.multilineText()
                .verticalAlign('top')
                .paddingTop(4)
                .paddingBottom(4)
                .text(function(d) { return d.name; })
            );

            adjustHeight(classNameRects[0], classNameTexts[0], 4, 4);

            function adjustHeight(rects, texts, paddingTop, paddingBottom) {
                var i,
                n = rects.length,
                rect,
                text,
                height;
                for (i = 0; i < n; i++) {
                    rect = rects[i];
                    text = texts[i];
                    height = text.getBBox().height + paddingTop + paddingBottom;
                    d3.select(rect).attr('height', height);
                }
            }

            var attributesG = g.append('g')
            .attr({
                'class': 'attributes',
                'transform': function(d) {
                    var classNameG = d3.select(this).node().previousSibling,
                    height = classNameG.getBBox().height;
                    return 'translate(0,' + height + ')';
                }
            });
            var attributesRects = attributesG.append('rect')
            .attr({
                'width': function(d) { return d.width; },
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': 1
            });
            var attributesTexts = attributesG.append('text')
            .attr('font-size', 12)
            .call(d3.multilineText()
                .text(function(d) { return d.attributes; })
                .verticalAlign('top')
                .horizontalAlign('left')
                .paddingTop(4)
                .paddingLeft(4)
            );
            adjustHeight(attributesRects[0], attributesTexts[0], 4, 4);

            var methodsG = g.append('g')
            .attr({
                'class': 'methods',
                'transform': function(d) {
                    var attributesG = d3.select(this).node().previousSibling,
                    classNameText = attributesG.previousSibling,
                    classNameBBox = classNameText.getBBox(),
                    attributesBBox = attributesG.getBBox();
                    return 'translate(0,' + (classNameBBox.height + attributesBBox.height) + ')';
                }
            });
            var methodsRects = methodsG.append('rect')
            .attr({
                'width': function(d) { return d.width; },
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': 1
            });
            var methodsTexts = methodsG.append('text')
            .attr('font-size', 12)
            .call(d3.multilineText()
                .text(function(d) { return d.methods; })
                .verticalAlign('top')
                .horizontalAlign('left')
                .paddingTop(4)
                .paddingLeft(4)
            );
            adjustHeight(methodsRects[0], methodsTexts[0], 4, 4);

            svg.selectAll('g.class')
            .each(function(d, i) {
                var classG = d3.select(this),
                classRect = classG.node().firstChild,
                classNameG = classRect.nextSibling,
                attributesG = classNameG.nextSibling,
                methodsG = attributesG.nextSibling,
                height =
                classNameG.getBBox().height +
                attributesG.getBBox().height +
                methodsG.getBBox().height;
                d3.select(classRect).attr('height', height);
            });

            var boxes = {};
            svg.selectAll('g.class')
            .each(function(d, i) {
                var classG = d3.select(this),
                bbox = classG.node().getBBox();
                boxes[d.name] = new d3.classDiagram.Box(d.x, d.y, bbox.width, bbox.height);
            });

            return boxes;
        }

        function Box(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Box.prototype.midX = function() { return this.x + this.width / 2; };
        Box.prototype.rightX = function() { return this.x + this.width; }
        Box.prototype.midY = function() { return this.y + this.height / 2; }
        Box.prototype.bottomY = function() { return this.y + this.height; }

        function createConnectors(svg, connectors) {
            var line = d3.svg.line()
            .x(function(d) {return d.x;})
            .y(function(d) {return d.y;});

            svg.selectAll('path.connector')
            .data(connectors).enter().append('path')
            .each(function(d, i) {
                var path = d3.select(this);
                path.attr({
                    'class': 'connector',
                    'd': line(d.points),
                    'stroke': 'black',
                    'stroke-width': 1,
                    'fill': 'none'
                });
                if (d.markerEnd) {
                    path.attr('marker-end', 'url(#' + d.markerEnd + ')');
                }
            });

            svg.selectAll('path.connector')
            .attr({
                'stroke-dasharray': function(d) {
                    var path = d3.select(this),
                    totalLength = path.node().getTotalLength(),
                    marker = svg.select('#' + d['markerEnd'])[0][0],
                    markerWidth = marker.markerWidth.baseVal.value;
                    return '' + (totalLength - markerWidth) + ' ' + markerWidth;
                },
                'stroke-dashoffset': 0
            });
        }

        return {
            Box: Box,
            addMarkers: addMarkers,
            createClasses: createClasses,
            createConnectors: createConnectors
        };
    })();

    d3.multilineText = function() {
        var lineHeight = 1.4;
        var horizontalAlign = 'center'; // 'left', 'center', or 'right'
        var verticalAlign = 'center'; // 'top', 'center', or 'bottom'
        var paddingTop = 10;
        var paddingBottom = 10;
        var paddingLeft = 10;
        var paddingRight = 10;
        var textAnchorsByHorizontalAlign = {
            'center': 'middle',
            'left': 'start',
            'right': 'end'
        };
        var text = function(d) { return d.text; };
        var width = function(d) { return d.width; };
        var height = function(d) { return d.height; };

        function my(selection) {
            selection.each(function(d, i) {
                var textElem = d3.select(this),
                lines,
                lineCount,
                lineI,
                line;

                lines = result(d, text);
                if (typeof lines === 'string') {
                    lines = lines.split(/\n/);
                }
                if (lines === undefined) {
                    return;
                }
                lineCount = lines.length;

                textElem.attr({
                    'text-anchor': textAnchorsByHorizontalAlign[horizontalAlign],
                    'fill': 'black',
                    transform: function(d) {
                        return 'translate(' + translateX(d) + ',' + translateY(d) + ')';
                    },
                });

                for (lineI = 0; lineI < lineCount; lineI++) {
                    line = lines[lineI];
                    textElem.append('tspan')
                    .attr({
                        'x': 0,
                        'y': lineTspanY(lineI, lineCount)
                    })
                    .attr(lineTspanAttrs())
                    .text(line);
                }
            });
        }

        function translateX(d) {
            var w = result(d, width);
            switch (horizontalAlign) {
                case 'center':
                return w / 2;
                case 'left':
                return paddingLeft;
                case 'right':
                return w - paddingRight;
            }
        }

        function translateY(d) {
            var h = result(d, height);
            switch (verticalAlign) {
                case 'center':
                return h / 2;
                case 'top':
                return paddingTop;
                case 'bottom':
                return h - paddingBottom;
            }
        }

        function lineTspanY(lineI, lineCount) {
            var y;
            switch (verticalAlign) {
                case 'center':
                y = (lineI - (lineCount - 1) / 2) * lineHeight;
                break;
                case 'top':
                y = lineI * lineHeight;
                break;
                case 'bottom':
                y = -((lineCount - 1) - lineI) * lineHeight;
                break;
            }
            return y ? y + 'em' : 0;
        }

        function lineTspanAttrs() {
            switch (verticalAlign) {
                case 'center':
                return {dy: '.35em'};
                case 'top':
                return {dy: '1em'};
                case 'bottom':
                return {dy: 0};
            }
        }

        function result(d, property) {
            return typeof property === 'function' ? property(d) : property;
        }

        my.lineHeight = function(value) {
            if (!arguments.length) return lineHeight;
            lineHeight = value;
            return my;
        };

        my.horizontalAlign = function(value) {
            if (!arguments.length) return horizontalAlign;
            horizontalAlign = value;
            return my;
        };

        my.verticalAlign = function(value) {
            if (!arguments.length) return verticalAlign;
            verticalAlign = value;
            return my;
        };

        my.paddingTop = function(value) {
            if (!arguments.length) return paddingTop;
            paddingTop = value;
            return my;
        };

        my.paddingRight = function(value) {
            if (!arguments.length) return paddingRight;
            paddingRight = value;
            return my;
        };

        my.paddingBottom = function(value) {
            if (!arguments.length) return paddingBottom;
            paddingBottom = value;
            return my;
        };

        my.paddingLeft = function(value) {
            if (!arguments.length) return paddingLeft;
            paddingLeft = value;
            return my;
        };

        my.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return my;
        };

        my.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return my;
        };

        my.text = function(value) {
            if (!arguments.length) return text;
            text = value;
            return my;
        };

        return my;
    }

    return d3;
}]);
