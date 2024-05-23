import Cookies from 'js-cookie';
import CurrentUser from '../models/User/CurrentUser';
import logger from './loggerUtil';


const AuthTokenUtil = {

  setAuthToken: (authUser:CurrentUser) => {
    Cookies.set('authUser', JSON.stringify(authUser), { secure: false, sameSite: 'Strict' });
    
  },

  removeAuthToken: () => {
    Cookies.remove('authUser')
  },

  getAuthToken: (): CurrentUser | undefined => {
    const authUserStr = Cookies.get('authUser');
    if(authUserStr != undefined){
      return JSON.parse(authUserStr) as CurrentUser
    }
  
    return undefined;
  }

}

export default AuthTokenUtil;
