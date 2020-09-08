namespace nomnoml {
  export var styles: { [key: string]: Style } = {
    ABSTRACT: buildStyle({ visual: "class", center: true, italic: true }),
    ACTOR: buildStyle({ visual: "actor", center: true }),
    CHOICE: buildStyle({ visual: "rhomb", center: true }),
    CLASS: buildStyle({ visual: "class", center: true, bold: true }),
    DATABASE: buildStyle({ visual: "database", center: true, bold: true }),
    END: buildStyle({ visual: "end", center: true, empty: true }),
    FRAME: buildStyle({ visual: "frame" }),
    HIDDEN: buildStyle({ visual: "hidden", center: true, empty: true }),
    INPUT: buildStyle({ visual: "input", center: true }),
    INSTANCE: buildStyle({ visual: "class", center: true, underline: true }),
    LABEL: buildStyle({ visual: "none" }),
    NOTE: buildStyle({ visual: "note" }),
    PACKAGE: buildStyle({ visual: "package" }),
    RECEIVER: buildStyle({ visual: "receiver" }),
    REFERENCE: buildStyle({ visual: "class", center: true, dashed: true }),
    SENDER: buildStyle({ visual: "sender" }),
    START: buildStyle({ visual: "start", center: true, empty: true }),
    STATE: buildStyle({ visual: "roundrect", center: true }),
    TABLE: buildStyle({ visual: "table", center: true, bold: true }),
    TRANSCEIVER: buildStyle({ visual: "transceiver" }),
    USECASE: buildStyle({ visual: "ellipse", center: true }),
  };

  function box(config: Config, clas: Classifier) {
    // @ts-ignore
    clas.width = Math.max(...clas.compartments.map((e) => e.width));
    clas.height = skanaar.sum(clas.compartments, "height");
    clas.dividers = [];
    var y = 0;
    for (var comp of clas.compartments) {
      comp.x = 0;
      comp.y = y;
      comp.width = clas.width;
      // @ts-ignore
      y += comp.height;
      if (comp != skanaar.last(clas.compartments))
        clas.dividers.push([
          { x: 0, y: y },
          { x: clas.width, y: y },
        ]);
    }
  }

  function icon(config: Config, clas: Classifier) {
    clas.dividers = [];
    clas.compartments = [];
    clas.width = config.fontSize * 2.5;
    clas.height = config.fontSize * 2.5;
  }

  export var layouters: { [key in Visual]: NodeLayouter } = {
    actor: function (config: Config, clas: Classifier) {
      clas.width = Math.max(
        config.padding * 2,
        // @ts-ignore
        ...clas.compartments.map((e) => e.width)
      );
      clas.height =
        config.padding * 3 + skanaar.sum(clas.compartments, "height");
      clas.dividers = [];
      var y = config.padding * 3;
      for (var comp of clas.compartments) {
        comp.x = 0;
        comp.y = y;
        comp.width = clas.width;
        // @ts-ignore
        y += comp.height;
        if (comp != skanaar.last(clas.compartments))
          clas.dividers.push([
            { x: config.padding, y: y },
            { x: clas.width - config.padding, y: y },
          ]);
      }
    },
    class: box,
    database: function (config: Config, clas: Classifier) {
      // @ts-ignore
      clas.width = Math.max(...clas.compartments.map((e) => e.width));
      clas.height =
        skanaar.sum(clas.compartments, "height") + config.padding * 2;
      clas.dividers = [];
      var y = config.padding * 1.5;
      for (var comp of clas.compartments) {
        comp.x = 0;
        comp.y = y;
        comp.width = clas.width;
        // @ts-ignore
        y += comp.height;
        if (comp != skanaar.last(clas.compartments))
          clas.dividers.push([
            { x: 0, y: y },
            { x: clas.width, y: y },
          ]);
      }
    },
    ellipse: function (config: Config, clas: Classifier) {
      // @ts-ignore
      var width = Math.max(...clas.compartments.map((e) => e.width));
      var height = skanaar.sum(clas.compartments, "height");
      clas.width = width * 1.25;
      clas.height = height * 1.25;
      clas.dividers = [];
      var y = height * 0.125;
      var sq = (x: number) => x * x;
      var rimPos = (
        y: number // @ts-ignore
      ) => Math.sqrt(sq(0.5) - sq(y / clas.height - 0.5)) * clas.width;
      for (var comp of clas.compartments) {
        comp.x = width * 0.125;
        comp.y = y;
        comp.width = width;
        // @ts-ignore
        y += comp.height;
        if (comp != skanaar.last(clas.compartments))
          clas.dividers.push([
            { x: clas.width / 2 + rimPos(y) - 1, y: y },
            { x: clas.width / 2 - rimPos(y) + 1, y: y },
          ]);
      }
    },
    end: icon,
    frame: function (config: Config, clas: Classifier) {
      var w = clas.compartments[0].width;
      var h = clas.compartments[0].height;
      box(config, clas);
      if (clas.dividers.length) clas.dividers.shift();
      clas.dividers.unshift([
        // @ts-ignore
        { x: 0, y: h },
        // @ts-ignore
        { x: w - h / 4, y: h },
        // @ts-ignore
        { x: w + h / 4, y: h / 2 },
        // @ts-ignore
        { x: w + h / 4, y: 0 },
      ]);
    },
    hidden: function (config: Config, clas: Classifier) {
      clas.dividers = [];
      clas.compartments = [];
      clas.width = 0;
      clas.height = 0;
    },
    input: box,
    none: box,
    note: box,
    package: box,
    receiver: box,
    rhomb: function (config: Config, clas: Classifier) {
      // @ts-ignore
      var width = Math.max(...clas.compartments.map((e) => e.width));
      var height = skanaar.sum(clas.compartments, "height");
      clas.width = width * 1.5;
      clas.height = height * 1.5;
      clas.dividers = [];
      var y = height * 0.25;
      for (var comp of clas.compartments) {
        comp.x = width * 0.25;
        comp.y = y;
        comp.width = width;
        // @ts-ignore
        y += comp.height;
        var slope = clas.width / clas.height;
        if (comp != skanaar.last(clas.compartments))
          clas.dividers.push([
            {
              x:
                clas.width / 2 +
                (y < clas.height / 2 ? y * slope : (clas.height - y) * slope),
              y: y,
            },
            {
              x:
                clas.width / 2 -
                (y < clas.height / 2 ? y * slope : (clas.height - y) * slope),
              y: y,
            },
          ]);
      }
    },
    roundrect: box,
    sender: box,
    start: icon,
    table: function (config: Config, clas: Classifier) {
      if (clas.compartments.length == 1) {
        box(config, clas);
        return;
      }
      var gridcells = clas.compartments.slice(1);
      var rows: Compartment[][] = [[]];
      function isRowBreak(e: Compartment): boolean {
        return !e.lines.length && !e.nodes.length && !e.relations.length;
      }
      function isRowFull(e: Compartment): boolean {
        var current = skanaar.last(rows);
        return rows[0] != current && rows[0].length == current.length;
      }
      function isEnd(e: Compartment): boolean {
        return comp == skanaar.last(gridcells);
      }
      for (var comp of gridcells) {
        if (!isEnd(comp) && isRowBreak(comp) && skanaar.last(rows).length) {
          rows.push([]);
        } else if (isRowFull(comp)) {
          rows.push([comp]);
        } else {
          skanaar.last(rows).push(comp);
        }
      }
      var header = clas.compartments[0];
      var cellW = Math.max(
        // @ts-ignore
        header.width / rows[0].length,
        // @ts-ignore
        ...gridcells.map((e) => e.width)
      );
      // @ts-ignore
      var cellH = Math.max(...gridcells.map((e) => e.height));
      // @ts-ignore
      clas.width = cellW * rows[0].length; // @ts-ignore
      clas.height = header.height + cellH * rows.length;
      var hh = header.height; // @ts-ignore
      clas.dividers = [
        [
          { x: 0, y: header.height },
          { x: 0, y: header.height },
        ],
        ...rows.map((e, i) => [
          // @ts-ignore
          { x: 0, y: hh + i * cellH }, // @ts-ignore
          { x: clas.width, y: hh + i * cellH },
        ]),
        ...rows[0].map((e, i) => [
          { x: (i + 1) * cellW, y: hh },
          { x: (i + 1) * cellW, y: clas.height },
        ]),
      ];
      header.x = 0;
      header.y = 0;
      header.width = clas.width;
      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[i].length; j++) {
          var cell = rows[i][j];
          cell.x = j * cellW; // @ts-ignore
          cell.y = hh + i * cellH;
          cell.width = cellW;
        }
      }
    },
    transceiver: box,
  };

  export var visualizers: { [key in Visual]: Visualizer } = {
    actor: function (node, x, y, config, g) {
      var a = config.padding / 2;
      var yp = y + a * 3;
      var faceCenter = { x: node.x, y: yp - a };
      g.circle(faceCenter, a).fillAndStroke();
      g.path([
        { x: node.x, y: yp },
        { x: node.x, y: yp + 2 * a },
      ]).stroke();
      g.path([
        { x: node.x - a, y: yp + a },
        { x: node.x + a, y: yp + a },
      ]).stroke();
      g.path([
        { x: node.x - a, y: yp + a + config.padding },
        { x: node.x, y: yp + config.padding },
        { x: node.x + a, y: yp + a + config.padding },
      ]).stroke();
    },
    class: function (node, x, y, config, g) {
      // @ts-ignore
      g.rect(x, y, node.width, node.height).fillAndStroke();
    },
    database: function (node, x, y, config, g) {
      var pad = config.padding;
      var cy = y - pad / 2;
      var pi = 3.1416; // @ts-ignore
      g.rect(x, y + pad, node.width, node.height - pad * 1.5).fill();
      g.path([
        { x: x, y: cy + pad * 1.5 }, // @ts-ignore
        { x: x, y: cy - pad * 0.5 + node.height },
      ]).stroke();
      g.path([
        // @ts-ignore
        { x: x + node.width, y: cy + pad * 1.5 }, // @ts-ignore
        { x: x + node.width, y: cy - pad * 0.5 + node.height },
      ]).stroke();
      g.ellipse(
        { x: node.x, y: cy + pad * 1.5 }, // @ts-ignore
        node.width,
        pad * 1.5
      ).fillAndStroke();
      g.ellipse(
        // @ts-ignore
        { x: node.x, y: cy - pad * 0.5 + node.height }, // @ts-ignore
        node.width,
        pad * 1.5,
        0,
        pi
      ).fillAndStroke();
    },
    ellipse: function (node, x, y, config, g) {
      g.ellipse(
        { x: node.x, y: node.y }, // @ts-ignore
        node.width,
        node.height
      ).fillAndStroke();
    },
    end: function (node, x, y, config, g) {
      g.circle(
        // @ts-ignore
        { x: node.x, y: y + node.height / 2 }, // @ts-ignore
        node.height / 3
      ).fillAndStroke();
      g.fillStyle(config.stroke);
      g.circle(
        // @ts-ignore
        { x: node.x, y: y + node.height / 2 }, // @ts-ignore
        node.height / 3 - config.padding / 2
      ).fill();
    },
    frame: function (node, x, y, config, g) {
      // @ts-ignore
      g.rect(x, y, node.width, node.height).fillAndStroke();
    },
    hidden: function (node, x, y, config, g) {},
    input: function (node, x, y, config, g) {
      g.circuit([
        { x: x + config.padding, y: y }, // @ts-ignore
        { x: x + node.width, y: y }, // @ts-ignore
        { x: x + node.width - config.padding, y: y + node.height }, // @ts-ignore
        { x: x, y: y + node.height },
      ]).fillAndStroke();
    },
    none: function (node, x, y, config, g) {},
    note: function (node, x, y, config, g) {
      g.circuit([
        { x: x, y: y }, // @ts-ignore
        { x: x + node.width - config.padding, y: y }, // @ts-ignore
        { x: x + node.width, y: y + config.padding }, // @ts-ignore
        { x: x + node.width, y: y + node.height }, // @ts-ignore
        { x: x, y: y + node.height },
        { x: x, y: y },
      ]).fillAndStroke();
      g.path([
        // @ts-ignore
        { x: x + node.width - config.padding, y: y }, // @ts-ignore
        { x: x + node.width - config.padding, y: y + config.padding }, // @ts-ignore
        { x: x + node.width, y: y + config.padding },
      ]).stroke();
    },
    package: function (node, x, y, config, g) {
      var headHeight = node.compartments[0].height;
      g.rect(
        x, // @ts-ignore
        y + headHeight, // @ts-ignore
        node.width, // @ts-ignore
        node.height - headHeight
      ).fillAndStroke();
      var w = g.measureText(node.name).width + 2 * config.padding;
      g.circuit([
        // @ts-ignore
        { x: x, y: y + headHeight },
        { x: x, y: y },
        { x: x + w, y: y }, // @ts-ignore
        { x: x + w, y: y + headHeight },
      ]).fillAndStroke();
    },
    receiver: function (node, x, y, config, g) {
      g.circuit([
        { x: x - config.padding, y: y }, // @ts-ignore
        { x: x + node.width, y: y }, // @ts-ignore
        { x: x + node.width, y: y + node.height }, // @ts-ignore
        { x: x - config.padding, y: y + node.height }, // @ts-ignore
        { x: x, y: y + node.height / 2 },
      ]).fillAndStroke();
    },
    rhomb: function (node, x, y, config, g) {
      g.circuit([
        { x: node.x, y: y }, // @ts-ignore
        { x: x + node.width, y: node.y }, // @ts-ignore
        { x: node.x, y: y + node.height },
        { x: x, y: node.y },
      ]).fillAndStroke();
    },
    roundrect: function (node, x, y, config, g) {
      // @ts-ignore
      var r = Math.min(config.padding * 2 * config.leading, node.height / 2); // @ts-ignore
      g.roundRect(x, y, node.width, node.height, r).fillAndStroke();
    },
    sender: function (node, x, y, config, g) {
      g.circuit([
        { x: x, y: y }, // @ts-ignore
        { x: x + node.width - config.padding, y: y }, // @ts-ignore
        { x: x + node.width, y: y + node.height / 2 }, // @ts-ignore
        { x: x + node.width - config.padding, y: y + node.height }, // @ts-ignore
        { x: x, y: y + node.height },
      ]).fillAndStroke();
    },
    start: function (node, x, y, config, g) {
      g.fillStyle(config.stroke); // @ts-ignore
      g.circle({ x: node.x, y: y + node.height / 2 }, node.height / 2.5).fill();
    },
    table: function (node, x, y, config, g) {
      // @ts-ignore
      g.rect(x, y, node.width, node.height).fillAndStroke();
    },
    transceiver: function (node, x, y, config, g) {
      g.circuit([
        { x: x - config.padding, y: y }, // @ts-ignore
        { x: x + node.width, y: y }, // @ts-ignore
        { x: x + node.width + config.padding, y: y + node.height / 2 }, // @ts-ignore
        { x: x + node.width, y: y + node.height }, // @ts-ignore
        { x: x - config.padding, y: y + node.height }, // @ts-ignore
        { x: x, y: y + node.height / 2 },
      ]).fillAndStroke();
    },
  };
}
