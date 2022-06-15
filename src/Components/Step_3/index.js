import React, { useState } from 'react';
import { Upload, Form, Button, Checkbox, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import './style.css';

const Step3 = ({ formData }) => {
    const [form] = Form.useForm();

    // useState hooks
    const [fileList, setFileList] = useState([]);
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [selectedFeaturedImage, setSelectedFeaturedImage] = useState("");

    // handle image upload
    const handleChange = async (info) => {
        setFileList(info.fileList)
        if (info.file.status === "error") {
            setThumbnailFileList([...thumbnailFileList, { id: thumbnailFileList.length + 1, url: URL.createObjectURL(info.file.originFileObj) }]);
        } else if (info.file.status === "done") {
            setThumbnailFileList([...thumbnailFileList, { id: thumbnailFileList.length + 1, url: URL.createObjectURL(info.file.originFileObj) }]);
        }
    };

    // create upload button
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const handleCheck = (id) => {
        setSelectedFeaturedImage(id)
    }

    // handle form submit and console data
    const handleFormSubmit = () => {
        const params = {
            ...formData,
            ...fileList,
            featuredImage: selectedFeaturedImage
        }
        console.log("Form Data: ", params);
    }

    return (
        <div className='pictureWall'>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}>

                <Form.Item name='image' label="Images"
                    rules={[
                        { required: true, message: "Please upload an image" },
                    ]}>
                    <Upload
                        accept='image/png, image/jpeg, image/svg, image/gif'
                        listType="picture-card"
                        fileList={fileList}
                        // onPreview={handlePreview}
                        onChange={handleChange}
                        showUploadList={false}
                        disabled={fileList.length >= 4 && "none"}
                    >{uploadButton}
                    </Upload>
                </Form.Item>

                <div style={{ display: "flex" }}>
                    {thumbnailFileList.length > 0 &&
                        thumbnailFileList.map((item) => {
                            return (
                                <Card
                                    hoverable
                                    style={{
                                        width: 240,
                                        margin: "10px"
                                    }}
                                    cover={<img alt="example" style={{ width: "100%", height: "200px" }} src={item.url} />}
                                    key={item.id}
                                >
                                    <Checkbox checked={item.id === selectedFeaturedImage} onChange={() => handleCheck(item.id)}>Featured Image</Checkbox>
                                </Card>
                            )
                        })
                    }
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Step3;