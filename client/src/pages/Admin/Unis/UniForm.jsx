import { Form, Input, Modal, message } from "antd";
import { antValidationError } from "../../../helpers/index.js";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { AddUni } from "../../../apis/unis.js";
const { TextArea } = Input;


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
  const dispatch = useDispatch();

  // Function to handle form submission
  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true)); // Sets the loading state to true

      // Simulates a delay of 1 second to show the loading spinner. This creates a new Promise that resolves after a 1-second delay (1000 milliseconds). setTimeout is a built-in function that executes the resolve function after the specified delay. resolve is a function that, when called, will settle the promise and allow the code to continue */
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(values); // Log form values on submission

      // Call the AddUni function from unis.js to add the university
      const response = await AddUni(values);

      console.log(values); // Log form values on submission
      dispatch(setLoading(false)); // Set the loading state to false

      // Display a success message using ant design's message component if university addition is successful
      message.success(response.message);

      // Close the modal
      setShowUniForm(false);
    } catch (error) {
      message.error(error.message); // Display an error message using ant design's message component if university addition fails
      console.error(error); // Log error on submission
      dispatch(setLoading(false)); // Set the loading state to false
    }
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
        <Form.Item label="University Name" name="name" rules={antValidationError}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Bio" name="bio" rules={antValidationError}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Website URL" name="websiteURL" rules={antValidationError}>
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
