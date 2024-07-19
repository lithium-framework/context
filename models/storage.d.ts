import { State } from '@lithium-framework/state';
/**
 * Représente la fonction appelée lors du changement d'un état.
 * Cette fonction permet de valider la nouvelle valeur avant de l'appliquer à l'état.
 * La nouvelle valeur est stockée dans le state correspondant en fonction du succès ou de l'échec de l'opération.
 *
 * @template T - Le type de la valeur de l'état.
 * @param {string} key - La clé de l'état en cours de modification.
 * @param {T} previousValue - La valeur précédente de l'état avant la modification.
 * @param {T} newValue - La nouvelle valeur proposée pour l'état.
 * @returns {Promise<any> | boolean} - Une promesse ou une valeur booléenne indiquant le succès ou l'échec de la modification.
 * @example
 * ```typescript
 * const validator: StateValidator<number> = (key, previousValue, newValue) => {
 *   if (newValue >= 0) return true;
 *   return false;
 * };
 * ```
 */
export type StateValidator<T = any> = (key: string, previousValue: T, newValue: T) => Promise<any> | boolean;
/**
 * Type représentant les clés des valeurs d'un enregistrement.
 * @template RECORD - Le type de l'enregistrement.
 */
export type StorageKeys<RECORD> = keyof RECORD;
/**
 * Type représentant les mutateurs des valeurs d'un enregistrement.
 * @template RECORD - Le type de l'enregistrement.
 */
export type StorageValues<RECORD> = State<RECORD[StorageKeys<RECORD>]>["mutator"];
/**
 * La classe `_storage` étend `Map` pour stocker les valeurs d'état et fournit des méthodes
 * d'initialisation et d'accès aux mutateurs par clé.
 * @template RECORD - Le type de l'enregistrement stocké.
 */
export declare class _storage<RECORD extends Record<string, any>> extends Map<StorageKeys<RECORD>, StorageValues<RECORD>> {
    private _validator;
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
    static init<RECORD extends Record<string, any>>(records?: RECORD, validator?: StateValidator): Storage<RECORD>;
    /**
     * Constructeur qui initialise la classe `_storage` avec des enregistrements optionnels et un validateur.
     * @param {RECORD} [records] - Un objet contenant des paires clé-valeur représentant des enregistrements de données.
     * @param {StateValidator} [validator] - Une fonction de validation optionnelle appelée lors de la modification d'un état.
     */
    constructor(records?: RECORD, validator?: StateValidator);
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
    get<T = any>(key: StorageKeys<RECORD>): State<T>["mutator"];
}
/**
 * Type `Storage` qui étend partiellement `_storage`.
 * @template RECORD - Le type de l'enregistrement.
 */
export type Storage<RECORD extends Record<string, any>> = _storage<RECORD> & {
    [key in StorageKeys<RECORD>]: StorageValues<RECORD>;
};
