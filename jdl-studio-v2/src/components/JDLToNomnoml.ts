import { parse } from "jhipster-core/lib/dsl/api";
import { type } from "os";

function onlyCompilables(line) {
  var ok = line[0] !== "#";
  return ok ? line.replace(/\/\/[^\n\r]*/gm, "") : "";
}
function isDirective(line) {
  return line.text[0] === "#";
}

enum NomNomlEntityTypes {
  package,
  entity,
  enum,
  relation,
  field,
}
export type NomNomlEntity = {
  name: string;
  type: NomNomlEntityTypes;
  prefix: string;
  children?: NomNomlEntity[];
};

function processEntities(
  JDL,
  filter: string[] = []
): [NomNomlEntity[], string[]] {
  const unProcessed: string[] = [];
  const out: NomNomlEntity[] = [];
  const allEnumNames = JDL.enums.map((it) => it.name);
  const enumsInApp: string[] = [];
  JDL.entities.forEach((entity) => {
    if (filter.length > 0 && !filter.includes(entity.name)) {
      unProcessed.push(entity.name);
      return;
    }
    out.push({
      name: entity.name,
      type: NomNomlEntityTypes.entity,
      prefix: "",
      children: entity.body.map((field) => {
        if (allEnumNames.includes(field.type)) {
          enumsInApp.push(field.type);
          out.push({
            name: `[${entity.name}] --> [${field.type}]`,
            type: NomNomlEntityTypes.relation,
            prefix: "",
          });
        }
        return {
          name: `${field.name} : ${field.type}${
            field.validations.filter((it) => it.key === "required").length == 1
              ? "*"
              : ""
          }`,
          type: NomNomlEntityTypes.field,
          prefix: "",
        };
      }),
    });
  });
  JDL.enums.forEach((en) => {
    if (enumsInApp.length > 0 && !enumsInApp.includes(en.name)) {
      return;
    }
    out.push({
      name: en.name,
      type: NomNomlEntityTypes.enum,
      prefix: "<reference>",
      children: en.values.map((val) => ({
        name: `${val.key}`,
        type: NomNomlEntityTypes.field,
        prefix: "",
      })),
    });
  });
  JDL.relationships.forEach((rel) => {
    if (
      filter.length > 0 &&
      (![...filter, "User"].includes(rel.from.name) ||
        ![...filter, "User"].includes(rel.to.name))
    ) {
      return;
    }
    out.push({
      name: `[${rel.from.name}] ${getCardinality(rel.cardinality)} [${
        rel.to.name
      }]`,
      type: NomNomlEntityTypes.relation,
      prefix: "",
    });
  });

  return [out, unProcessed];
}

export function jdlToNomnoml(jdlString: string): string {
  const lines = jdlString
    .split("\n")
    .map((s, i) => ({ text: s.trim(), index: i }));
  const pureDirectives = lines
    .filter(isDirective)
    .map((it) => it.text)
    .join("\n")
    .trim();

  const pureDiagramCode = lines
    .map((it) => it.text)
    .map(onlyCompilables)
    .join("\n")
    .trim();

  const JDL = parse(pureDiagramCode);
  console.log(JDL);
  let nomnomlEntities: NomNomlEntity[] = [];
  let unProcessedEntities: string[] = [];
  if (JDL.applications.length > 0) {
    // draw entities within apps
    nomnomlEntities = JDL.applications.map((app) => {
      const appLabel = `${app.config.baseName} (${app.config.applicationType})`;
      const [children, unProcessed] = processEntities(
        JDL,
        app.entities.entityList
      );
      unProcessedEntities = [...unProcessedEntities, ...unProcessed];
      return {
        name: appLabel,
        type: NomNomlEntityTypes.package,
        prefix: "<package>",
        children,
      };
    });
  }
  const [processed, unProcessed] = processEntities(JDL, unProcessedEntities);
  // draw remaining entities
  nomnomlEntities = [...nomnomlEntities, ...processed];

  console.log(nomnomlEntities);
	// if (type === 'ENUM'){
	// 	var enumLabel = _.cloneDeep(compartments[0]),
	// 	label = '<<enumeration>>'
	// 	enumLabel.lines[0] = label
	// 	compartments.unshift(enumLabel)
	// }

  const nomnomtext = nomnomlEntities.map(mapText);
  return `${pureDirectives}\n${nomnomtext.join("\n")}\n`;
}

function mapText(it: NomNomlEntity) {
  switch (it.type) {
    case NomNomlEntityTypes.field:
    case NomNomlEntityTypes.relation:
      return `${it.name}\n`;
    default:
      return `[${it.prefix}${it.name}|\n${it.children
        ?.map(mapText)
        .join("\n")}\n]`;
  }
}

function getCardinality(cardinality) {
  switch (cardinality) {
    case "one-to-many":
    case "OneToMany":
      return "-o 1-*";
    case "OneToOne":
    case "one-to-one":
      return "- 1-1";
    case "ManyToOne":
    case "many-to-one":
      return "o- *-1";
    case "ManyToMany":
    case "many-to-many":
      return "o-o *-*";
    default:
      return "-> 1-*";
  }
}
