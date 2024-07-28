import { _storage, Storage, StateValidator } from './models/storage.js';

/**
 * La fonction `createStorage` crée un objet proxy pour gérer le stockage avec des méthodes d'accès et de mise à jour des données.
 * @template RECORD - Le type de l'enregistrement de stockage.
 * @param {Partial<RECORD>} [records={}] - Un objet partiel de type `RECORD`, contenant des données initiales pour le stockage. 
 * @param {StateValidator} [stateValidator] - Une fonction de validation optionnelle appelée lors de la modification d'un état.
 * @returns {Storage<RECORD>} Un objet Proxy qui entoure l'objet de stockage créé en appelant `_storage.init` avec les enregistrements fournis.
 * @example
 * ```typescript
 * const initialData = { counter: 0, name: "Alice" };
 * const validator: StateValidator<number> = (key, previousValue, newValue) => newValue >= 0;
 * const storage = createStorage(initialData, validator);
 * 
 * let [ counter , setCounter ] = storage.get('counter');
 * setCounter( 10 ); // met à jour la valeur si la validation réussit
 * console.log(+counter); // affiche 10
 * ```
 */
export function createStorage<RECORD extends Record<string, any>>(records: Partial<RECORD> = {}, stateValidator?: StateValidator): Storage<RECORD> {

  // Création d'un proxy contenant le stockage
  return new Proxy(_storage.init<RECORD>(records as RECORD, stateValidator), {

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
    */
    get(target, key: string & any, receiver) {
      // Retourne les méthodes du stockage
      if (target[key]) {
        if (typeof target[key] == "function") return (target[key] as any).bind(target);
        // Retourne les variables du stockage
        else return target[key];
      }
      // Si la clé n'est pas dans le stockage
      // Vérification de la présence de la clé dans le map du stockage
      // Si présence de celle-ci, elle est retournée
      else if (target.has(key)) return target.get(key);
      // Sinon la clé n'existe pas et retourne undefined
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
    */
    set(target, key: string & any, newValue, receiver) {
      if (target.has(key)) {
        // Mise à jour du state contenant la valeur
        target.get(key)[1](newValue);
        return true;
      }
      // Sinon return undefined
      else return undefined;
    }
  }) as any;

}
