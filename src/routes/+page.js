import basic_json from "./amat_basic_quest_delim.json";
import advanced_json from "./amat_adv_quest_delim.json";

export function load() {
    return { basic: basic_json, advanced: advanced_json };
}
