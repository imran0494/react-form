import React from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { setFormData1, setStep } from '../redux/actions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Form1 = ({ formData1, setFormData1, setStep }) => {
  const [name, setName] = React.useState('');
  const [dob, setDOB] = React.useState('');
  const [selectedSex, setSelectedSex] = React.useState('');
  const [govtIDType, setGovtIDType] = React.useState('');
  const [govtID, setGovtID] = React.useState('');

  const [errors, setErrors] = React.useState({});

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    dob: Yup.string()
      .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, 'Invalid date format. Please use DD-MM-YYYY.')
      .required('Date of Birth is required'),
    selectedSex: Yup.string().required('Please select a sex.'),
    govtIDType: Yup.string().required('Please select a government-issued ID type.'),
    govtID: Yup.string()
      .when('govtIDType', {
        is: 'aadhar',
        then: Yup.string().matches(/^[2-9]\d{11}$/, 'Invalid Aadhar number. It should have 12 numeric digits and should not start with 0 or 1.'),
        otherwise: Yup.string().matches(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/, 'Invalid PAN number. It should be a ten-character long alpha-numeric string.'),
      })
      .required('Please enter a valid government-issued ID.'),
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setErrors({ ...errors, [name]: undefined });
    if (name === 'name') {
      setName(value);
    } else if (name === 'dob') {
      setDOB(value);
    } else if (name === 'selectedSex') {
      setSelectedSex(value);
    } else if (name === 'govtIDType') {
      setGovtIDType(value);
      setGovtID('');
    } else if (name === 'govtID') {
      setGovtID(value);
    }
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(
        {
          name,
          dob,
          selectedSex,
          govtIDType,
          govtID,
        },
        { abortEarly: false }
      );
      setFormData1({
        name,
        dob,
        selectedSex,
        govtIDType,
        govtID,
      });
      setStep(2); // Move to the next step (Form2)
    } catch (validationErrors) {
      const errorsMap = {};
      validationErrors.inner.forEach((error) => {
        errorsMap[error.path] = error.message;
      });
      setErrors(errorsMap);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', padding: '40px' }}>
      <div style={{ textAlign: 'center', padding: '10px', marginLeft: '500px', fontFamily: 'Times New Roman', border: '2px solid black', height: '80ssvh', width: '400px', borderRadius: '10px', color: 'white', backdropFilter: 'blur(0px)' }}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold', marginTop: '20px', color:'black' }}>
          Personal Details
        </Typography>

        <form style={{ width: '300px', margin: 'auto' }}>
          <Box marginBottom="15px">
            
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{ style: { color: 'black' } }}
              />
            
          </Box>

          <Box marginBottom="15px">
            
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                id="dob"
                name="dob"
                value={dob}
                onChange={handleInputChange}
                placeholder="DD-MM-YYYY"
                error={!!errors.dob}
                helperText={errors.dob}
                InputProps={{ style: { color: 'black' } }}
              />
            
          </Box>

          <InputLabel htmlFor="selectedSex">Select Sex:</InputLabel>
          <Select
            variant="outlined"
            fullWidth
            id="selectedSex"
            name="selectedSex"
            value={selectedSex}
            onChange={handleInputChange}
            error={!!errors.selectedSex}
            displayEmpty
            style={{ marginBottom: '15px'}}
          >
            <MenuItem value="" disabled>Select</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          {errors.selectedSex && <p style={{ color: 'red', marginBottom: '15px' }}>{errors.selectedSex}</p>}

          <InputLabel htmlFor="govtIDType">Govt Issue ID Type:</InputLabel>
          <Select
            variant="outlined"
            fullWidth
            id="govtIDType"
            name="govtIDType"
            value={govtIDType}
            onChange={handleInputChange}
            error={!!errors.govtIDType}
            displayEmpty
            style={{ marginBottom: '15px',}}
          >
            <MenuItem value="" disabled>Select</MenuItem>
            <MenuItem value="aadhar">Aadhar</MenuItem>
            <MenuItem value="pan">PAN</MenuItem>
          </Select>
          {errors.govtIDType && <p style={{ color: 'red', marginBottom: '15px' }}>{errors.govtIDType}</p>}

          {govtIDType && (
            <Box marginBottom="15px">
              
                <TextField
                  label={`Enter ${govtIDType.toUpperCase()} Number`}
                  variant="outlined"
                  fullWidth
                  id="govtID"
                  name="govtID"
                  value={govtID}
                  onChange={handleInputChange}
                  error={!!errors.govtID}
                  helperText={errors.govtID}
                  InputProps={{ style: { color: 'black' } }}
                />
            
            </Box>
          )}

          <Button type="button" variant="contained" color="primary" onClick={handleSubmit} style={{ borderRadius: '10px' }}>
            Next
          </Button>
        </form>
      </div>
    </div>
  );
};

const mapStateToPropsForm1 = (state) => ({
  formData1: state.formData1,
});

const mapDispatchToPropsForm1 = {
  setFormData1,
  setStep,
};

export default connect(mapStateToPropsForm1, mapDispatchToPropsForm1)(Form1);
