import React, { useState } from 'react';
import { Row, Col, Button, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, } from '@ant-design/icons';

import './style.css';
import FileUploadService from '../../Services/fileUploadService';

const Step1 = ({ onStepChange, current, updateCSVData }) => {

    // handle file upload(except only csv file)
    const handleFileUpload = (e) => {
        if (e) {
            const file_extension = e.type;
            if (file_extension === "text/csv") {

                // instance of file upload service
                const fileUploadService = new FileUploadService();

                // set response returned from bulk upload if its success or show error message
                fileUploadService.bulkUpload(e, (response) => {
                    if (response && response.isError) {
                        message.error(response.message);
                    } else {
                        message.success("File uploaded successfully");
                        updateCSVData((response && response[0]) || [])
                        onStepChange(current + 1);
                    }
                });
            } else {
                message.error("Please upload valid file. Only CSV file allowed.");
            }
        }
    };

    return (
        <div className='step_1_container'>
            <Row className="step_1_rowStyle">
                <Col className='colStyle' span={24}>
                    <Button type="primary" icon={<PlusOutlined />} size="large"
                        onClick={() => onStepChange(current + 1)} >Add Manually</Button>
                    <Upload
                        accept=".csv"
                        showUploadList={false}
                        beforeUpload={file => handleFileUpload(file)}>
                        <Button type="primary" icon={<UploadOutlined />} size="large" style={{ marginLeft: "10px" }}>Upload CSV</Button>
                    </Upload>
                </Col>
            </Row>
        </div>
    )
}

export default Step1;