import { Server, Model, Factory, JSONAPISerializer } from "miragejs";

export const makeServer = () => {
  const server = new Server({
    models: {
      todo: Model
    },
    factories: {
      todo: Factory.extend({
        title(id) {
          return `Todo ${id}`;
        },
        completed: false
      })
    },
    serializers: {
      applicaiton: JSONAPISerializer
    },
    routes() {
      this.namespace = "api";

      this.resource("todos");
    },
    seeds(server) {
      server.createList("todo", 5);
    }
  });

  return server;
};
