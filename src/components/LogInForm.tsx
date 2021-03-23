import React from 'react';
import { withFormik, FormikBag, FormikProps } from 'formik';


type LogInFormProps = {
  onSubmit: (email: string, password: string) => void;
};

type LogInFormValues = {
  email: string;
  password: string;
};

const LogInForm = (props: LogInFormProps & FormikProps<LogInFormValues>) => {
  const { handleSubmit, handleChange } = props;
  return (
    <div className="form login-form">
      <form onSubmit={handleSubmit}>
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
  handleSubmit: (values: LogInFormValues, formikBag: FormikBag<LogInFormProps, LogInFormValues>) => {
    const { onSubmit } = formikBag.props;
    onSubmit(values.email, values.password);
  },
})(LogInForm);
