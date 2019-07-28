import { join } from "path";
let config = {
    "viewDir": join(__dirname, "..", "views"),
    "staticDir": join(__dirname, "..", "assets"),
    port: 8082,
}
export default config;