import { faKey, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { FirebaseContext } from '..';
import Spinner from '../components/ui/Spinner';
import styles from '../styles/Login.module.scss';

export default function Login() {
  const fb = useContext(FirebaseContext);
  const { register, handleSubmit, errors, triggerValidation } = useForm();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const history = useHistory();

  const login = async (data: any) => {
    setIsLoading2(true);
    try {
      await fb.auth.signInWithEmailAndPassword(data.email, data.password);
      history.push('/');
    } catch (error) {
      setIsError(true);
      setIsLoading2(false);
    }
  };

  const loginWithFacebook = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setIsLoading(true);
    e.preventDefault();
    var provider = fb.facebookProvider();

    const result = await fb.auth.signInWithPopup(provider);
    const user = result.user;
    await fb.db.ref(`users/${user?.uid}`).set({
      firstname: user?.displayName?.split(' ')[0],
      lastname: user?.displayName?.split(' ')[1],
      fullname: user?.displayName?.toLowerCase(),
      phone: user?.phoneNumber,
      address: '',
      photoUrl: user?.photoURL,
      email: user?.email,
    });
    setIsLoading(false);
    history.push('/');
  };

  return (
    <div className="PageWithBg">
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {isLoading && <Spinner />}
          <div className={styles.header}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 45 45">
              <path d="M22.5,0A22.5,22.5,0,1,0,45,22.5,22.526,22.526,0,0,0,22.5,0Zm0,3.462A19.027,19.027,0,0,1,36.563,35.319c-1.3-2.387-5.118-4.347-9.195-5.192a1.657,1.657,0,0,1-1.082-2.434,9.472,9.472,0,0,0,1.947-3.786,5.56,5.56,0,0,0,1.893-3.462c.176-1.907-.379-2.109-.379-2.109.69-2.251.879-10.723-4.489-9.682-.865-1.731-6.545-3.1-9.141,1.569-1.21,2.251-1.751,5.53-.541,7.951,0,.176-.365-.183-.541,1.028a7.447,7.447,0,0,0,1.082,3.624,1.788,1.788,0,0,0,.865.7,9.407,9.407,0,0,0,1.893,4,2.41,2.41,0,0,1-1.244,2.434c-4.219.845-8.052,2.806-9.357,5.192A19.04,19.04,0,0,1,22.5,3.462Z" />
            </svg>
            <h2>Sign In</h2>
          </div>
          <div className="card-body">
            {isError && <p className={styles.errorMsg}>Invalid email or password</p>}
            <div className={styles.loginForm}>
              <form onSubmit={handleSubmit(login)}>
                <div className={['form-group', errors.email ? 'invalid' : ''].join(' ')} style={{ marginBottom: '1rem' }}>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      ref={register({
                        required: 'Required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'invalid email address',
                        },
                      })}
                      onBlur={() => triggerValidation('email')}
                      className="form-control "
                      type="text"
                      name="email"
                      id="email"
                      placeholder="email"
                    />
                  </div>
                </div>
                <div className={['form-group', errors.password ? 'invalid' : ''].join(' ')}>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faKey} />
                    <input
                      ref={register({
                        required: 'Required',
                      })}
                      onBlur={() => triggerValidation('password')}
                      className="form-control"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="password"
                    />
                  </div>
                </div>
                <div className={styles.btns}>
                  <button type="submit" className={['btn block', isLoading2 ? 'loading' : ''].join(' ')}>
                    <div className="btn-spinner"></div>
                    {!isLoading2 && (
                      <>
                        <FontAwesomeIcon icon={faSignInAlt} /> Login
                      </>
                    )}
                  </button>
                  <p>
                    <a href="/" onClick={(e) => loginWithFacebook(e)} className={styles.signUpLink}>
                      Login with Facebook
                    </a>
                  </p>
                  <p>
                    Not registered yet?&nbsp;
                    <Link to="/signup" className={styles.signUpLink}>
                      Create an account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <p className={styles.copyright}>&copy; 2020, Developed by Ehsan Azizi</p>
      </div>
    </div>
  );
}
