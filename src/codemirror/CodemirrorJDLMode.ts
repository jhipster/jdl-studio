import CodeMirror from "codemirror";

import {
  relationshipTypes,
  unaryOptions,
  applicationOptions,
  binaryOptions,
  deploymentOptions,
  fieldTypes,
  reservedKeywords,
  validations,
  // @ts-ignore
} from "generator-jhipster/jdl";

const constructs = [
  `application {
  config {

  }
}`,
  `entity <name> {

}`,
  `enum <name> {

}`,
  `relationship OneToMany {

}`,
  `relationship ManyToMany {

}`,
  `relationship ManyToOne {

}`,
  `relationship OneToOne {

}`,
];

const unaryOptionKeys = Object.values(unaryOptions).reduce(
  (acc: Array<string>, cur) => {
    if (cur && typeof cur === "string") {
      return acc.concat([cur]);
    } else return acc;
  },
  [],
);
const applicationOptionKeys = Object.values(
  applicationOptions.OptionNames,
) as string[];

// get all values from the the objects inside the applicationOptions.OptionValues object
const applicationOptionValues = Object.values(
  applicationOptions.OptionValues,
).reduce((acc: Array<string>, cur) => {
  // check if value is object and not array
  if (cur && typeof cur === "object" && !Array.isArray(cur)) {
    return acc.concat(Object.values(cur));
  } else return acc;
}, []);

const binaryOptionKeys: string[] = [
  ...(Object.values(binaryOptions.Options) as string[]),
  "paginate",
];
const binaryOptionValues = Object.values(binaryOptions.Values).reduce(
  (acc: Array<string>, cur) => {
    // check if value is object and not array
    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      return acc.concat(Object.values(cur));
    } else return acc;
  },
  [],
);

const deploymentTypes = Object.values(deploymentOptions.DeploymentTypes).reduce(
  (acc: Array<string>, cur) => {
    if (cur && typeof cur === "string" && !Array.isArray(cur)) {
      return acc.concat(cur);
    } else return acc;
  },
  [],
);
const deploymentOptionKeys = Object.keys(deploymentOptions.Options);
const deploymentOptionValues = Object.values(deploymentOptions.Options).reduce(
  (acc: Array<string>, cur) => {
    // check if value is object and not array
    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      return acc.concat(Object.values(cur));
    } else return acc;
  },
  [],
);

const fieldTypeValues = [
  ...Object.values(fieldTypes.BlobTypes),
  ...Object.values(fieldTypes.CommonDBTypes),
  ...Object.values(fieldTypes.RelationalOnlyDBTypes),
] as string[];

const relationShipOptions = ["builtInEntity"];
const relationShipTypeValues: string[] = Object.values(relationshipTypes);

// const reservedWords = Object.values(reservedKeywords).reduce(
//   (acc: Array<string>, cur) => {
//     if (cur && Array.isArray(cur)) {
//       return acc.concat(cur);
//     } else return acc;
//   },
//   [],
// );

const validationKeys = validations.SUPPORTED_VALIDATION_RULES;

const mainKeywords = [
  "application",
  "deployment",
  "entity",
  "enum",
  "relationship",
];
const appInnerKws = ["config", "entities"];
const generalKws = ["with", "all", "except", "to"];

CodeMirror.defineMode("jdl", function () {
  const words = {};
  function define(style, list) {
    for (let i = 0; i < list.length; i++) {
      words[list[i]] = style;
    }
  }

  // define("reserved", reservedWords);

  // types
  define(
    "special",
    generalKws.concat(
      fieldTypeValues,
      binaryOptionValues,
      applicationOptionValues,
      deploymentTypes,
      deploymentOptionValues,
    ),
  );

  // types
  define("attribute", applicationOptionKeys);
  define("attribute", deploymentOptionKeys);

  define("attribute2", unaryOptionKeys);
  define("attribute2", binaryOptionKeys);
  define("attribute2", relationShipOptions);

  // types
  define("qualifier", validationKeys);
  define("qualifier", generalKws);

  // relationships
  define("relationship", relationShipTypeValues);
  // App inner keywords
  define("relationship", appInnerKws);

  // Keywords
  define("keyword", mainKeywords);

  function tokenBase(stream, state) {
    if (stream.eatSpace()) return null;

    let sol = stream.sol();
    let ch = stream.next();
    let delimiters = "{ } |".split(" ");

    if (ch === "\\") {
      stream.next();
      return null;
    }

    if (sol && ch === "#") {
      stream.skipToEnd();
      return "meta"; // 'directives'
    }

    let lastCh = stream.string.charAt(stream.start - 1);
    let startCh = stream.string.trim().charAt(0);
    if (
      stream.match("//") ||
      ch === "/" ||
      lastCh + ch === "/*" ||
      startCh === "*"
    ) {
      stream.skipToEnd();
      return "comment";
    }

    if (ch === "+" || ch === "=") {
      return "operator";
    }
    if (ch === "-") {
      stream.eat("-");
      stream.eatWhile(/\w/);
      return "attribute";
    }
    if (
      delimiters.some(function (c) {
        return stream.eat(c);
      })
    )
      return "bracket";

    stream.eatWhile(/[\w-]/);
    let cur = stream.current();
    if (stream.peek() === "=" && /\w+/.test(cur)) return "def";
    if (words.hasOwnProperty(cur)) return words[cur];

    if (
      /[A-Z*]/.test(ch) ||
      (lastCh !== "/" && ch === "*") ||
      (lastCh === "*" && ch !== "/")
    ) {
      stream.eatWhile(/[a-z_]/);
      if (stream.eol() || !/\s[{,]/.test(stream.peek())) {
        return "def";
      }
    }

    return null;
  }

  function tokenize(stream, state) {
    return (state.tokens[0] || tokenBase)(stream, state);
  }

  return {
    startState: function () {
      return { tokens: [] };
    },
    token: function (stream, state) {
      return tokenize(stream, state);
    },
    lineComment: "//",
    fold: "brace",
  };
});
const keywords = mainKeywords.concat(
  constructs,
  fieldTypeValues,
  relationShipOptions,
  relationShipTypeValues,
  validationKeys,
  generalKws,
  unaryOptionKeys,
  relationShipOptions,
  binaryOptionKeys,
  binaryOptionValues,
  deploymentTypes,
  applicationOptionKeys,
  deploymentOptionKeys,
  applicationOptionValues,
);
// @ts-ignore
CodeMirror.commands.autocomplete = function (cm) {
  // @ts-ignore
  cm.showHint({ hint: CodeMirror.hint.anyword, list: keywords });
};
