import React, { useState } from 'react';
import { Layout, Steps } from 'antd';
import './App.css';
import Step1 from './Components/Step_1';
import Step2 from './Components/Step_2';
import Step3 from './Components/Step_3';

const { Content } = Layout;
const { Step } = Steps;

const App = () => {

  // Usestate hooks
  const [current, setCurrent] = useState(0);
  const [csvData, setCSVData] = useState();
  const [formData, setFormData] = useState();

  // passed to child as props move to next step
  const onChange = (value) => {
    setCurrent(value);
  };

  // passed to child as props and set csv data
  const updateCSVData = (data) => {
    setCSVData(data);
  }

  // passed to child as props and set form data
  const updateFormData = (data) => {
    setFormData(data);
  }

  return (
    <div className="App">
      <Content style={{ padding: '50px 50px' }}>
        <div className="site-layout-content">
          <Steps current={current} onChange={onChange}>
            <Step title="Step 1" disabled={current === 0 ? false : true} />
            <Step title="Add Details" disabled={current === 1 ? false : true} />
            <Step title="Add Images" disabled={current === 2 ? false : true} />
          </Steps>
          <div className="steps-content">
            {current === 0 ?
              <Step1 onStepChange={onChange}
                current={current}
                updateCSVData={updateCSVData} />
              : current === 1 ?
                <Step2 onStepChange={onChange}
                  current={current}
                  formData={csvData && csvData}
                  updateFormData={updateFormData} />
                : current === 2 ?
                  <Step3 formData={formData} /> : ""}
          </div>
        </div>
      </Content>
    </div>
  );
}

export default App;
