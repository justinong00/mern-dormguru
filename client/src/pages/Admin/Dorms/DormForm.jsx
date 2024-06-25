import { Button, Form, Input, Select, Tabs, Upload } from "antd";
import React, { useState } from "react";
import { antValidationError } from "../../../helpers/index.js";
import { allPostcodes, findPostcode } from "malaysia-postcodes";

function DormForm() {
  const postcodes = allPostcodes; // List of all postcodes
  const [imageFile, setImageFile] = useState(null); // State to store the uploaded image file
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list

  const tempOptions = [
    {
      value: "1",
      label: "Option 1",
    },
    {
      value: "2",
      label: "Option 2",
    },
    {
      value: "3",
      label: "Option 3",
    },
  ];

  const roomOptions = [
    {
      value: "private",
      label: "Private Room",
    },
    {
      value: "shared",
      label: "Shared Room",
    },
    {
      value: "luxury",
      label: "Luxury Room",
    },
  ];

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

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

  return (
    <>
      <div>
        <h1 className="text-gray-600 text-xl font-semibold">Add Dorm</h1>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Details",
            children: (
              <Form layout="vertical" className="flex flex-col gap-5">
                <div className="grid grid-cols-3 gap-5">
                  <Form.Item
                    label="Dorm Name"
                    name="name"
                    rules={antValidationError}
                    className="col-span-2"
                  >
                    <Input type="text" />
                  </Form.Item>

                  <Form.Item label="Description" name="description" rules={antValidationError}>
                    <Input.TextArea rows={4} />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item
                      label="Parent University"
                      name="parentUniversity"
                      rules={antValidationError}
                    >
                      <Select
                        showSearch
                        placeholder="Select a parent university"
                        optionFilterProp="label"
                        onChange={onChange}
                        onSearch={onSearch}
                        options={tempOptions}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Established Year"
                      name="establishedYear"
                      rules={antValidationError}
                    >
                      <Input type="number" maxLength={4} onInput={handleYearInput} />
                    </Form.Item>
                  </div>

                  <Form.Item label="Postal Code" name="postalCode" rules={antValidationError}>
                    <Select
                      className="h-[45px]"
                      showSearch
                      options={allPostcodeOptions}
                      onChange={updateCityAndStateFromPostcode}
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item label="City" name="city" rules={antValidationError}>
                      <Input type="text" disabled />
                    </Form.Item>

                    <Form.Item label="State" name="state" rules={antValidationError}>
                      <Input type="text" disabled />
                    </Form.Item>
                  </div>
                </div>

                <Form.Item label="Cover Photos" name="coverPhotos" rules={antValidationError}>
                  <Upload
                    // This prop passes the current list of files to the Upload component. When the component renders, it will display the files in this list.
                    fileList={fileList}
                    /** This prop is a function that is called whenever the file list changes, either by adding new files or removing existing ones.
                     * 
                     * - The function receives an event object as its argument, which contains the new file list in the fileList property.
                     * - The code ({ fileList: newFileList }) is using object destructuring to extract the fileList property from the event object and assign it to a new variable called newFileList.
                     * - Then, the function setFileList(newFileList) is called, which updates the fileList state with the new file list. This is how the component keeps track of the files that have been uploaded or removed.
                     */
                    onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                    // This prop is a function that is called before each file is uploaded. In this case, it always returns false, which means that the files won't be uploaded to the server automatically. You'll need to handle the file upload manually, typically by sending the file data to a server API.
                    beforeUpload={() => false} 
                    listType="picture"
                  >
                    {fileList.length === 0 && <Button>Click to Upload</Button>}
                  </Upload>
                </Form.Item>

                <Form.Item label="Rooms Offered" name="roomsOffered" rules={antValidationError}>
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select rooms available"
                    optionFilterProp="label"
                    onChange={onChange}
                    onSearch={onSearch}
                    options={roomOptions}
                  />
                </Form.Item>

                <div className="flex justify-end gap-5">
                  <Button>Cancel</Button>
                  <Button htmlType="submit" type="primary">
                    Add
                  </Button>
                </div>
              </Form>
            ),
          },
          { key: "2", label: "Posters" },
        ]}
      />
    </>
  );
}

export default DormForm;
