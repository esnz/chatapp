import React, { useContext, useState } from 'react';
import Modal from './ui/Modal';
import { joinClasses } from '../utils/helpers';
import { FirebaseContext, StoreContext } from '..';
import { useForm } from 'react-hook-form';

interface IChangeEmailProps {
  show: boolean;
  closeHandler: Function;
}
const ChangeEmail: React.FC<IChangeEmailProps> = (props) => {
  const fb = useContext(FirebaseContext);
  const store = useContext(StoreContext);

  const { currentUser, loadCurrentUser } = store.dataStore;
  const { errors, register, handleSubmit, triggerValidation } = useForm();
  const [error, setError] = useState('');

  const changeEmail = async (data: any) => {
    try {
      await fb.auth.currentUser?.updateEmail(data.email);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setError('Please login again to change the email');
      } else {
        setError(error.message);
      }
      return;
    }

    await fb
      .users()
      .child(currentUser?.uid as string)
      .update({ email: data.email });
    await loadCurrentUser();
    props.closeHandler();
  };

  return (
    <Modal show={props.show} closeHandler={() => props.closeHandler()}>
      <form onSubmit={handleSubmit(changeEmail)}>
        <h2>Change Email</h2>
        <p style={{ color: '#f40', marginBottom: '1rem' }}>{error}</p>
        <div className={joinClasses('form-group', errors.email ? 'invalid' : '')}>
          <label htmlFor="email">New Email:</label>
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
            style={{ width: '100%' }}
            type="text"
            name="email"
            id="email"
            placeholder=""
          />
          <div className="validationMsg error">{errors.email && errors.email.message}</div>
        </div>
        <button style={{ marginTop: '1rem' }} type="submit" className={'btn'}>
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default ChangeEmail;
