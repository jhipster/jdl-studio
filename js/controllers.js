angular.module('JDLStudio')
    .controller('AppController', ['$scope', '$window', 'rnd', 'default_definition', 'post_script_functions',
        function(scope, $window, rnd, default_definition, post_script_functions) {
            var vm = this;
            var max_width = 600
            var height_margin = 300
            var margin = 50
            var entity_width = 200
            var entity_height = 50
            vm.lastX = 0
            vm.lastY = 0
            vm.height = 0
            vm.width = 0
            vm.wantHandDraw = false

            vm.pageSize = 'A4'
            vm.definition = default_definition
            scope.$watch('vm.definition', function() {
                drawJoint()
            })

            vm.Math = Math

            var getCardinality = function (cardinality) {
                switch (cardinality) {
                    case 'one-to-many':
                        return '1-*'
                    case 'one-to-one':
                        return '1-1'
                    case 'many-to-one':
                        return '*-1'
                    case 'many-to-many':
                        return '*-*'
                    default:
                        return '1-*'
                }
            }
            var getEntity = function(name) {
                for (var i = 0; i < vm.entities.length; i++) {
                    var entity = vm.entities[i]
                    if (entity.name == name) {
                        return entity
                    }
                }
                vm.width += 200
                var entity;
                for (var i = 0; i < vm.jdlEntities.length; i++) {
                    var jdlEntity = vm.jdlEntities[i]
                    if (jdlEntity.name == name) {
                        entity = jdlEntity;
                        break;
                    }
                }
                entity.x = vm.width - entity_width
                entity.y = 0
                vm.entities.push(entity)
                return entity;
            }
            vm.byHand = function(x1, y1, x2, y2) {
                var points = x1 + ',' + y1
                if (vm.wantHandDraw) {
                    rnd.reset()
                    //number of segments (one segment for every 10 pixels)
                    var seg = Math.ceil(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 10)
                    var inaccuracy = 2

                        function mod(x) {
                            return x + rnd.next() * inaccuracy - inaccuracy / 2
                        }
                    var x = x1
                    var y = y1
                    var dx = (x2 - x1) / seg
                    var dy = (y2 - y1) / seg
                    for (var i = 1; i < seg; i++) {
                        x += dx
                        y += dy
                        points += ' ' + mod(x) + ',' + mod(y)
                    }
                }
                return points + ' ' + x2 + ',' + y2
            }
            vm.rectByHand = function(x1, y1, x2, y2) {
                return [
                    vm.byHand(x1, y1, x2, y1),
                    vm.byHand(x2, y1, x2, y2),
                    vm.byHand(x2, y2, x1, y2),
                    vm.byHand(x1, y2, x1, y1)
                ].join(" ")
            }
            vm.print = function() {
                // https://developer.mozilla.org/en/XMLSerializer
                var svg = document.getElementById("svg_out");

                svg_xml = (new XMLSerializer()).serializeToString(svg);
                var s = vm.paperSizes[vm.pageSize];
                var canvas = document.getElementById("canvas_out");
                canvas.height = svg.offsetHeight;
                canvas.width = svg.offsetWidth;
                var ctx = canvas.getContext('2d');

                // this is just a JavaScript (HTML) image
                var img = new Image();
                img.height = svg.offsetHeight;
                img.width = svg.offsetHeight;
                // http://en.wikipedia.org/wiki/SVG#Native_support
                // https://developer.mozilla.org/en/DOM/window.btoa
                img.src = "data:image/svg+xml;base64," + btoa(svg_xml);

                img.onload = function() {
                    //after this, Canvas’ origin-clean is DIRTY
                    ctx.drawImage(img, 0, 0, svg.offsetWidth, svg.offsetHeight);
                    var dataURL = canvas.toDataURL("image/png");
                    var win = $window.open();
                    win.document.write('<img height="100%" src="' + dataURL + '"/>');

                }
            }

            function getX() {
                if(vm.lastX > max_width) {
                    vm.lastX = 0;
                }
                vm.lastX = vm.lastX + entity_width + margin;
                return vm.lastX;
            }

            function getY() {
                if(vm.lastX > max_width) {
                    vm.lastY = vm.lastY + 300;
                }
                return vm.lastY;
            }

            function getWidth() {

            }

            function drawJoint() {
                var graph = new joint.dia.Graph();

                var paper = new joint.dia.Paper({
                    el: $('#paper'),
                    width: 800,
                    height: 600,
                    gridSize: 1,
                    model: graph
                });

                var uml = joint.shapes.uml;

                var createLink = function(elm1, elm2) {

                    var myLink = new uml.Line({
                        source: { id: elm1.id },
                        target: { id: elm2.id }
                    });

                    return myLink.addTo(graph);
                };

                var createLabel = function(txt) {
                    return {
                        labels: [{
                            position: -20,
                            attrs: {
                                text: { dy: -8, text: txt, fill: '#333333' },
                                rect: { fill: 'none' }
                            }
                        }]
                    };
                };

                vm.height = entity_height + margin
                vm.width = -100
                var jdl = JDLParser.parse(vm.definition);
                vm.jdlEntities = jdl.entities;
                vm.entities = [];
                vm.relationships = jdl.relationships;
                vm.enums = jdl.enums;
                vm.service = jdl.service;
                vm.pagination = jdl.pagination;
                vm.dto = jdl.dto;

                var classes = {}

                vm.jdlEntities.forEach(function (entity) {
                    var attrs = [];
                    var height = 50;
                    entity.body.forEach(function (attr) {
                        attrs.push(attr.name + ': ' + attr.type);
                        height += 20;
                    });
                    if(height > height_margin){
                        height_margin = height;
                    }
                    classes[entity.name] = new uml.Class({
                        position: { x:getX()  , y: getY() },
                        size: { width: entity_width, height: height },
                        name: entity.name,
                        attributes: attrs,
                        methods: [],
                        attrs: {
                            '.uml-class-name-rect': {
                                fill: '#ff8450',
                                stroke: '#fff',
                                'stroke-width': 0.5,
                            },
                            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                                fill: '#fe976a',
                                stroke: '#fff',
                                'stroke-width': 0.5
                            },
                            '.uml-class-attrs-text': {
                                ref: '.uml-class-attrs-rect',
                                'ref-y': 0.5,
                                'y-alignment': 'middle'
                            },
                            '.uml-class-methods-text': {
                                ref: '.uml-class-methods-rect',
                                'ref-y': 0.5,
                                'y-alignment': 'middle'
                            }
                        }
                    });
                });

                angular.forEach(classes, function(c) {
                  graph.addCell(c);
                });

                var relations = [];
                vm.relationships.forEach(function (relationship) {
                    var from = relationship.from.name
                    var to = relationship.to.name
                    createLink(classes[from], classes[to], graph).set(createLabel(vm.getCardinality(relationship.cardinality)));
                });
            }
        }
    ]);
