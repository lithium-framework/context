import { State , createState } from '@lithium-framework/state';

/**
 * Représente la fonction appelée lors du changement d'un état.
 * Cette fonction permet de chaîner la modification de la valeur en exécutant préalablement
 * une fonction de validation ou en envoyant une requête vers un service.
 * La nouvelle valeur est alors stockée dans le state correspondant,
 * en fonction du succès ou de l'échec de l'opération.
 * 
 * @param {string} key - La clé de l'état qui est en train d'être modifié.
 * @param {T} previousValue - La valeur précédente de l'état avant la modification.
 * @param {T} newValue - La nouvelle valeur proposée pour l'état.
 * @returns {Promise<any> | boolean} - Une promesse ou une valeur booléenne indiquant le succès ou l'échec de la modification.
 */
export type StateValidator< T = any > = ( key:string , previousValue:T , newValue:T ) => Promise<any> | boolean;

/** Keys des values d'un Record  */
export type StorageKeys< RECORD > = keyof RECORD;

/** States des values d'un Record  */
export type StorageValues< RECORD > = State<RECORD[ StorageKeys< RECORD > ]>["mutator"];

/** La classe _storage étend Map pour stocker les valeurs d'état et fournit des méthodes
d'initialisation et d'accès aux mutateurs par clé. */
export class _storage<RECORD extends Record<string, any>> extends Map<StorageKeys<RECORD>, StorageValues<RECORD>> {

  private _validator:StateValidator = null;

  /**
   * La fonction `init` initialise une nouvelle instance de la classe Storage avec des enregistrements
   * initiaux facultatifs.
   * @param {RECORD} [records] - Le paramètre « records » est un objet facultatif qui contient des
   * paires clé-valeur représentant des enregistrements de données. Il s'agit d'un type générique
   * `RECORD` qui étend un `Record<string, any>`, ce qui signifie qu'il s'agit d'un enregistrement avec
   * des clés de chaîne et des valeurs de n'importe quel type.
   * @returns Une nouvelle instance de la classe `_storage` avec le paramètre `records` fourni est
   * renvoyée.
   */
  static init<RECORD extends Record<string, any>>(records?: RECORD , validator?:StateValidator ): Storage<RECORD> {
    return new _storage<RECORD>(records , validator) as Storage<RECORD>;
  }

  // Constructeur qui initialise la classe avec des enregistrements optionnels
  constructor(records?: RECORD , validator?:StateValidator ) {
    super();

    if(validator)this._validator = validator;

    // Si des enregistrements sont fournis, les ajouter au _storage
    if (records) {
      Object.keys(records).forEach((key) => {
        this.set(key, createState(records[key]));
      });
    }
  }

  /**
   * Cette fonction TypeScript récupère une valeur du stockage en fonction d'une clé spécifiée.
   * @param key - Le paramètre `key` est de type `StorageKeys<RECORD>`, qui est une clé utilisée pour
   * accéder à un enregistrement spécifique en stockage.
   * @returns La fonction `mutator` associée à la clé spécifiée de l'objet `State` est renvoyée.
  */
  get<T = any>(key: StorageKeys<RECORD>): State<T>["mutator"] {
    
    if(!this._validator)return super.get(key)!;

    else{

      let [ state , setter ] = super.get(key)!;
      return [ state , ( newValue:T ) => {

        let previousValue = state.value;

        let result = this._validator( key as string , previousValue , newValue );

        if(result instanceof Promise){
          result
          .then( () => setter( newValue as any ) )
          .catch(( error ) => console.error( error ) )
        }
        else if(result == true){
          setter( newValue as any )
        }

      }  ]

    }

  }
}

/** Définition du type Storage qui étend partiellement _storage */
export type Storage<RECORD extends Record<string, any>> = _storage<RECORD> & { [key in StorageKeys<RECORD>] : StorageValues< RECORD > };