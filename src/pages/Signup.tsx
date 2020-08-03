import { faUpload, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { FirebaseContext } from '..';
import styles from '../styles/Signup.module.scss';
import { joinClasses } from '../utils/helpers';

export default function Signup() {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const { register, handleSubmit, errors, triggerValidation } = useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileUploadRef = useRef<any>();
  const picturePlaceholderRef = useRef<any>();
  let [profilePhoto, setProfilePhoto] = useState<any>();

  const createAccount = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await firebase.auth.createUserWithEmailAndPassword(data.email, data.password);
      const user = result.user;

      let photoUrl: string = '';
      if (profilePhoto) {
        const fileUploadResult = await firebase.storage.ref(`${user?.uid}/ProfilePhoto/${profilePhoto?.name}`).put(profilePhoto);
        photoUrl = await fileUploadResult.ref.getDownloadURL();
        await user?.updateProfile({ photoURL: photoUrl });
      }

      await firebase.db.ref(`users/${user?.uid}`).set({
        firstname: data.firstname,
        lastname: data.lastname,
        fullname: `${data.firstname.toLowerCase()} ${data.lastname.toLowerCase()}`,
        phone: data.phone,
        address: data.address,
        photoUrl: photoUrl,
        email: data.email,
        chats: {},
      });

      history.push('/');
    } catch (error) {
      setError(error.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="PageWithBg">
      <div className={['card', styles.card].join(' ')}>
        <div className="card-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">
            <path d="M22.5,0A22.5,22.5,0,1,0,45,22.5,22.526,22.526,0,0,0,22.5,0Zm0,3.462A19.027,19.027,0,0,1,36.563,35.319c-1.3-2.387-5.118-4.347-9.195-5.192a1.657,1.657,0,0,1-1.082-2.434,9.472,9.472,0,0,0,1.947-3.786,5.56,5.56,0,0,0,1.893-3.462c.176-1.907-.379-2.109-.379-2.109.69-2.251.879-10.723-4.489-9.682-.865-1.731-6.545-3.1-9.141,1.569-1.21,2.251-1.751,5.53-.541,7.951,0,.176-.365-.183-.541,1.028a7.447,7.447,0,0,0,1.082,3.624,1.788,1.788,0,0,0,.865.7,9.407,9.407,0,0,0,1.893,4,2.41,2.41,0,0,1-1.244,2.434c-4.219.845-8.052,2.806-9.357,5.192A19.04,19.04,0,0,1,22.5,3.462Z" />
          </svg>
          <h2>Create account</h2>
        </div>
        <div className="card-body">
          <div className={styles.loginForm}>
            <p>{error}</p>
            <form onSubmit={handleSubmit(createAccount)}>
              <div className={styles.main}>
                <div className={styles.accountDetails}>
                  <h2>Account Details</h2>
                  <div className={joinClasses('form-group', errors.email ? 'invalid' : '')}>
                    <label htmlFor="email">Email:</label>
                    <input
                      ref={register({
                        required: 'Email address is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'invalid email address',
                        },
                      })}
                      onBlur={() => triggerValidation('email')}
                      className={'form-control'}
                      type="text"
                      name="email"
                      id="email"
                      placeholder=""
                    />
                    <div className="validationMsg error">{errors.email && errors.email.message}</div>
                  </div>
                  <div className={joinClasses('form-group', errors.password ? 'invalid' : '')} style={{ marginBottom: '4rem' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                      ref={register({
                        required: 'Password is required',
                      })}
                      onBlur={() => triggerValidation('password')}
                      className="form-control"
                      type="password"
                      name="password"
                      id="password"
                    />
                    <div className="validationMsg error">{errors.password && errors.password.message}</div>
                  </div>
                </div>
                <div className={styles.profilePicture}>
                  <div ref={picturePlaceholderRef} className={styles.picturePlaceholder}></div>
                  <input
                    ref={fileUploadRef}
                    style={{ display: 'none' }}
                    name="profilePhotoUpload"
                    id="profilePhotoUpload"
                    type="file"
                    accept=".png,.jpg"
                    onChange={(e: any) => {
                      const file: File = e.target.files[0];
                      setProfilePhoto(file);
                      picturePlaceholderRef.current.style.backgroundImage = `url(${window.URL.createObjectURL(file)}`;
                    }}
                  />
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      fileUploadRef.current.click();
                    }}
                  >
                    <FontAwesomeIcon icon={faUpload} />
                    &nbsp; Upload Photo
                  </a>
                </div>
              </div>
              <div className={styles.personalInfo}>
                <h2>Personal Information</h2>
                <div className={joinClasses('form-group', errors.firstname ? 'invalid' : '')}>
                  <label htmlFor="firstname">First Name:</label>
                  <input
                    ref={register({
                      required: 'First name is required',
                    })}
                    onBlur={() => triggerValidation('firstname')}
                    className="form-control"
                    type="text"
                    name="firstname"
                    id="firstname"
                  />
                </div>
                <div className={joinClasses('form-group', errors.lastname ? 'invalid' : '')}>
                  <label htmlFor="lastname">Last Name:</label>
                  <input
                    ref={register({
                      required: 'Last name is required',
                    })}
                    onBlur={() => triggerValidation('lastname')}
                    className="form-control"
                    type="text"
                    name="lastname"
                    id="lastname"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input ref={register()} className="form-control" type="text" name="phone" id="phone" />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address:</label>
                  <input ref={register()} className="form-control" type="text" name="address" id="address" />
                </div>
              </div>
              <div className={styles.btns}>
                <button type="submit" className={['btn', isLoading ? 'loading' : ''].join(' ')}>
                  <div className="btn-spinner"></div>
                  {!isLoading && <FontAwesomeIcon icon={faUserAlt} />} Create my Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
