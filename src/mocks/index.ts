import { AnyFactories, AnyModels } from "miragejs/-types";
import { ServerConfig } from "miragejs/server";

export default {
  routes() {
    this.namespace = "api";

    this.get("/account", () => ({
      id: 0,
      login: "user@jhipster.com",
      firstName: "JHiptser",
      lastName: "JHiptser",
      email: "user@jhipster.com",
      imageUrl: null,
      activated: true,
      langKey: "en",
      createdBy: "anonymousUser",
      createdDate: "2020-09-14T10:20:59Z",
      lastModifiedBy: "anonymousUser",
      lastModifiedDate: "2020-09-14T10:20:59Z",
      authorities: ["ROLE_USER"],
    }));

    this.get("/jdl-metadata", () => [
      {
        id: "5492f5eb-3b80-40bf-abed-2d9583b6381f",
        name: "test",
        createdDate: "2020-09-14T13:10:44Z",
        updatedDate: "2020-09-14T13:10:44Z",
        isPublic: false,
      },
      {
        id: "5492f5eb-3b80-40bf-abed-2d9583b6381g",
        name: "test2",
        createdDate: "2020-09-14T13:10:44Z",
        updatedDate: "2020-09-14T13:10:44Z",
        isPublic: false,
      },
    ]);

    this.get("jdl/:jdlId", (_, request) => {
      const jdlId = request.params.jdlId;
      return {
        name: `test-${jdlId}`,
        content: `
// ${jdlId}
entity Region {
  regionName String
}
entity Country {
  countryName String
}
          `,
      };
    });

    this.post("/jdl", () => ({
      id: "5492f5eb-3b80-40bf-abed-2d9583b6381f",
      name: "test",
      createdDate: "2020-09-14T13:10:44Z",
      updatedDate: "2020-09-14T13:10:44Z",
      isPublic: false,
    }));

    this.put("/jdl/:jdlId", (_, request) => ({
      id: request.params.jdlId,
      name: "test",
      createdDate: "2020-09-14T13:10:44Z",
      updatedDate: "2020-09-14T13:10:44Z",
      isPublic: false,
    }));
  },
} as ServerConfig<AnyModels, AnyFactories>;
