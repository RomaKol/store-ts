import React from 'react';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { DesiredPlacement } from 'dto/desiredPlacement';


type AdvertisementFormProps = {
  onSubmit: (uid: string, title: string, description: string, image: File, published: string[], desired: string[]) => Promise<boolean>;
  desiredPlacementsList: DesiredPlacement[];
  uid: string;
};

type AdvertisementFormValues = {
  title: string;
  description: string;
  image: File;
  published: string[];
  desired: string[];
};

const AdvertisementForm = (props: AdvertisementFormProps & FormikProps<AdvertisementFormValues>) => {
  const { handleSubmit, handleChange, setFieldValue, desiredPlacementsList } = props;
  const handleImageAsFile = (event: any) => {
    const image = event.target.files[0];
    setFieldValue("image", image);
  };

  return (
    <div className="form login-form">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange} />
        </div>
        <div className="form-field">
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange} ></textarea>
        </div>
        <div className="form-field">
          <input
            type="file"
            name="image"
            placeholder="Image"
            accept="image/png, image/jpeg"
            onChange={handleImageAsFile} />
        </div>
        <div className="form-field">
          <label className="form-field__label">
            <span>Published</span>
            <input
              type="checkbox"
              name="published"
              onChange={handleChange} />
          </label>
        </div>
        <div className="form-field">
          <label className="form-field__label">Desired Placement</label>
          {
            desiredPlacementsList.length > 0 &&
            <div className="row">
              {
                desiredPlacementsList.map(item => {
                  return <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                    <div className="form-field">
                      <label className="form-field__label">
                        <span>{item.title}</span>
                        <input
                          type="checkbox"
                          name="desired"
                          value={item.id}
                          onChange={handleChange} />
                      </label>
                    </div>
                  </div>
                })
              }
            </div>
          }
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default withFormik({
  handleSubmit: async (values: AdvertisementFormValues, formikBag: FormikBag<AdvertisementFormProps, AdvertisementFormValues>) => {
    const { onSubmit, uid } = formikBag.props;
    const response = await onSubmit(uid, values.title, values.description, values.image, values.published, values.desired);
    console.log("response", response);
  },
})(AdvertisementForm);
