import { jdlToNoml } from "./JDLToNoml";

test("does not include entities or relationships in an application with no entities defined", () => {
  const jdl = `
application {
  config {
    baseName myApp1
    applicationType microservice
    packageName com.myapp
    authenticationType jwt
    prodDatabaseType mysql
  }
}

application {
  config {
    baseName myApp2
    applicationType microservice
    packageName com.myapp
    authenticationType jwt
    prodDatabaseType mysql
  }
  entities C
}

entity A {}

entity B {}

entity C {}

relationship OneToMany {
  A to B
}
`;

  const noml = jdlToNoml(jdl);

  expect(noml).toContain(
    "[<package>myApp1 (microservice)|Auth: jwt, DB: mysql|\n\n]",
  );
  expect(noml).toContain(
    "[<package>myApp2 (microservice)|Auth: jwt, DB: mysql|\n[C|\n\n]\n]",
  );
  expect(noml).toContain("[A|\n\n]");
  expect(noml).toContain("[B|\n\n]");
  expect(noml).toContain("[A] o- (1..*) [B]");
});
