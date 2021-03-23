import React from 'react';
import { withFormik, FormikBag, FormikProps } from 'formik';


type SignUpFormProps = {
  onSubmit: (email: string, password: string, name: string) => void;
};

type SignUpFormValues = {
  email: string;
  password: string;
  name: string;
};

const SignUpForm = (props: SignUpFormProps & FormikProps<SignUpFormValues>) => {
  const { handleSubmit, handleChange } = props;

  return (
    <div className="form login-form">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange} />
        </div>
        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange} />
        </div>
        <div className="form-field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default withFormik({
  handleSubmit: (values: SignUpFormValues, formikBag: FormikBag<SignUpFormProps, SignUpFormValues>) => {
    const { onSubmit } = formikBag.props;
    onSubmit(values.email, values.password, values.name);
  },
})(SignUpForm);
