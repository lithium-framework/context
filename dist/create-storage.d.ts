import { Storage, StateValidator } from './models/storage.js';
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
export declare function createStorage<RECORD extends Record<string, any>>(records?: Partial<RECORD>, stateValidator?: StateValidator): Storage<RECORD>;
