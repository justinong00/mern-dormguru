import { message } from "antd";

// Function to get Base64 of an image file
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Function to validate file type
export const isJpgOrPng = (file) => {
  const isValidType = file.type === "image/jpeg" || file.type === "image/png";
  if (!isValidType) {
    message.error("You can only upload PNG, JPEG, and JPG files");
  }
  return isValidType;
};

// Function to validate file size
export const isLt2MB = (file) => {
  const isValidSize = file.size / 1024 / 1024 < 2;
  if (!isValidSize) {
    message.error("File must be smaller than 2MB");
  }
  return isValidSize;
};
