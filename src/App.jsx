// App.jsx
import React from 'react';
import { connect } from 'react-redux';
import Form1 from './components/form1';
import Form2 from './components/form2';
import { setFormData1, setFormData2, setStep } from './redux/actions';
import backgroundImage from './b1.png'; 

const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
};

const App = ({ formData1, formData2, step, setFormData1, setFormData2, setStep }) => {
  const handleStepSubmit = (data) => {
    if (step === 1) {
      setFormData1(data);
      setStep(2);
    } else if (step === 2) {
      setFormData2(data);
      console.log('Complete Form Data:', { ...formData1, ...data });
    }
  };

  return (
    <div style={backgroundStyle}>
      {step === 1 && <Form1 onStepSubmit={handleStepSubmit} />}
      {step === 2 && <Form2 onStepSubmit={handleStepSubmit} formData={formData2} />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  formData1: state.formData1,
  formData2: state.formData2,
  step: state.step,
});

const mapDispatchToProps = {
  setFormData1,
  setFormData2,
  setStep,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
