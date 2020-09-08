import CodeMirror from "codemirror";

var WORD = /[\w$]+/,
  RANGE = 500;

CodeMirror.registerHelper("hint", "anyword", function (editor, options) {
  const word = (options && options.word) || WORD;
  const range = (options && options.range) || RANGE;
  const cur = editor.getCursor();
  const curLine = editor.getLine(cur.line);
  const end = cur.ch;
  let start = end;
  while (start && word.test(curLine.charAt(start - 1))) --start;
  const curWord = start !== end && curLine.slice(start, end);

  const list = [] as any[];
  const seen = {};
  const re = new RegExp(word.source, "g");
  for (var dir = -1; dir <= 1; dir += 2) {
    var line = cur.line,
      endLine =
        Math.min(
          Math.max(line + dir * range, editor.firstLine()),
          editor.lastLine()
        ) + dir;
    for (; line !== endLine; line += dir) {
      const text = editor.getLine(line);
      let m;
      while ((m = re.exec(text))) {
        if (line === cur.line && m[0] === curWord) continue;
        if (
          (!curWord || m[0].lastIndexOf(curWord, 0) === 0) &&
          !Object.prototype.hasOwnProperty.call(seen, m[0])
        ) {
          seen[m[0]] = true;
          list.push(m[0]);
        }
      }
    }
  }
  if (options && options.list) {
    options.list.forEach(function (item) {
      if (
        (!curWord || item.toLowerCase().startsWith(curWord.toLowerCase())) &&
        list.indexOf(item) === -1
      )
        list.push(item);
    });
  }
  return {
    list: list,
    from: CodeMirror.Pos(cur.line, start),
    to: CodeMirror.Pos(cur.line, end),
  };
});
