import { Form, Input, Modal, Select, message } from "antd";
import { antValidationError } from "../../../helpers/index.js";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { AddUni, UpdateUni } from "../../../apis/unis.js";
import { allPostcodes, findPostcode } from "malaysia-postcodes";
import "../../../../src/index.css";

/** UniForm component for adding a university.
 *
 * This component uses Ant Design's Form and Modal components.
 *
 * @param {boolean} showUniForm - State to control the visibility of the form modal.
 * @param {function} setShowUniForm - Function to set the visibility of the form modal.
 */
function UniForm({ showUniForm, setShowUniForm, selectedUni, reloadUnis }) {
  const dispatch = useDispatch(); // Redux dispatch function

  // Create a form instance using Ant Design's useForm hook
  const [form] = Form.useForm();
  const postcodes = allPostcodes; // List of all postcodes

  // Flatten the postcodes data into an array of objects, each containing a postcode value and label. This array is used to populate the options in the Postal Code Select component of the UniForm.
  const allPostcodeOptions = postcodes.reduce((acc, state) => {
    // Iterate over each state's cities
    state.city.forEach((city) => {
      // Iterate over each city's postcodes
      city.postcode.forEach((postcode) => {
        // Create an object with the postcode value and label
        const option = {
          value: postcode,
          label: `${postcode}`,
        };
        // Add the option to the accumulator array
        acc.push(option);
      });
    });
    // Return the accumulator array
    return acc;
  }, []);

  /** Update the city and state fields in the form based on the provided postcode.
   *
   * @param {string} value - The postcode to search for in the Malaysia Postcodes data.
   * @returns {Promise<void>} - A promise that resolves when the city and state fields have been updated in the form.
   */
  const updateCityAndStateFromPostcode = async (value) => {
    // Find the location associated with the postcode
    const location = findPostcode(value);

    // If the postcode is found in the data
    if (location.found) {
      // Update the city and state fields in the form
      form.setFieldsValue({
        city: location.city, // Update the city field with the location's city
        state: location.state, // Update the state field with the location's state
      });
    } else {
      // Display an error message and clear the city and state fields
      message.error("Postcode not found"); // Display an error message to the user
      form.setFieldsValue({
        city: "", // Clear the city field
        state: "", // Clear the state field
      });
    }
  };

  // Limit the input for the established year to 4 characters
  const handleYearInput = (e) => {
    const value = e.target.value;
    if (value.length > 4) {
      e.target.value = value.slice(0, 4);
    }
  };

  // Function to handle form submission
  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true)); // Sets the loading state to true

      // Simulates a delay of 1 second to show the loading spinner. This creates a new Promise that resolves after a 1-second delay (1000 milliseconds). setTimeout is a built-in function that executes the resolve function after the specified delay. resolve is a function that, when called, will settle the promise and allow the code to continue */
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let response;
      if (!selectedUni) {
        // Call the AddUni function from unis.js to add the university
        response = await AddUni(values);
      } else {
        // Call the UpdateUni function from unis.js to update the university
        response = await UpdateUni(selectedUni._id, values);
      }
      reloadUnis(); // Reload the list of universities
      dispatch(setLoading(false)); // Set the loading state to false

      // Display a success message using ant design's message component if university addition is successful
      message.success(response.message);
      console.log(values); // Log form values on submission
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
      title=""
      centered // Center the modal on the screen
      width={800} // Set the width of the modal
      okText={selectedUni ? "Update" : "Add"} // Text for the Modal's OK button
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
        initialValues={selectedUni} // Set the initial values of the form
      >
        <div className="h1 text-center font-semibold text-gray-600 text-xl uppercase">
          {selectedUni ? "Update University" : "Add University"}
        </div>
        <Form.Item label="University Name" name="name" rules={antValidationError}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Bio" name="bio" rules={antValidationError}>
          <Input.TextArea rows={4} />
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
            <Input type="number" maxLength={4} onInput={handleYearInput} onIn />
          </Form.Item>

          <Form.Item label="Postal Code" name="postalCode" rules={antValidationError}>
            <Select
              className="h-[45px]"
              showSearch
              options={allPostcodeOptions}
              onChange={updateCityAndStateFromPostcode}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="City" name="city" rules={antValidationError}>
            <Input type="text" disabled />
          </Form.Item>

          <Form.Item label="State" name="state" rules={antValidationError}>
            <Input type="text" disabled />
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
