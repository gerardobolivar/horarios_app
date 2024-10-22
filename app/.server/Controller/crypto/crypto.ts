
import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { createHash, getHashByUserId, getSaltByUserId } from 'prisma/models/hashModel';

class CryptoSec{

  async setPassword(password:string,userID:number):Promise<boolean | null>{
    const salt = randomBytes(16).toString('hex')
    const hash = pbkdf2Sync(salt,password,1000,64,`sha512`).toString('hex');
    
    return await createHash(userID,salt,hash).then((r)=>{
      return true;
    },(r)=>{
      console.error(r)      
      return null;
    }).catch(e=>{
      console.error(e);
      return null;
    })

  }

  async validatePassword(user_id:number, password:string):Promise<boolean>{
    const hash = await getHashByUserId(user_id);
    if(hash){
      const salt = hash.salt;
      const entrantHash = pbkdf2Sync(salt,password,1000,64,`sha512`).toString('hex');
      return entrantHash === hash.hash; 
    }
    return false;

  }
}

export default CryptoSec;