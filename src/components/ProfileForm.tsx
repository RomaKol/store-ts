import React from 'react';
import { withFormik, FormikBag, FormikProps } from 'formik';
import {User} from 'dto/user';


type ProfileFormProps = {
  onSubmit: (uid: string, email: string, name: string) => void;
  userData: User | null;
};

type ProfileFormValues = {
  uid: string;
  email: string;
  name: string;
};

const ProfileForm = (props: ProfileFormProps & FormikProps<ProfileFormValues>) => {
  const { handleSubmit, handleChange, values } = props;

  return (
    <div className="form profile-form">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={values.name}
            onChange={handleChange} />
        </div>
        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default withFormik({
  mapPropsToValues: (props: ProfileFormProps) => {
    const { userData } = props;
    return {
      uid: userData ? userData.uid : "",
      name: userData ? userData.name : "",
      email: userData ? userData.email : "",
    }
  },
  handleSubmit: (values: ProfileFormValues, formikBag: FormikBag<ProfileFormProps, ProfileFormValues>) => {
    const { onSubmit } = formikBag.props;
    onSubmit(values.uid, values.name, values.email);
  },
})(ProfileForm);
