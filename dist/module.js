import {createState as $hgUW1$createState} from "@lithium-framework/state";


class $89fec59bbef2bb37$export$98c71376181af907 extends Map {
    /**
   * Initialise une nouvelle instance de la classe `_storage` avec des enregistrements initiaux facultatifs et un validateur optionnel.
   * @param {RECORD} [records] - Un objet contenant des paires clé-valeur représentant des enregistrements de données.
   * @param {StateValidator} [validator] - Une fonction de validation optionnelle appelée lors de la modification d'un état.
   * @returns {Storage<RECORD>} Une nouvelle instance de la classe `_storage` initialisée avec les enregistrements et le validateur fournis.
   * @example
   * ```typescript
   * const records = { count: 0, name: "John" };
   * const storage = _storage.init(records);
   * ```
   */ static init(records, validator) {
        return new $89fec59bbef2bb37$export$98c71376181af907(records, validator);
    }
    /**
   * Constructeur qui initialise la classe `_storage` avec des enregistrements optionnels et un validateur.
   * @param {RECORD} [records] - Un objet contenant des paires clé-valeur représentant des enregistrements de données.
   * @param {StateValidator} [validator] - Une fonction de validation optionnelle appelée lors de la modification d'un état.
   */ constructor(records, validator){
        super();
        this._validator = null;
        if (validator) this._validator = validator;
        // Si des enregistrements sont fournis, les ajouter au _storage
        if (records) Object.keys(records).forEach((key)=>{
            this.set(key, (0, $hgUW1$createState)(records[key]));
        });
    }
    /**
   * Récupère la valeur du stockage en fonction d'une clé spécifiée.
   * Si un validateur est défini, il valide la nouvelle valeur avant de l'appliquer.
   * @template T - Le type de la valeur de l'état.
   * @param {StorageKeys<RECORD>} key - La clé utilisée pour accéder à un enregistrement spécifique en stockage.
   * @returns {State<T>["mutator"]} La fonction `mutator` associée à la clé spécifiée de l'objet `State`.
   * @example
   * ```typescript
   * const storage = _storage.init({ count: 0 });
   * const [count, setCount] = storage.get("count");
   * setCount(10); // met à jour la valeur si la validation réussit
   * ```
   */ get(key) {
        if (!this._validator) return super.get(key);
        else {
            let [state, setter] = super.get(key);
            return [
                state,
                (newValue)=>{
                    let previousValue = state.value;
                    let result = this._validator(key, previousValue, newValue);
                    if (result instanceof Promise) result.then(()=>setter(newValue)).catch((error)=>console.error(error));
                    else if (result == true) setter(newValue);
                }
            ];
        }
    }
}


function $0718d8712747089f$export$d184a47a971dd4b9(records = {}, stateValidator) {
    // Création d'un proxy contenant le stockage
    return new Proxy((0, $89fec59bbef2bb37$export$98c71376181af907).init(records, stateValidator), {
        /**
     * Intercepte les opérations d'accès aux propriétés du stockage.
     * @param {Storage<RECORD>} target - L'objet cible auquel les opérations sont appliquées.
     * @param {string} key - La clé de l'état ou de la méthode accédée.
     * @param {any} receiver - L'objet Proxy qui intercepte l'opération.
     * @returns {any} La méthode ou la valeur de l'état correspondant à la clé.
     * @example
     * ```typescript
     * const storage = createStorage({ count: 0 });
     * console.log(storage.count[0].value); // affiche 0
     * storage.count ; // met à jour la valeur de count à 5
     * ```
    */ get (target, key, receiver) {
            // Retourne les méthodes du stockage
            if (target[key]) {
                if (typeof target[key] == "function") return target[key].bind(target);
                else return target[key];
            } else if (target.has(key)) return target.get(key);
            else return undefined;
        },
        /**
     * Intercepte les opérations de mise à jour des propriétés du stockage.
     * @param {Storage<RECORD>} target - L'objet cible auquel les opérations sont appliquées.
     * @param {string} key - La clé de l'état à mettre à jour.
     * @param {any} newValue - La nouvelle valeur à assigner à l'état.
     * @param {any} receiver - L'objet Proxy qui intercepte l'opération.
     * @returns {boolean} Un indicateur de succès de la mise à jour.
     * @example
     * ```typescript
     * const storage = createStorage({ count: 0 });
     * storage.count ; // met à jour la valeur de count à 5
     * console.log(storage.count[0].value); // affiche 5
     * ```
    */ set (target, key, newValue, receiver) {
            if (target.has(key)) {
                // Mise à jour du state contenant la valeur
                target.get(key)[1](newValue);
                return true;
            } else return undefined;
        }
    });
}




export {$0718d8712747089f$export$d184a47a971dd4b9 as createStorage};
//# sourceMappingURL=module.js.map
