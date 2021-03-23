import React from 'react';
import { withFormik, FormikBag, FormikProps } from 'formik';


type RequestFormProps = {
  onSubmit: (uid: string, advertId: string, description: string, email: string) => Promise<boolean>;
  advertId: string;
  uid: string;
};

type RequestFormValues = {
  description: string;
  email: string;
};

const RequestForm = (props: RequestFormProps & FormikProps<RequestFormValues>) => {
  const { values, handleSubmit, handleChange } = props;
  return (
    <div className="form request-form">
      <h3>Leave a request</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange} ></textarea>
        </div>
        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default withFormik({
  handleSubmit: async (values: RequestFormValues, formikBag: FormikBag<RequestFormProps, RequestFormValues>) => {
    const { props, resetForm } = formikBag;
    const { onSubmit, uid, advertId } = props;
    const response = await onSubmit(uid, advertId, values.description, values.email);
    if (response) {
      resetForm();
    }
  },
})(RequestForm);
