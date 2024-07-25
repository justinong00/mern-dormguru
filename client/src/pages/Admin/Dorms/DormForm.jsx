import { Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  allowNumbersOnly,
  customValidateEstablishedYear,
  limitInputLengthTo,
  validationRules,
} from "../../../helpers/index.js";
import { GetAllUnis } from "../../../apis/unis.js";
import {
  getAllPostcodeOptions,
  updateCityAndStateInputFieldsFromPostcode,
} from "../../../helpers/postalCodeHelper.js";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { AddDorm, UpdateDorm } from "../../../apis/dorms.js";
import { setLoading } from "../../../redux/loadersSlice.js";
import { AddImage } from "../../../apis/images.js";
import ImageUpload, { customValidateFileList } from "../../../components/ImageUpload.jsx";
import { roomOptions } from "../../../helpers/roomOptions.js"; // Options for Rooms Offered
import { dormTypeOptions } from "../../../helpers/dormTypeOptions.js";

function DormForm({ showDormForm, setShowDormForm, selectedDorm, reloadDorms }) {
  const dispatch = useDispatch(); // Redux dispatch function
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list
  const [ParentUniversityOptions, setParentUniversityOptions] = useState([]); // State to store university options

  // Function to fetch university options from the backend
  const fetchParentUniversityOptions = async () => {
    try {
      const response = await GetAllUnis();
      setParentUniversityOptions(
        response.data.map((uni) => ({
          value: uni._id,
          label: uni.name,
        })),
      );
      console.log("Parent universities:", response.data);
    } catch (error) {
      console.error("Error fetching Parent Universities:", error);
    }
  };

  // Fetch university options when the component mounts
  useEffect(() => {
    fetchParentUniversityOptions();
  }, []);

  // To handle the case of when user deletes the existing image in Modal during Edit state, and then closes the Modal without uploading a new one. Reloading the dorms prevent the cover photo from reflecting empty as it is removed in ImageUpload.js
  useEffect(() => {
    reloadDorms();
  }, [selectedDorm?.coverPhotos]);

  // Function to handle form submission
  const onFinish = async (values) => {
    try {
      // Set the loading state to true to indicate the form is processing
      dispatch(setLoading(true));

      // If a file is selected, upload the image
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        // Append the selected image file and dorm name to the FormData object
        formData.append("image", fileList[0].originFileObj);
        formData.append("dormName", values.name);
        // Log FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        const uploadResponse = await AddImage(formData); // Upload the image

        // If the upload is successful, update the coverPhotos value object with the new cloudinary URL
        if (uploadResponse.success) {
          values.coverPhotos = uploadResponse.data;
        } else {
          // If the upload fails, throw an error to be caught in the catch block
          throw new Error("Failed to upload image");
        }
      } else if (selectedDorm?.coverPhotos) {
        values.coverPhotos = selectedDorm.coverPhotos;
      }

      // Determine if we're adding a new dorm or updating an exisitng one
      const response = selectedDorm
        ? await UpdateDorm(selectedDorm._id, values) // Update existing dorm
        : await AddDorm(values); // Add new dorm

      // Reload the list of dorms to update the table
      reloadDorms();
      message.success(response.message);
      console.log(values);
      setShowDormForm(false);
    } catch (error) {
      // Display an error message if something goes wrong
      message.error(error.message);
      console.error(error);
    } finally {
      // Set the loading state back to false once the form processing is done
      dispatch(setLoading(false));
    }
  };

  return (
    <Modal
      open={showDormForm}
      onCancel={() => setShowDormForm(false)}
      title={selectedDorm ? "Update Dorm" : "Add Dorm"}
      centered // Center the modal on the screen
      width="90%" // Set the width of the modal for smaller screens
      style={{ maxWidth: 800, width: "100%" }} // Set a maximum width for larger screens
      okText={selectedDorm ? "Update" : "Add"} // Text for the Modal's OK button
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
        initialValues={{
          ...selectedDorm,
          // Using the _id ensures that the correct value is selected in the Select dropdown, as the value of each option in Select corresponds to the _id of the parentUniversity.
          parentUniversity: selectedDorm?.parentUniversity?._id,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Dorm Name" name="name" rules={validationRules["name"]}>
              <Input type="text" placeholder="Enter a dorm name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Dorm Type" name="dormType" rules={validationRules["dormType"]}>
              <Select showSearch placeholder="Select a dorm type" options={dormTypeOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description" name="description" rules={validationRules["description"]}>
          <Input.TextArea
            autoSize={{ minRows: 2 }}
            allowClear
            showCount
            maxLength={250}
            placeholder="Enter a description"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Parent University"
              name="parentUniversity"
              rules={validationRules["parentUniversity"]}
            >
              <Select
                showSearch
                placeholder="Select a parent university"
                optionFilterProp="label"
                options={ParentUniversityOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Rooms Offered"
              name="roomsOffered"
              rules={validationRules["roomsOffered"]}
            >
              <Select
                mode="multiple"
                maxTagCount={"responsive"}
                showSearch
                placeholder="Select rooms available"
                optionFilterProp="label"
                options={roomOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Address" name="address" rules={validationRules["address"]}>
          <Input type="text" />
        </Form.Item>

        <Form.Item
          label="Cover Photos"
          name="coverPhotos"
          rules={[
            {
              required: true,
              validator: (_, value) => customValidateFileList(fileList, value),
            },
          ]}
        >
          <ImageUpload
            fileList={fileList}
            setFileList={setFileList}
            selectedItem={selectedDorm}
            form={form}
            fieldName="coverPhotos"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
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
              <Input
                type="number"
                onInput={(e) => limitInputLengthTo(4, e)}
                placeholder="Enter a year"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Postal Code" name="postalCode" rules={validationRules["postalCode"]}>
              <Select
                showSearch
                options={getAllPostcodeOptions()}
                onChange={(value) => updateCityAndStateInputFieldsFromPostcode(value, form)}
                onInput={(e) => limitInputLengthTo(5, e)}
                onKeyPress={(e) => allowNumbersOnly(e)}
                placeholder="Enter a postal code"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="City" name="city">
              <Input type="text" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="State" name="state">
              <Input type="text" disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
export default DormForm;
