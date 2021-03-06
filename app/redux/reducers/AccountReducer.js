import * as Types from '../actions/types';

const INITIAL_STATE = {
    vehicles: {},
    error: '',
    isSavingVehicle: false,
    isLoadingListOfVehicles: false,
};

const AccountReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.ADD_VEHICLE_SUCCESS:
            return {
                ...state,
                isSavingVehicle: false,
            };
        case Types.ADD_VEHICLE_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case Types.FETCH_USER_VEHICLES:
            return {
                ...state,
                vehicles: action.payload,
                isLoadingListOfVehicles: false
            };
        case Types.SAVING_VEHICLE:
            return {
                ...state,
                isSavingVehicle: true,
            };
        case Types.FETCH_VEHICLES_IS_LOADING:
            return {
                ...state,
                isLoadingListOfVehicles: true
            };
        default:
            return state;
    }
};

export default AccountReducer;
