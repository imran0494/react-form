import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import _debounce from 'lodash.debounce';
import { setFormData2, setStep } from '../redux/actions';
import Typography from '@mui/material/Typography';

const Form2 = ({ formData, setFormData2, setStep }) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitted, setSubmitted] = useState(false);  

  const fetchCountries = async (inputValue) => {
    try {
      setLoadingCountries(true);
      const response = await axios.get(`https://restcountries.com/v3.1/name/${inputValue}`);
      const countries = response.data.map((country) => ({
        label: country.name.common,
        value: country.name.common,
      }));
      setCountryOptions(countries);
    } catch (error) {
      console.error('Error fetching country data:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStates = async (selectedCountry) => {
    try {
      setLoadingStates(true);

      // For India, provide dummy state data
      if (selectedCountry === 'India') {
        const indiaStates = [
          { label: 'Maharashtra', value: 'Maharashtra' },
          { label: 'Karnataka', value: 'Karnataka' },
          { label: 'Punjab', value: 'Punjab' },
          // Add more states as needed
        ];
        setStateOptions(indiaStates);
      } else {
        // If a country other than India is selected, clear the state options
        setStateOptions([]);
      }
    } catch (error) {
      console.error('Error fetching state data:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (selectedState) => {
    try {
      setLoadingCities(true);

      // For Punjab (dummy state in India), provide dummy city data
      if (selectedState === 'Punjab') {  
        const maharashtraCities = [
          { label: 'Ludhiana', value: 'Ludhiana' },
          { label: 'Kharar', value: 'Kharar' },
          { label: 'Chandigarh', value: 'Chandigarh' },
        ];
        setCityOptions(maharashtraCities);
      } else {
        setCityOptions([]);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const debouncedFetchCountries = _debounce(fetchCountries, 300);

  const formik = useFormik({
    initialValues: {
      selectedCountry: formData.selectedCountry || '',
      selectedState: formData.selectedState || '',
      selectedCity: formData.selectedCity || '',
      address: formData.address || '',
    },
    validationSchema: Yup.object().shape({
      selectedCountry: Yup.string().required('Please select a country'),
      selectedState: Yup.string().required('Please select a state'),
      selectedCity: Yup.string().required('Please select a city'),
      address: Yup.string().required('Please enter an address'),
    }),
    onSubmit: async (values) => {
      setFormData2(values);
      
      setSubmitted(true);
    },
  });

  useEffect(() => {
    if (formik.values.selectedCountry) {
      fetchStates(formik.values.selectedCountry);
    }
  }, [formik.values.selectedCountry]);

  useEffect(() => {
    if (formik.values.selectedState) {
      fetchCities(formik.values.selectedState);
    }
  }, [formik.values.selectedState]);

  return (
   <div style={{padding:'40px'}}>
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', textAlign: 'center', width:'400px', marginLeft:'510px', padding:'20px' , border:'1px solid black', borderRadius:'10px', }}>
      {submitted ? (
        <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold',  marginTop:'10px' }}>
          Thank You!
        </Typography>
      ) : (
        <form style={{ width: '400px', margin: '20px' }} onSubmit={formik.handleSubmit}>
          <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold' }}>
            Address Details
          </Typography>
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={!!formik.errors.address}
            helperText={formik.errors.address}
            margin="normal"
          />

          <Autocomplete
            id="selectedCountry"
            options={countryOptions}
            getOptionLabel={(option) => option.label}
            value={countryOptions.find((option) => option.value === formik.values.selectedCountry) || null}
            onChange={(_, selectedOption) => {
              formik.setFieldValue('selectedCountry', selectedOption?.value || '');
              fetchStates(selectedOption?.value);
            }}
            onInputChange={(_, inputValue) => debouncedFetchCountries(inputValue)}
            loading={loadingCountries}
            renderInput={(params) => (
              <TextField {...params} label="Country" variant="outlined" fullWidth margin="normal" />
            )}
          />

          <Autocomplete
            id="selectedState"
            options={stateOptions}
            getOptionLabel={(option) => option.label}
            value={
              stateOptions.find((option) => option.value === formik.values.selectedState) || null
            }
            onChange={(_, selectedOption) => {
              formik.setFieldValue('selectedState', selectedOption?.value || '');
              fetchCities(selectedOption?.value);
            }}
            loading={loadingStates}
            renderInput={(params) => (
              <TextField {...params} label="State" variant="outlined" fullWidth margin="normal" />
            )}
          />

          <Autocomplete
            id="selectedCity"
            options={cityOptions}
            getOptionLabel={(option) => option.label}
            value={
              cityOptions.find((option) => option.value === formik.values.selectedCity) || null
            }
            onChange={(_, selectedOption) =>
              formik.setFieldValue('selectedCity', selectedOption?.value || '')
            }
            loading={loadingCities}
            renderInput={(params) => (
              <TextField {...params} label="City" variant="outlined" fullWidth margin="normal" />
            )}
          />

          <Button type="submit" variant="contained" color="primary" style={{ borderRadius: '10px' }}>
            Submit
          </Button>
        </form>
      )}
    </div>
   </div>
  );
};

const mapStateToPropsForm2 = (state) => ({
  formData: state.formData2,
});

const mapDispatchToPropsForm2 = {
  setFormData2,
  setStep,
};

export default connect(mapStateToPropsForm2, mapDispatchToPropsForm2)(Form2);
