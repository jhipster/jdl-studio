import { parse } from "jhipster-core/lib/dsl/api";

function validJDL(line) {
  var ok = line[0] !== "#";
  return ok ? line.replace(/\/\/[^\n\r]*/gm, "") : "";
}
function isDirective(line) {
  return line.text[0] === "#";
}

enum NomlEntityTypes {
  package,
  entity,
  enum,
  relation,
  field,
}
export type NomlEntity = {
  name: string;
  type: NomlEntityTypes;
  renderType: string;
  description?: string;
  children?: NomlEntity[];
};

export function jdlToNoml(jdlString: string): string {
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
    .map(validJDL)
    .join("\n")
    .trim();

  const JDL = parse(pureDiagramCode);
  let nomlEntities: NomlEntity[] = [];
  const allEntityNames = JDL.entities.map((it) => it.name);
  let unProcessedEntities: string[] = [...allEntityNames];
  if (JDL.applications.length > 0) {
    // draw entities within apps
    nomlEntities = JDL.applications.map((app) => {
      const appLabel = `${app.config.baseName} (${app.config.applicationType})`;
      const [children, unProcessed] = processEntities(
        JDL,
        unProcessedEntities,
        findActualEntities(
          app.entities.entityList,
          app.entities.excluded,
          JDL.options.microservice,
          app.config.baseName,
          allEntityNames
        )
      );
      unProcessedEntities = unProcessed;
      return {
        name: appLabel,
        type: NomlEntityTypes.package,
        renderType: "<package>",
        description: `${
          app.config.clientFramework
            ? `Client: ${app.config.clientFramework}, `
            : ""
        }Auth: ${app.config.authenticationType}, DB: ${
          app.config.prodDatabaseType
        }`,
        children,
      };
    });
  }
  if (unProcessedEntities.length > 0) {
    const [processed] = processEntities(
      JDL,
      unProcessedEntities,
      unProcessedEntities
    );
    // parse remaining entities
    nomlEntities = [...nomlEntities, ...processed];
  }
  // convert to noml format
  const nomlText = nomlEntities.map(mapToNoml);
  return `${pureDirectives}\n${nomlText.join("\n")}\n`;
}

function processEntities(
  JDL,
  unProcessed,
  filter: string[] = []
): [NomlEntity[], string[]] {
  const out: NomlEntity[] = [];
  const allEnumNames = JDL.enums.map((it) => it.name);
  const enumsInApp: string[] = [];
  JDL.entities.forEach((entity) => {
    if (filter.length > 0 && !filter.includes(entity.name)) {
      return;
    }
    out.push({
      name: entity.name,
      type: NomlEntityTypes.entity,
      renderType: "",
      children: entity.body.map((field) => {
        if (allEnumNames.includes(field.type)) {
          enumsInApp.push(field.type);
          out.push({
            name: `[${entity.name}] --> [${field.type}]`,
            type: NomlEntityTypes.relation,
            renderType: "",
          });
        }
        return {
          name: `${field.name} : ${field.type}${
            field.validations.filter((it) => it.key === "required").length === 1
              ? "*"
              : ""
          }`,
          type: NomlEntityTypes.field,
          renderType: "",
        };
      }),
    });
    unProcessed = unProcessed.filter((it) => it !== entity.name);
  });
  JDL.enums.forEach((en) => {
    if (!enumsInApp.includes(en.name)) {
      return;
    }
    out.push({
      name: `${en.name}`,
      type: NomlEntityTypes.enum,
      renderType: "<reference>",
      description: "<<enum>>",
      children: en.values.map((val) => ({
        name: `${val.key}`,
        type: NomlEntityTypes.field,
        renderType: "",
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
      type: NomlEntityTypes.relation,
      renderType: "",
    });
  });

  return [out, unProcessed];
}

type MsOption = { list: string[] };

function findActualEntities(
  included: string[],
  excluded: string[],
  msOptions: { [key: string]: MsOption },
  appName: string,
  entities: string[]
): string[] {
  let include = included;
  if (include.includes("*")) {
    include = [...include, ...entities];
    if (msOptions) {
      Object.entries(msOptions).forEach(([key, val]) => {
        if (key !== appName) {
          include = include.filter((it) => !val.list.includes(it));
        }
      });
    }
  }
  if (excluded.length !== 0) {
    include = include.filter((it) => !excluded.includes(it));
  }
  return include;
}

function mapToNoml(it: NomlEntity) {
  switch (it.type) {
    case NomlEntityTypes.field:
    case NomlEntityTypes.relation:
      return `${it.name}\n`;
    default:
      return `[${it.renderType}${it.name}|${
        it.description ? `${it.description}|` : ""
      }\n${it.children?.map(mapToNoml).join("\n")}\n]`;
  }
}

function getCardinality(cardinality) {
  switch (cardinality) {
    case "one-to-many":
    case "OneToMany":
      return "o- (1..*)";
    case "OneToOne":
    case "one-to-one":
      return "- (1..1)";
    case "ManyToOne":
    case "many-to-one":
      return "(1..*) -o";
    case "ManyToMany":
    case "many-to-many":
      return "(*..*) o-o";
    default:
      return "(1..*) ->";
  }
}
