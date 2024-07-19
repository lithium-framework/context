import { createState } from '@lithium-framework/state';
/**
 * La classe `_storage` étend `Map` pour stocker les valeurs d'état et fournit des méthodes
 * d'initialisation et d'accès aux mutateurs par clé.
 * @template RECORD - Le type de l'enregistrement stocké.
 */
export class _storage extends Map {
    _validator = null;
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
     */
    static init(records, validator) {
        return new _storage(records, validator);
    }
    /**
     * Constructeur qui initialise la classe `_storage` avec des enregistrements optionnels et un validateur.
     * @param {RECORD} [records] - Un objet contenant des paires clé-valeur représentant des enregistrements de données.
     * @param {StateValidator} [validator] - Une fonction de validation optionnelle appelée lors de la modification d'un état.
     */
    constructor(records, validator) {
        super();
        if (validator)
            this._validator = validator;
        // Si des enregistrements sont fournis, les ajouter au _storage
        if (records) {
            Object.keys(records).forEach((key) => {
                this.set(key, createState(records[key]));
            });
        }
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
     */
    get(key) {
        if (!this._validator)
            return super.get(key);
        else {
            let [state, setter] = super.get(key);
            return [state, (newValue) => {
                    let previousValue = state.value;
                    let result = this._validator(key, previousValue, newValue);
                    if (result instanceof Promise) {
                        result
                            .then(() => setter(newValue))
                            .catch((error) => console.error(error));
                    }
                    else if (result == true) {
                        setter(newValue);
                    }
                }];
        }
    }
}
//# sourceMappingURL=storage.js.map