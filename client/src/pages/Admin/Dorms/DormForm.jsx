import { Button, Form, Input, Select, Tabs, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  allowNumbersOnly,
  antValidationError,
  customValidateEstablishedYear,
  customValidateFileList,
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
import { AddDorm, GetDormById } from "../../../apis/dorms.js";
import { setLoading } from "../../../redux/loadersSlice.js";
import { AddImage } from "../../../apis/images.js";
import { useNavigate, useParams } from "react-router-dom";

function DormForm() {
  const dispatch = useDispatch(); // Redux dispatch function
  const [ParentUniversityOptions, setParentUniversityOptions] = useState([]); // State to store university options
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list
  const [selectedDorm, setSelectedDorm] = useState(null); // State to store selected dorm data (if editing)
  const navigate = useNavigate(); // Hook to navigate programmatically
  const params = useParams();

  // Options for dorm types
  const dormTypeOptions = [
    {
      value: "On-Campus Accommodation",
      label: "On-Campus Accommodation",
    },
    {
      value: "Off-Campus Accommodation",
      label: "Off-Campus Accommodation",
    },
  ];

  // Options for types of rooms offered
  const roomsOfferedOptions = [
    {
      value: "master-twin-sharing",
      label: "Master - Twin Sharing",
    },
    {
      value: "master-single",
      label: "Master - Single Occupant",
    },
    {
      value: "medium-twin-sharing",
      label: "Medium - Twin Sharing",
    },
    {
      value: "medium-single",
      label: "Medium - Single Occupant",
    },
    {
      value: "small-single",
      label: "Small - Single Occupant",
    },
  ];

  // Function to fetch university options from the backend
  const fetchParentUniversityOptions = async () => {
    try {
      const response = await GetAllUnis();
      setParentUniversityOptions(
        response.data.map((uni) => ({
          value: uni._id,
          label: uni.name,
        }))
      );
      console.log("Parent universities:", response.data);
    } catch (error) {
      console.error("Error fetching Parent Universities:", error);
    }
  };

  const fetchSelectedDorm = async (dormId) => {
    try {
      dispatch(setLoading(true));
      const response = await GetDormById(dormId);
      setSelectedDorm(response.data);
      console.log("Selected dorm:", response.data);
    } catch (error) {
      console.error("Error fetching selected dorm:", error);
      message.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch university options when the component mounts
  useEffect(() => {
    fetchParentUniversityOptions();
    if (params?.id) {
      // Update Dorm
      fetchSelectedDorm(params.id);
    }
  }, [params?.id]);

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
      }
      const response = await AddDorm(values); // Submit the dorm data
      message.success(response.message);
      console.log(values);
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
    // (selectedDorm || !params.id) is being used as a condition to prevent the form from rendering prematurely before the required data is available, especially when editing an existing dorm.
    (selectedDorm || !params.id) && (
      <>
        <div>
          <h1 className="text-gray-600 text-xl font-semibold">
            {selectedDorm ? "Update Dorm" : "Add Dorm"}
          </h1>
        </div>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Details",
              children: (
                <Form
                  layout="vertical"
                  className="flex flex-col gap-5"
                  form={form}
                  onFinish={onFinish}
                  initialValues={{
                    ...selectedDorm,
                    // Using the _id ensures that the correct value is selected in the Select dropdown, as the value of each option in Select corresponds to the _id of the parentUniversity.
                    parentUniversity: selectedDorm?.parentUniversity?._id,
                  }}
                >
                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item label="Dorm Name" name="name" rules={validationRules["name"]}>
                      <Input type="text" placeholder="Enter a dorm name" />
                    </Form.Item>

                    <Form.Item
                      label="Dorm Type"
                      name="dormType"
                      rules={validationRules["dormType"]}
                    >
                      <Select
                        className="h-[45px]"
                        showSearch
                        placeholder="Select a dorm type"
                        options={dormTypeOptions}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label="Description"
                    name="description"
                    rules={validationRules["description"]}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 2 }}
                      allowClear
                      showCount
                      maxLength={250}
                      placeholder="Enter a description"
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item
                      label="Parent University"
                      name="parentUniversity"
                      rules={antValidationError}
                    >
                      <Select
                        className="h-[45px]"
                        showSearch
                        placeholder="Select a parent university"
                        optionFilterProp="label"
                        options={ParentUniversityOptions}
                      />
                    </Form.Item>

                    <Form.Item label="Rooms Offered" name="roomsOffered" rules={antValidationError}>
                      <Select
                        className="h-[45px]"
                        mode="multiple"
                        maxTagCount={"responsive"}
                        showSearch
                        placeholder="Select rooms available"
                        optionFilterProp="label"
                        options={roomsOfferedOptions}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label="Address" name="address" rules={validationRules["address"]}>
                    <Input type="text" />
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
                      <Input
                        type="number"
                        onInput={(e) => limitInputLengthTo(4, e)}
                        placeholder="Enter a year"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Postal Code"
                      name="postalCode"
                      rules={validationRules["postalCode"]}
                    >
                      <Select
                        className="h-[45px]"
                        showSearch
                        options={getAllPostcodeOptions()}
                        onChange={(value) => updateCityAndStateInputFieldsFromPostcode(value, form)}
                        onInput={(e) => limitInputLengthTo(5, e)}
                        onKeyPress={(e) => allowNumbersOnly(e)}
                        placeholder="Enter a postal code"
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

                  <Form.Item
                    label="Cover Photos"
                    name="coverPhotos"
                    rules={[
                      {
                        required: true,
                        // Custom validator to check if fileList is not empty from index.js in helper folder
                        validator: (_, value) => customValidateFileList(fileList, selectedDorm),
                      },
                    ]}
                  >
                    <Upload
                      // fileList prop is used to display the list of uploaded files. If selectedDorm has a coverPhotos URL, it creates a fileList with that URL. Otherwise, it uses the fileList state
                      fileList={
                        selectedDorm?.coverPhotos ? [{ url: selectedDorm.coverPhotos }] : fileList
                      }
                      // onChange prop is a function that handles changes in the fileList. It receives an object with the new fileList and the file that triggered the change
                      onChange={({ fileList: newFileList, file }) => {
                        // Handle file removal
                        if (file.status === "removed") {
                          setFileList([]);
                          if (selectedDorm?.coverPhotos) {
                            selectedDorm.coverPhotos = ""; // If selectedDorm has a coverPhotos URL, remove it from the selectedDorm state
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
                      {/* If selectedDorm doesn't have a coverPhotos URL and the fileList is empty, render a Button component with an UploadOutlined icon */}
                      {!selectedDorm?.coverPhotos && fileList.length === 0 && (
                        <Button block icon={<UploadOutlined />}>
                          Click to Upload
                        </Button>
                      )}
                    </Upload>
                  </Form.Item>

                  <div className="flex justify-end gap-5">
                    <Button onClick={() => navigate("/admin")}>Cancel</Button>
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
    )
  );
}

export default DormForm;
