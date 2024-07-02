import React, { useState, useEffect } from "react";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64, isJpgOrPng, isLt2MB } from "../helpers/imageHelper.js";

/** Custom validation function for file list.
 *
 * @param {Array} fileList - The list of files to be validated.
 * @returns {Promise} - A promise that resolves if the file list is not empty,
 *                      and rejects with the error message "Required" if it is empty.
 */
export const customValidateFileList = (fileList, value) => {
  // Log the length of the file list
  console.log("InHelper: ", fileList.length);
  // Handle when user in Edit state and does not update existing image but other fields
  if (value) {
    return Promise.resolve();
  }
  // Check if the file list is empty
  if (fileList.length === 0) {
    // If the file list is empty, reject the promise with the error message "Required"
    return Promise.reject("Required");
  }
  // If the file list is not empty, resolve the promise
  return Promise.resolve();
};

const ImageUpload = ({ fileList, setFileList, selectedItem, form, fieldName }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileListUpdated, setFileListUpdated] = useState(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList, file }) => {
    if (file.status === "removed") {
      setFileList([]);
      if (selectedItem?.[fieldName]) {
        selectedItem[fieldName] = "";
      }
    } else {
      if (!isJpgOrPng(file) || !isLt2MB(file)) {
        return;
      }
      setFileList(newFileList);
      setFileListUpdated(true); // Mark fileList as updated
    }
  };

  // This useEffect hook addresses the issue where the `fileList.length` would always be 0 even after uploading an image, which caused the `customValidateFileList` helper function to always log the "Required" message after re-uploading a new image. The `fileListUpdated` state is used as a flag to determine when the file list has been updated and the validation needs to be triggered.
  useEffect(() => {
    // If the `fileListUpdated` state is true, it means that the file list has been updated (e.g., a new file has been uploaded or an existing file has been removed).
    if (fileListUpdated) {
      // This is necessary because the `customValidateFileList` helper function checks if the file list is empty or not. By triggering the validation, the `customValidateFileList` function will be called with the updated file list.
      form.validateFields([fieldName]);

      // Reset the `fileListUpdated` state to false after triggering the validation.This is done to prevent the validation from being triggered again unnecessarily until the file list is updated again.
      setFileListUpdated(false);
    }
  }, [fileListUpdated, form, fieldName]);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        fileList={selectedItem?.[fieldName] ? [{ url: selectedItem[fieldName] }] : fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        listType="picture-card"
        onPreview={handlePreview}
      >
        {!selectedItem?.[fieldName] && fileList.length === 0 && uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUpload;
