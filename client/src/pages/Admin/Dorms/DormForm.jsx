import { Button, Form, Input, Select, Tabs, Upload } from "antd";
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

function DormForm() {
  const [ParentUniversityOptions, setParentUniversityOptions] = useState([]);
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list
  const [selectedDorm, setSelectedDorm] = useState(null);

  useEffect(() => {
    const fetchParentUniversityOptions = async () => {
      try {
        const response = await GetAllUnis();
        setParentUniversityOptions(response.data);
      } catch (error) {
        console.error("Error fetching Parent Universities:", error);
      }
    };

    fetchParentUniversityOptions();
  }, []);

  const dormTypeOptions = [
    {
      value: "onCampus",
      label: "On-Campus Accommodation",
    },
    {
      value: "offCampus",
      label: "Off-Campus Accommodation",
    },
  ];

  const roomsOfferedOptions = [
    {
      value: "master-premium-twin-sharing",
      label: "Master Premium with attached bathroom - Twin Sharing",
    },
    {
      value: "master-premium-single",
      label: "Master Premium with attached bathroom - Single Occupant",
    },
    {
      value: "medium-premium-twin-sharing",
      label: "Medium Premium Twin with common bathroom - Twin Sharing",
    },
    {
      value: "medium-premium-single",
      label: "Medium Premium Single with common bathroom - Single Occupant",
    },
    {
      value: "small-single",
      label: "Small Single with common bathroom - Single Occupant",
    },
  ];

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
              <Form layout="vertical" className="flex flex-col gap-5" form={form}>
                <div className="grid grid-cols-2 gap-5">
                  <Form.Item label="Dorm Name" name="name" rules={validationRules["name"]}>
                    <Input type="text" />
                  </Form.Item>

                  <Form.Item label="Dorm Type" name="dormType" rules={validationRules["dormType"]}>
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
                  <Input.TextArea rows={4} showCount maxLength={250} />
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
                      // onChange={onChange}
                      // onSearch={onSearch}
                      options={ParentUniversityOptions.map((university) => ({
                        value: university.name,
                        label: university.name,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item label="Rooms Offered" name="roomsOffered" rules={antValidationError}>
                    <Select
                      className="h-[45px]"
                      mode="multiple"
                      showSearch
                      placeholder="Select rooms available"
                      optionFilterProp="label"
                      // onChange={onChange}
                      // onSearch={onSearch}
                      options={roomsOfferedOptions}
                    />
                  </Form.Item>
                </div>

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
                    // fileList prop is used to display the list of uploaded files. If selectedDorm has a logoPic URL, it creates a fileList with that URL. Otherwise, it uses the fileList state
                    fileList={selectedDorm?.logoPic ? [{ url: selectedDorm.logoPic }] : fileList}
                    // onChange prop is a function that handles changes in the fileList. It receives an object with the new fileList and the file that triggered the change
                    onChange={({ fileList: newFileList, file }) => {
                      // Handle file removal
                      if (file.status === "removed") {
                        setFileList([]);
                        if (selectedDorm?.logoPic) {
                          selectedDorm.logoPic = ""; // If selectedDorm has a logoPic URL, remove it from the selectedDorm statee
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
                    {/* If selectedDorm doesn't have a logoPic URL and the fileList is empty, render a Button component with an UploadOutlined icon */}
                    {!selectedDorm?.logoPic && fileList.length === 0 && (
                      <Button block icon={<UploadOutlined />}>
                        Click to Upload
                      </Button>
                    )}
                  </Upload>
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
