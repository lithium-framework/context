import { State } from 'thorium-lit-state';
import { createStorage } from '../dist/index.js';

describe( 'DesignSystem' , ( ) => {

  it( 'Create Table' , () => {

    let storage = createStorage({
      username : 'guillaume',
      lastname : 'houthoofd',
      age : 29,
    })

    let [ username , setUsername ] = storage.get('username');
    let [ lastname , setLastname ] = storage.get('lastname');
    let [ age , setAge ] = storage.get('age');

    console.log({ user1 : `${username} ${lastname} ${age} years` });

  } )

})