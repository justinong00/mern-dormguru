import { Col, DatePicker, Form, Input, message, Modal, Rate, Row, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loadersSlice.js";
import { AddReview } from "../../apis/reviews.js";
import { roomOptions } from "./../../helpers/roomOptions";
import {
  customValidateFromDate,
  customValidateToDate,
  validationRules,
} from "../../helpers/index.js";

function ReviewForm({ dorm, reloadData, showReviewForm, setShowReviewForm }) {
  const [rating, setRating] = useState(null);
  const ratingDescriptions = ["Terrible", "Bad", "Average", "Good", "Excellent"];
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const getRatingDescription = (value) => {
    const roundedValue = Math.ceil(value);
    return ratingDescriptions[roundedValue - 1];
  };

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      const response = await AddReview({
        ...values,
        dorm: dorm._id,
      });
      message.success(response.message);
      setShowReviewForm(false);
      reloadData();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  return (
    <Modal
      open={showReviewForm}
      onCancel={() => setShowReviewForm(false)}
      title="Add Review"
      centered // Center the modal on the screen
      width="90%" // Set the width of the modal for smaller screens
      style={{ maxWidth: 500, width: "100%" }} // Set a maximum width for larger screens
      className="reviewModalStyle"
      okText="Add"
      onOk={() => form.submit()}
    >
      <Form
        layout="vertical"
        className="flex flex-col gap-2"
        onFinish={onFinish}
        form={form}
        initialValues={{
          rating: rating,
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Room/Rooms Stayed"
              name="roomsStayed"
              rules={validationRules["roomsStayed"]}
            >
              <Select
                mode="multiple"
                maxTagCount={"responsive"}
                showSearch
                placeholder="Select room type"
                optionFilterProp="label"
                options={roomOptions.filter((option) => dorm?.roomsOffered.includes(option.value))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="From Date"
              name="fromDate"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
                {
                  validator: (_, value) =>
                    // Custom validator for establishedYear in index.js in helper folder
                    customValidateFromDate(dorm.establishedYear, value),
                },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="To Date"
              name="toDate"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
                {
                  validator: (_, value) =>
                    // Custom validator for establishedYear in index.js in helper folder
                    customValidateToDate(value),
                },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Rating" name="rating" rules={validationRules["rating"]}>
              <div>
                <Rate
                  value={rating}
                  onChange={(value) => {
                    setRating(value);
                    form.setFieldsValue({ rating: value });
                  }}
                />
                {rating ? (
                  <span className="ml-2 text-xs italic">{getRatingDescription(rating)}</span>
                ) : null}
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Title" name="title" rules={validationRules["title"]}>
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Comments" name="comment" rules={validationRules["comment"]}>
              <Input.TextArea
                autoSize={{ minRows: 5 }}
                allowClear
                showCount
                maxLength={250}
                placeholder="Enter your comments here..."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default ReviewForm;
