import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FirebaseContext, StoreContext } from '..';
import { joinClasses } from '../utils/helpers';
import Modal from './ui/Modal';

interface IChangeUserInfoProps {
  show: boolean;
  closeHandler: Function;
}
const ChangeUserInfo: React.FC<IChangeUserInfoProps> = (props) => {
  const fb = useContext(FirebaseContext);
  const store = useContext(StoreContext);

  const { currentUser, loadCurrentUser } = store.dataStore;
  const { errors, register, handleSubmit, triggerValidation } = useForm();

  const saveUserDataChanges = async (data: any) => {
    await fb
      .users()
      .child(currentUser?.uid as string)
      .update({
        firstname: data.firstname,
        lastname: data.lastname,
        fullname: `${data.firstname.toLowerCase()} ${data.lastname.toLowerCase()}`,
        phone: data.phone,
        address: data.address,
      });

    await loadCurrentUser();
    props.closeHandler();
  };

  return (
    <Modal show={props.show} closeHandler={() => props.closeHandler()}>
      <form onSubmit={handleSubmit(saveUserDataChanges)}>
        <h2>Personal Information</h2>
        <div className={joinClasses('form-group', errors.firstname ? 'invalid' : '')}>
          <label htmlFor="firstname">First Name:</label>
          <input
            ref={register({
              required: 'First name is required',
            })}
            defaultValue={currentUser?.firstname}
            onBlur={() => triggerValidation('firstname')}
            className="form-control"
            type="text"
            name="firstname"
            id="firstname"
            style={{ width: '100%' }}
          />
        </div>
        <div className={joinClasses('form-group', errors.lastname ? 'invalid' : '')}>
          <label htmlFor="lastname">Last Name:</label>
          <input
            ref={register({
              required: 'Last name is required',
            })}
            defaultValue={currentUser?.lastname}
            onBlur={() => triggerValidation('lastname')}
            className="form-control"
            type="text"
            name="lastname"
            id="lastname"
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            ref={register()}
            defaultValue={currentUser?.phone}
            className="form-control"
            type="text"
            name="phone"
            id="phone"
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            defaultValue={currentUser?.address}
            ref={register()}
            className="form-control"
            type="text"
            name="address"
            id="address"
            style={{ width: '100%' }}
          />
        </div>

        <button style={{ marginTop: '1rem' }} type="submit" className={'btn'}>
          Save Changes
        </button>
      </form>
    </Modal>
  );
};

export default ChangeUserInfo;
