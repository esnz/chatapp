import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FirebaseContext, StoreContext } from '..';
import { ReactComponent as ProfileIcon } from '../assets/profile_icon.svg';
import styles from '../styles/Account.module.scss';
import { useMountEffect } from '../utils/hooks';
import Avatar from './ui/Avatar';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import ChangeUserInfo from './ChangeUserInfo';
import Spinner from './ui/Spinner';

const Account: React.FC = () => {
  const fb = useContext(FirebaseContext);
  const store = useContext(StoreContext);

  const { setHeaderContent } = store.UIStore;
  const { currentUser, updateProfilePhoto } = store.dataStore;

  const fileUploadRef = useRef<any>();
  const [providerName, setProviderName] = useState('');
  const [userDataModalVisible, setUserDataModalVisible] = useState(false);
  const [emailChangeModalVisible, setEmailChangeModalVisible] = useState(false);
  const [passwordChangeMoodalVisible, setPasswordChangeModalVisible] = useState(false);

  useEffect(() => {
    setProviderName(fb.auth.currentUser?.providerData[0]?.providerId as string);
  }, [fb.auth.currentUser]);

  useMountEffect(() => {
    setHeaderContent({
      title: 'Account',
      icon: <ProfileIcon />,
    });
  });

  const uploadProfilePhoto = async (file: File) => {
    if (file) {
      const fileUploadResult = await fb.storage.ref(`${currentUser?.uid}/ProfilePhoto/${file?.name}`).put(file);
      const photoUrl = await fileUploadResult.ref.getDownloadURL();
      await fb.auth.currentUser?.updateProfile({ photoURL: photoUrl });
      await fb
        .users()
        .child(currentUser?.uid as string)
        .update({
          photoUrl: photoUrl,
        });
      updateProfilePhoto(photoUrl);
    }
  };

  const isSignedInWithFacebook = () => {
    return providerName === 'facebook.com';
  };

  return (
    <div className={styles.account}>
      <ChangeEmail show={emailChangeModalVisible} closeHandler={() => setEmailChangeModalVisible(false)} />
      <ChangePassword show={passwordChangeMoodalVisible} closeHandler={() => setPasswordChangeModalVisible(false)} />
      <ChangeUserInfo show={userDataModalVisible} closeHandler={() => setUserDataModalVisible(false)} />

      {!currentUser && <Spinner showBackDrop={false} />}
      <div className={styles.profilePicture}>
        <Avatar size="xlarge" imageUrl={currentUser?.photoUrl} name={currentUser?.firstname} />
        <input
          ref={fileUploadRef}
          style={{ display: 'none' }}
          name="profilePhotoUpload"
          id="profilePhotoUpload"
          type="file"
          accept=".png,.jpg"
          onChange={async (e: any) => {
            const file: File = e.target.files[0];
            await uploadProfilePhoto(file);
          }}
        />

        <a
          href="/"
          className={styles.uploadBtn}
          onClick={(e) => {
            e.preventDefault();
            fileUploadRef.current.click();
          }}
        >
          Change Photo
        </a>
      </div>
      <div className={styles.accountData}>
        <div className={styles.userName}>
          <h2>{`${currentUser?.firstname} ${currentUser?.lastname}`}</h2>
        </div>

        <div className={styles.option}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <path d="M17.542,19.773h-.108q-1.244,3.5-4.512,3.493a4.856,4.856,0,0,1-3.953-1.83A7.735,7.735,0,0,1,7.464,16.37,10.649,10.649,0,0,1,9.546,9.555a6.208,6.208,0,0,1,5.008-2.623q2.65,0,3.326,2.141h.072l.176-1.812h4q-.8,7.8-.8,10.191,0,2.562,1.352,2.56c.951,0,1.731-.649,2.348-1.938a11.9,11.9,0,0,0,.924-5.066A9.672,9.672,0,0,0,23.3,5.99a9.819,9.819,0,0,0-7.392-2.736A11.012,11.012,0,0,0,7.455,6.905a12.649,12.649,0,0,0-3.367,8.9,10.723,10.723,0,0,0,2.975,8.009q2.982,2.927,8.221,2.93a16.883,16.883,0,0,0,7.324-1.573v3.493A19.637,19.637,0,0,1,14.788,30,14.942,14.942,0,0,1,4.115,26.133Q0,22.259,0,15.73A15.473,15.473,0,0,1,4.39,4.539,15.035,15.035,0,0,1,15.694,0q6.4,0,10.353,3.52A11.834,11.834,0,0,1,30,12.805a11.412,11.412,0,0,1-2.416,7.6,7.548,7.548,0,0,1-5.99,2.862,4.185,4.185,0,0,1-2.862-.969A3.5,3.5,0,0,1,17.542,19.773Zm-2.366-9.659a2.965,2.965,0,0,0-2.6,1.875,9.054,9.054,0,0,0-1.005,4.345,4.73,4.73,0,0,0,.685,2.736,2.064,2.064,0,0,0,1.767.978A2.916,2.916,0,0,0,16.654,18.2a10.812,10.812,0,0,0,.955-4.935,3.615,3.615,0,0,0-.667-2.308A2.144,2.144,0,0,0,15.176,10.114Z" />
          </svg>
          <div>
            <h6>Email Address:</h6>
            <p>{currentUser?.email}</p>
          </div>
          <button onClick={() => setEmailChangeModalVisible(true)} hidden={isSignedInWithFacebook()} className="btnBlue">
            Change
          </button>
        </div>
        {!isSignedInWithFacebook() && (
          <div className={styles.option}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="35.455" viewBox="0 0 30 35.455">
              <path
                d="M17,0c-3.654,0-6.552,1.135-8.395,3.2a11.081,11.081,0,0,0-2.514,7.585v1.491h4.091V10.781a7.087,7.087,0,0,1,1.449-4.858c.959-1.071,2.5-1.832,5.369-1.832s4.416.73,5.369,1.79a7.18,7.18,0,0,1,1.449,4.9v1.491h4.091V10.781a11.13,11.13,0,0,0-2.514-7.628C23.547,1.1,20.649,0,17,0ZM6.091,13.636A4.092,4.092,0,0,0,2,17.727V31.364a4.092,4.092,0,0,0,4.091,4.091H27.909A4.092,4.092,0,0,0,32,31.364V17.727a4.092,4.092,0,0,0-4.091-4.091Zm2.727,8.182a2.727,2.727,0,1,1-2.727,2.727A2.726,2.726,0,0,1,8.818,21.818Zm8.182,0a2.727,2.727,0,1,1-2.727,2.727A2.726,2.726,0,0,1,17,21.818Zm8.182,0a2.727,2.727,0,1,1-2.727,2.727A2.726,2.726,0,0,1,25.182,21.818Z"
                transform="translate(-2)"
              />
            </svg>
            <div>
              <h6>Password:</h6>
              <p>**********</p>
            </div>
            <button onClick={() => setPasswordChangeModalVisible(true)} className="btnBlue">
              Change
            </button>
          </div>
        )}

        <div className={styles.section}>
          <h2>Personal Information</h2>
          <p>
            <span>First name:</span>
            {currentUser?.firstname}
          </p>
          <p>
            <span>Last name:</span>
            {currentUser?.lastname}
          </p>
          <p>
            <span>Phone:</span>
            {currentUser?.phone}
          </p>
          <p>
            <span>Address:</span>
            {currentUser?.address}
          </p>
          <button onClick={() => setUserDataModalVisible(true)} className="btnBlue">
            Change
          </button>
        </div>

        <div className={styles.section}>
          <h2>Delete Account</h2>
          <p>Once you delete your account, there is no going back. Please be careful.</p>
          <button className="btnRed">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default observer(Account);
