import { Button, Form, Input, Modal, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  validationRules,
  customValidateEstablishedYear,
  customValidateFileList,
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
import { useState } from "react";
import { AddUniLogoPic } from "../../../apis/images.js";
import dayjs from "dayjs";

/** UniForm component for adding/updating a university.
 * @param {boolean} showUniForm - State to control the visibility of the form modal.
 * @param {function} setShowUniForm - Function to set the visibility of the form modal.
 * @param {Object} selectedUni - The university to be edited (if any).
 * @param {function} reloadUnis - Function to reload the list of universities.
 */
function UniForm({ showUniForm, setShowUniForm, selectedUni, reloadUnis }) {
  const dispatch = useDispatch(); // Redux dispatch function
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list

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

        // Call the AddUniLogoPic function to upload the image and get the response
        const uploadResponse = await AddUniLogoPic(formData);

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
   * It then calls the AddUniLogoPic function to upload the image and update the university's logoPic field.
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

  //     // Call the AddUniLogoPic function to upload the image and get the response
  //     const response = await AddUniLogoPic(formData);

  //     // If the upload is successful, update the university's logoPic field
  //     if (response.success) {
  //       await UpdateUni(selectedUni._id, {
  //         logoPic: response.data, // Update the logoPic field with the response data from the AddUniLogoPic function
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
      width={800} // Set the width of the modal
      okText={selectedUni ? "Update" : "Add"} // Text for the Modal's OK button
      /** Connecting the Form to the Modal's OK Button:
       *
       * - Why: Normally, the form submission is triggered by a submit button inside the form. However, in this case, the submit action is linked to the OK button of the modal, which is outside the form.
       * - How: By using form.submit(), you manually trigger the form's submit event when the modal's OK button is clicked.
       */
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical" // Vertical layout for form items
        className="flex flex-col gap-2" // Custom class for styling
        onFinish={onFinish} // Handle form submission
        // Pass the form instance to the Form component. This connects the form instance created with useForm to the actual Form component. This linkage is crucial because it enables the modal's OK button to control the form's submission process.
        form={form}
        initialValues={selectedUni} // Set the initial values of the form
      >
        <Form.Item label="University Name" name="name" rules={validationRules["name"]}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Bio" name="bio" rules={validationRules["bio"]}>
          <Input.TextArea rows={4} showCount maxLength={250} />
        </Form.Item>

        <Form.Item label="Website URL" name="websiteURL" rules={validationRules["websiteURL"]}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={validationRules["address"]}>
          <Input type="text" />
        </Form.Item>

        <Form.Item
          label="Logo"
          name="logoPic"
          rules={[
            {
              required: true,
              // Custom validator to check if fileList is not empty from index.js in helper folder
              validator: (_, value) => customValidateFileList(fileList, selectedUni),
            },
          ]}
        >
          <Upload
            // fileList prop is used to display the list of uploaded files. If selectedUni has a logoPic URL, it creates a fileList with that URL. Otherwise, it uses the fileList state
            fileList={selectedUni?.logoPic ? [{ url: selectedUni.logoPic }] : fileList}
            // onChange prop is a function that handles changes in the fileList. It receives an object with the new fileList and the file that triggered the change
            onChange={({ fileList: newFileList, file }) => {
              // Handle file removal
              if (file.status === "removed") {
                setFileList([]);
                if (selectedUni?.logoPic) {
                  selectedUni.logoPic = ""; // If selectedUni has a logoPic URL, remove it from the selectedUni statee
                }
              } else {
                // Otherwise, update the fileList state with the new fileList
                setFileList(newFileList);
              }
            }}
            // This prop is a function that is called before each file is uploaded. In this case, it always returns false, which means that the files won't be uploaded to the server automatically. You'll need to handle the file upload manually, typically by sending the file data to a server API.
            beforeUpload={() => false}
            listType="picture"
          >
            {/* If selectedUni doesn't have a logoPic URL and the fileList is empty, render a Button component with an UploadOutlined icon */}
            {!selectedUni?.logoPic && fileList.length === 0 && (
              <Button block icon={<UploadOutlined />}>
                Click to Upload
              </Button>
            )}
          </Upload>
        </Form.Item>

        <div className="grid grid-cols-2 gap-5">
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

          <Form.Item label="Postal Code" name="postalCode" rules={validationRules["postalCode"]}>
            <Select
              className="h-[45px]"
              showSearch
              options={getAllPostcodeOptions()}
              onChange={(value) => updateCityAndStateInputFieldsFromPostcode(value, form)}
              onInput={(e) => limitInputLengthTo(5, e)}
              onKeyPress={(e) => allowNumbersOnly(e)}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="City" name="city">
            <Input type="text" disabled />
          </Form.Item>

          <Form.Item label="State" name="state">
            <Input type="text" disabled />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
export default UniForm;
