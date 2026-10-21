import { module } from "@prisma/composer";
import web from "./service";

export default module("school-management-system", ({ provision }) => {
  provision(web);
});
