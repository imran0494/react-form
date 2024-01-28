// redux/actions.js
export const setFormData1 = (data) => ({
  type: 'SET_FORM_DATA_1',
  payload: data,
});

export const setFormData2 = (data) => ({
  type: 'SET_FORM_DATA_2',
  payload: data,
});

export const setStep = (step) => ({
  type: 'SET_STEP',
  payload: step,
});
