import { Col, DatePicker, Form, Input, message, Modal, Rate, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loadersSlice.js";
import { AddReview, UpdateReview } from "../../apis/reviews.js";
import { roomOptions } from "./../../helpers/roomOptions";
import { validateDates, validationRules } from "../../helpers/index.js";
import dayjs from "dayjs";

function ReviewForm({
  dorm,
  reloadData,
  showReviewForm,
  setShowReviewForm,
  selectedReview = null,
}) {
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
      let response;

      if (selectedReview) {
        response = await UpdateReview(selectedReview._id, {
          ...values,
          dorm: dorm._id,
        });
      } else {
        response = await AddReview({
          ...values,
          dorm: dorm._id,
        });
      }
      reloadData();
      message.success(response.message);
      setShowReviewForm(false);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // The rating must be handled outside the initialValues because the Rate component does not directly bind its value to the form's initial values. Instead, it requires state management to control its value. Hence, useEffect is used to set initial rating value when a review is selected
  useEffect(() => {
    if (selectedReview) {
      // Set the initial rating value from the selected review
      setRating(selectedReview.rating);
      console.log(dorm);
    }
  }, [selectedReview]);

  return (
    <Modal
      open={showReviewForm}
      onCancel={() => setShowReviewForm(false)}
      title={selectedReview ? "Update Review" : "Add Review"}
      centered // Center the modal on the screen
      width="90%" // Set the width of the modal for smaller screens
      style={{ maxWidth: 500, width: "100%" }} // Set a maximum width for larger screens
      className="reviewModalStyle"
      okText={selectedReview ? "Update" : "Add"}
      onOk={() => form.submit()}
    >
      <Form
        layout="vertical"
        className="flex flex-col gap-2"
        onFinish={onFinish}
        form={form}
        initialValues={{
          ...selectedReview,
          // Convert fromDate and toDate to dayjs objects if they exist in the selected review. This is necessary for preloading the Antd DatePicker components with the correct values in the form
          fromDate: selectedReview?.fromDate ? dayjs(selectedReview.fromDate) : null,
          toDate: selectedReview?.toDate ? dayjs(selectedReview.toDate) : null,
          rating: selectedReview?.rating, // Rating is initialized from the state
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
                options={roomOptions.filter((option) => dorm?.roomsOffered?.includes(option.value))}
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
                  validator: (_, value) => validateDates("fromDate", value, form, dorm),
                },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                onChange={(date) => {
                  form.setFieldsValue({ fromDate: date });
                  // Trigger validation of the toDate field when the fromDate field is changed
                  form.validateFields(["toDate"]);
                }}
              />
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
                  validator: (_, value) => validateDates("toDate", value, form, dorm),
                },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                onChange={(date) => {
                  form.setFieldsValue({ toDate: date });
                  // Trigger validation of the fromDate field when the toDate field is changed
                  form.validateFields(["fromDate"]);
                }}
              />
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
                    setRating(value); // Update state with new rating value
                    form.setFieldsValue({ rating: value }); // Update form field value
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
            <Form.Item label="Comment" name="comment" rules={validationRules["comment"]}>
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
