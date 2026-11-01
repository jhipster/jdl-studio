import CodeMirror from "codemirror";
import "./CodemirrorJDLMode";

function tokenizeLine(line: string): Array<{ text: string; type: string | null }> {
  const mode = CodeMirror.getMode({}, "jdl");
  const state = mode.startState ? mode.startState() : {};
  const stream = new (CodeMirror as any).StringStream(line);
  const tokens: Array<{ text: string; type: string | null }> = [];

  while (!stream.eol()) {
    const type = mode.token(stream, state);
    tokens.push({ text: stream.current(), type });
    stream.start = stream.pos;
  }

  return tokens;
}

test("highlights regex pattern validation without treating it as a comment", () => {
  const tokens = tokenizeLine(
    "  name String pattern(/^[A-Z][a-z]+$/) required // line comment",
  );

  expect(tokens).toContainEqual({ text: "String", type: "special" });
  expect(tokens).toContainEqual({ text: "pattern", type: "qualifier" });
  expect(tokens).toContainEqual({
    text: "/^[A-Z][a-z]+$/",
    type: "string",
  });
  expect(tokens).toContainEqual({ text: "required", type: "qualifier" });
  expect(tokens).toContainEqual({
    text: "// line comment",
    type: "comment",
  });
});

test("still highlights single-line and block comments", () => {
  expect(tokenizeLine("// full line comment")).toEqual([
    { text: "// full line comment", type: "comment" },
  ]);
  expect(tokenizeLine("/** javadoc comment */")).toEqual([
    { text: "/** javadoc comment */", type: "comment" },
  ]);
});
