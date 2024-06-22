import { Form, Input, Modal } from "antd";
import { antValidationError } from "../../../helpers/index.js";

/** UniForm component for adding a university.
 * 
 * This component uses Ant Design's Form and Modal components.
 *
 * @param {boolean} showUniForm - State to control the visibility of the form modal.
 * @param {function} setShowUniForm - Function to set the visibility of the form modal.
 */
function UniForm({ showUniForm, setShowUniForm }) {
  // Create a form instance using Ant Design's useForm hook
  const [form] = Form.useForm();

  // Function to handle form submission
  const onFinish = (values) => {
    console.log(values); // Log form values on submission
  };

  return (
    <Modal
      open={showUniForm} // Control the visibility of the modal
      onCancel={() => setShowUniForm(false)} // Close the modal
      title="Add University" // Title of the modal
      centered // Center the modal on the screen
      width={800} // Set the width of the modal
      okText="Add" // Text for the Modal's OK button
      /** Connecting the Form to the Modal's OK Button:
       * 
       * - Why: Normally, the form submission is triggered by a submit button inside the form. However, in this case, the submit action is linked to the OK button of the modal, which is outside the form. 
       * - How: By using form.submit(), you manually trigger the form's submit event when the modal's OK button is clicked.
       */
      onOk={() => form.submit()} // Submit the form when the Modal's OK button is clicked
    >
      <Form
        layout="vertical" // Vertical layout for form items
        className="flex flex-col gap-2" // Custom class for styling
        onFinish={onFinish} // Handle form submission
        // Pass the form instance to the Form component. This connects the form instance created with useForm to the actual Form component. This linkage is crucial because it enables the modal's OK button to control the form's submission process.
        form={form} 
      >
        <Form.Item label="University Name" name="universityName" rules={antValidationError}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Bio" name="bio" rules={antValidationError}>
          <Input.TextArea rows={4} /> {/* Text area for bio */}
        </Form.Item>

        <Form.Item label="Website URL" name="website URL" rules={antValidationError}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={antValidationError}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Logo" name="logoPic" rules={antValidationError}>
          <Input type="text" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="Established Year" name="establishedYear" rules={antValidationError}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Postal Code" name="postalCode" rules={antValidationError}>
            <Input type="number" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="City" name="city" rules={antValidationError}>
            <Input type="text" />
          </Form.Item>

          <Form.Item label="State" name="state" rules={antValidationError}>
            <Input type="text" />
          </Form.Item>
        </div>

        {/* Placeholder for related dorms input field */}
        {/* <Form.Item
          label="Related Dorms"
          name="relatedDorms"
          rules={antValidationError}
        >
          <Input type="text" />
        </Form.Item> */}
      </Form>
    </Modal>
  );
}

export default UniForm;
