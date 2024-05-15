import { _storage , Storage , StateValidator } from './models/storage.js';

/**
 * La fonction `createStorage` crée un objet proxy pour gérer le stockage avec des méthodes d'accès et
 * de mise à jour des données.
 * @param records - Le paramètre `records` dans la fonction `createStorage` est utilisé pour
 * initialiser le stockage avec certaines données initiales. Il s'agit d'un objet partiel de type
 * `RECORD`, qui est un type générique étendant `Record<string, any>`. Ce paramètre vous permet de
 * fournir un ensemble initial de paires clé-valeur
 * @returns La fonction `createStorage` renvoie un objet Proxy qui entoure l'objet de stockage créé en
 * appelant `_storage.init` avec les enregistrements fournis. L'objet Proxy permet d'intercepter et de
 * personnaliser les opérations sur l'objet de stockage, telles que l'accès et la mise à jour des clés.
*/
export function createStorage<RECORD extends Record<string, any>>(records: Partial<RECORD> = {} , stateValidator?:StateValidator ): Storage<RECORD> {

  // Création d'un proxy contenant le stockage
  return new Proxy(_storage.init<RECORD>(records as RECORD , stateValidator), {

    // Accès aux méthodes et variables du stockage
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

    // Mise à jour d'une clé existante dans le stockage
    // Si celle-ci existe
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

// let storage = createStorage<{ username : string }>({ username : 'guillaume' });

// storage.username;