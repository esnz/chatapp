import { firebase as fb } from '../index';

export const getUserData = async (uid: string) => {
  const user = await fb.users().child(uid).once('value');
  return user.val();
};
