import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FirebaseContext } from '..';
import { joinClasses } from '../utils/helpers';
import Modal from './ui/Modal';

interface IChangePasswordProps {
  show: boolean;
  closeHandler: Function;
}
const ChangePassword: React.FC<IChangePasswordProps> = (props) => {
  const fb = useContext(FirebaseContext);
  const { errors, register, handleSubmit, triggerValidation } = useForm();
  const [error, setError] = useState('');

  const changePassword = async (data: any) => {
    try {
      await fb.auth.currentUser?.updatePassword(data.password);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setError('Please login again to change the password');
      } else {
        setError(error.message);
      }
      return;
    }
    props.closeHandler();
  };

  return (
    <Modal show={props.show} closeHandler={() => props.closeHandler()}>
      <form onSubmit={handleSubmit(changePassword)}>
        <h2>Change Password</h2>
        <p style={{ color: '#f40', marginBottom: '1rem' }}>{error}</p>
        <div className={joinClasses('form-group', errors.password ? 'invalid' : '')}>
          <label htmlFor="password" style={{ width: '8rem' }}>
            New Password:
          </label>
          <input
            ref={register({
              required: 'Password is required',
            })}
            onBlur={() => triggerValidation('password')}
            className={'form-control'}
            style={{ width: '100%' }}
            type="password"
            name="password"
            id="password"
            placeholder=""
          />
          <div className="validationMsg error">{errors.password && errors.password.message}</div>
        </div>

        <button style={{ marginTop: '1rem' }} type="submit" className={'btn'}>
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default ChangePassword;
