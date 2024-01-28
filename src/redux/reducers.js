// redux/reducers.js
const initialState = {
  formData1: {},
  formData2: {},
  step: 1,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FORM_DATA_1':
      return { ...state, formData1: action.payload };
    case 'SET_FORM_DATA_2':
      return { ...state, formData2: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
