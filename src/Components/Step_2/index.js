import React, { useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { usePlacesWidget } from "react-google-autocomplete";

import './style.css';

const Step2 = ({ onStepChange, current, formData, updateFormData }) => {
    const [form] = Form.useForm();
    const antInputRef = useRef(null);

    useEffect(() => {
        if (formData) {
            // convert array into object and set form values
            let mapped = formData.map(item => ({ [item.Attribute.toLowerCase()]: item.Value }));
            let newFormData = Object.assign({}, ...mapped);
            form.setFieldsValue(newFormData)
        }
    }, [formData])

    // handle form submit event and pass data to next step
    const handleFormSubmit = () => {
        let formData = {
            address: form.getFieldValue("address"),
            bedroom: form.getFieldValue("bedroom"),
            bathroom: form.getFieldValue("bathroom"),
            description: form.getFieldValue("description")
        }
        updateFormData(formData);
        onStepChange(current + 1);
    }

    // used for google place api 
    const { ref: antRef } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GOOGLE,
        onPlaceSelected: (place) => {
            //@ts-ignore
            antInputRef.current.setValue(place?.formatted_address);
        },
    });

    return (
        <div className='formContainer'>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}>
                <Form.Item name="address" label="Address" rules={[
                    { required: true, message: "Please enter address" },
                ]}>
                    <Input
                        ref={(c) => {
                            antInputRef.current = c;
                            if (c) antRef.current = c.input;
                        }}
                        size="large"
                    />
                </Form.Item>
                <Form.Item name="bedroom" label="Bedroom" rules={[
                    { required: true, message: "Please enter bedroom size" },
                    { pattern: new RegExp(/^[0-9]+$/), message: "Only numbers are allowed! Range must me between 0 to 10" }
                ]}>
                    <Input placeholder="Enter the size of bedroom"
                        style={{
                            width: '100%',
                        }}
                        maxLength={10}
                        size="large" />
                </Form.Item>
                <Form.Item name="bathroom" label="Bathroom" rules={[
                    { required: true, message: "Please enter bathroom size" },
                    { pattern: new RegExp(/^[0-9]+$/), message: "Only numbers are allowed!" }
                ]}>
                    <Input placeholder="input placeholder"
                        style={{
                            width: '100%',
                        }}
                        maxLength={5}
                        size="large" />
                </Form.Item>
                <Form.Item name="description" label="Description of Property">
                    <Input.TextArea maxLength={100} size="large" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Step2;