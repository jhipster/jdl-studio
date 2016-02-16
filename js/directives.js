angular.module('JDLStudio')
.directive('vbox', function() {
    return {
        link: function(scope, element, attrs) {
            attrs.$observe('vbox', function(value) {
                element.attr('viewBox', value);
            })
        }
    };
})
.directive('umlClass', ['d3Service', '$window', function(d3, $window) {
    // constants
    var margin = 20,
    width = 960,
    height = 500 - .5 - margin,
    color = d3.interpolateRgb("#f77", "#77f");
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            // set up initial svg object
            var svg = d3.select(element[0])
            .append("svg")
            .attr("width", width)
            .attr("height", height + margin + 100);

            // Browser onresize event
            $window.onresize = function() {
                scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function() {
                return angular.element($window)[0].innerWidth;
            }, function() {
                scope.render(scope.data);
            });

            // watch for data changes and re-render
            scope.$watch('data', function(newVals, oldVals) {
                return scope.render(newVals);
            }, true);
            scope.render = function (data) {
                var classes = data.classes;
                d3.classDiagram.addMarkers(svg.append('defs'));

                var boxes = d3.classDiagram.createClasses(svg, classes);
                svg.selectAll('text').attr('font-family', 'Noto Sans Japanese');
                /*var connectors = [];
                var connectors = [
                    {
                        points: [
                            {x: boxes.User.rightX(), y: boxes.Micropost.midY()},
                            {x: boxes.Micropost.x, y: boxes.Micropost.midY()}
                        ],
                        markerEnd: 'filledDiamond'
                    },
                    {
                        points: [
                            {x: boxes.Relationship.midX() - 20, y: boxes.User.bottomY()},
                            {x: boxes.Relationship.midX() - 20, y: boxes.Relationship.y}
                        ],
                        markerEnd: 'filledDiamond'
                    },
                    {
                        points: [
                            {x: boxes.Relationship.midX() + 20, y: boxes.User.bottomY()},
                            {x: boxes.Relationship.midX() + 20, y: boxes.Relationship.y}
                        ],
                        markerEnd: 'filledDiamond'
                    },
                    {
                        points: [
                            {x: boxes.User.x, y: boxes.User.bottomY() - 20},
                            {x: boxes.User.x - 20, y: boxes.User.bottomY() - 20},
                            {x: boxes.User.x - 20, y: boxes.User.bottomY() + 20},
                            {x: boxes.User.x + 20, y: boxes.User.bottomY() + 20},
                            {x: boxes.User.x + 20, y: boxes.User.bottomY()}
                        ],
                        markerEnd: 'diamond'
                    },
                    {
                        points: [
                            {x: boxes.User.rightX(), y: boxes.User.bottomY() - 20},
                            {x: boxes.User.rightX() + 20, y: boxes.User.bottomY() - 20},
                            {x: boxes.User.rightX() + 20, y: boxes.User.bottomY() + 20},
                            {x: boxes.User.rightX() - 20, y: boxes.User.bottomY() + 20},
                            {x: boxes.User.rightX() - 20, y: boxes.User.bottomY()}
                        ],
                        markerEnd: 'diamond'
                    }
                ];
                d3.classDiagram.createConnectors(svg, connectors);*/
            }

        }
    };
}]);
