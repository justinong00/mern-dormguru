import { Col, Form, Input, Modal, Row, Select, message } from "antd";
import {
  validationRules,
  customValidateEstablishedYear,
  allowNumbersOnly,
  limitInputLengthTo,
} from "../../../helpers/index.js";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { AddUni, UpdateUni } from "../../../apis/unis.js";
import {
  getAllPostcodeOptions,
  updateCityAndStateInputFieldsFromPostcode,
} from "../../../helpers/postalCodeHelper";
import { useEffect, useState } from "react";
import { AddImage } from "../../../apis/images.js";
import dayjs from "dayjs";
import ImageUpload, { customValidateFileList } from "../../../components/ImageUpload.jsx";

/** UniForm component for adding/updating a university.
 * @param {boolean} showUniForm - State to control the visibility of the form modal.
 * @param {function} setShowUniForm - Function to set the visibility of the form modal.
 * @param {Object} selectedUni - The university to be edited (if any).
 * @param {function} reloadUnis - Function to reload the list of universities.
 */
function UniForm({ showUniForm, setShowUniForm, selectedUni, setSelectedUni, reloadUnis }) {
  const dispatch = useDispatch(); // Redux dispatch function
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list

  // To handle the case of when user deletes the existing image in Modal during Edit state, and then closes the Modal without uploading a new one. Reloading the unis prevent the cover photo from reflecting empty as it is removed in ImageUpload.js
  useEffect(() => {
    reloadUnis();
  }, [selectedUni?.logoPic]);

  /** Function to handle form submission
   * @param {Object} values - Form values
   */
  const onFinish = async (values) => {
    try {
      // Set the loading state to true to indicate the form is processing
      dispatch(setLoading(true));

      // Check if there's a new file selected for the logoPic
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        // Append the selected image file and university name to the FormData object
        formData.append("image", fileList[0].originFileObj);
        formData.append("uniName", values.name);

        // Log FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        // Call the AddImage function to upload the image and get the response
        const uploadResponse = await AddImage(formData);

        // If the upload is successful, update the values object with the new logoPic URL
        if (uploadResponse.success) {
          values.logoPic = uploadResponse.data;
        } else {
          // If the upload fails, throw an error to be caught in the catch block
          throw new Error("Failed to upload image");
        }
      } else if (selectedUni?.logoPic) {
        // If no new file is selected and there's an existing logoPic, preserve it
        values.logoPic = selectedUni.logoPic;
      }

      // Determine if we're adding a new university or updating an existing one
      const response = selectedUni
        ? await UpdateUni(selectedUni._id, values) // Update existing university
        : await AddUni(values); // Add new university

      // Reload the list of universities to reflect the changes
      reloadUnis();
      // Display a success message with the response message
      message.success(response.message);
      console.log(values);
      // Hide the university form
      setShowUniForm(false);
    } catch (error) {
      // Display an error message if something goes wrong
      message.error(error.message);
      console.error(error);
    } finally {
      // Set the loading state back to false once the form processing is done
      dispatch(setLoading(false));
    }
  };

  /** Function to handle upload of university logo
   *
   * This function creates a FormData object and appends the selected image file and the university name to it.
   * It then calls the AddImage function to upload the image and update the university's logoPic field.
   * Finally, it reloads the list of universities and displays a success message.
   *
   * @return {Promise<void>} - A promise that resolves when the image has been uploaded and the university's logoPic field has been updated.
   */
  // const uploadUniLogo = async () => {
  //   try {
  //     // The formData object is created using the FormData constructor, which is a built-in JavaScript object that allows you to easily construct a set of key/value pairs representing form fields and their values.
  //     const formData = new FormData();
  //     formData.append("image", imageFile); // Append the selected image file to the formData object
  //     formData.append("uniName", form.getFieldValue("name")); // Append the university name to the formData object
  //     dispatch(setLoading(true));

  //     // Call the AddImage function to upload the image and get the response
  //     const response = await AddImage(formData);

  //     // If the upload is successful, update the university's logoPic field
  //     if (response.success) {
  //       await UpdateUni(selectedUni._id, {
  //         logoPic: response.data, // Update the logoPic field with the response data from the AddImage function
  //       });
  //     }

  //     reloadUnis(); // Reload the list of universities to update the image
  //     console.log(response);
  //     dispatch(setLoading(false));
  //     message.success(response.message);
  //     setShowUniForm(false); // Close the modal
  //   } catch (error) {
  //     message.error(error.message);
  //     console.error(error);
  //     dispatch(setLoading(false));
  //   }
  // };
  /**  Function to delete the university's logo
   *
   * This function calls the UpdateUni function to update the logoPic field of the selected university to an empty string.
   * Then it reloads the list of universities to update the image, displays a success message, and closes the modal.
   *
   * @return {Promise<void>} - A promise that resolves when the university's logo has been deleted.
   */
  // const deleteUniLogo = async () => {
  //   try {
  //     dispatch(setLoading(true));

  //     // Call the UpdateUni function to update the logoPic field of the selected university to an empty string
  //     const response = await UpdateUni(selectedUni._id, {
  //       logoPic: "", // Set the logoPic field of the selected university to an empty string
  //     });

  //     reloadUnis(); // Reload the list of universities to update the image
  //     console.log(response);
  //     dispatch(setLoading(false));
  //     message.success(response.message);
  //     setShowUniForm(false); // Close the modal
  //   } catch (error) {
  //     message.error(error.message);
  //     console.error(error);
  //     dispatch(setLoading(false));
  //   }
  // };

  return (
    <Modal
      open={showUniForm} // Control the visibility of the modal
      onCancel={() => setShowUniForm(false)} // Close the modal
      title={selectedUni ? "Update University" : "Add University"}
      centered // Center the modal on the screen
      width="90%" // Set the width of the modal for smaller screens
      style={{ maxWidth: 800 }} // Set a maximum width for larger screens
      okText={selectedUni ? "Update" : "Add"} // Text for the Modal's OK button
      /** Connecting the Form to the Modal's OK Button:
       *
       * - Why: Normally, the form submission is triggered by a submit button inside the form. However, in this case, the submit action is linked to the OK button of the modal, which is outside the form.
       * - How: By using form.submit(), you manually trigger the form's submit event when the modal's OK button is clicked.
       */
      onOk={() => form.submit()}
    >
      <Form
        layout="vertical" // Vertical layout for form items
        className="flex flex-col gap-2" // Custom class for styling
        onFinish={onFinish} // Handle form submission
        // Pass the form instance to the Form component. This connects the form instance created with useForm to the actual Form component. This linkage is crucial because it enables the modal's OK button to control the form's submission process.
        form={form}
        initialValues={selectedUni} // Set the initial values of the form
      >
        <Row gutter={16}>
          {" "}
          {/* This creates a row with 16 pixels of space between each column. */}
          <Col xs={24} sm={12}>
            {" "}
            {/* This structure ensures that on smaller screens, each input field takes the full width of the row, but on larger screens, two input fields can be displayed side by side. */}
            <Form.Item label="Name" name="name" rules={validationRules["name"]}>
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Website URL" name="websiteURL" rules={validationRules["websiteURL"]}>
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Bio" name="bio" rules={validationRules["bio"]}>
              <Input.TextArea
                autoSize={{ minRows: 2 }}
                allowClear
                showCount
                maxLength={250}
                placeholder="Enter a bio"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Address" name="address" rules={validationRules["address"]}>
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {" "}
            <Form.Item
              label="Logo"
              name="logoPic"
              rules={[
                {
                  required: true,
                  // Custom validator to check if fileList is not empty from index.js in helper folder
                  validator: (_, value) =>
                    customValidateFileList(fileList, value, selectedUni?.logoPic),
                },
              ]}
            >
              <ImageUpload
                fileList={fileList}
                setFileList={setFileList}
                selectedItem={selectedUni}
                form={form}
                fieldName="logoPic"
                setSelectedItem={setSelectedUni}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Established Year"
              name="establishedYear"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
                {
                  validator: (_, value) =>
                    // Custom validator for establishedYear in index.js in helper folder
                    customValidateEstablishedYear(_, 1000, dayjs().year(), value),
                },
              ]}
            >
              <Input type="number" onInput={(e) => limitInputLengthTo(4, e)} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Postal Code" name="postalCode" rules={validationRules["postalCode"]}>
              <Select
                showSearch
                options={getAllPostcodeOptions()}
                onChange={(value) => updateCityAndStateInputFieldsFromPostcode(value, form)}
                onInput={(e) => limitInputLengthTo(5, e)}
                onKeyPress={(e) => allowNumbersOnly(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="City" name="city">
              <Input type="text" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="State" name="state">
              <Input type="text" disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default UniForm;
