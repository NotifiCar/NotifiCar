import * as Types from './types';
import firebaseApp from '../../services/firebase';

export const showDialog = (dialogIsVisible) => dispatch => {
    dispatch({ type: Types.SHOW_DIALOG_FEED, payload: dialogIsVisible });
    dispatch({ type: Types.OCCURRENCE_TYPE_IS_LOADING });
        
    if (dialogIsVisible) {
        firebaseApp.database().ref('/occurrence_types/')
        .on('value', snapshot => {
            dispatch({ type: Types.OCCURRENCE_TYPE_LOAD, payload: snapshot.val() });
            dispatch({ type: Types.OCCURRENCE_TYPE_LOADING_FINISHED });
        });
    }   
};

export const writeVehicle = (vehicle) => ({
    type: Types.WRITE_VEHICLE_FEED,
    payload: vehicle
});

export const updateVehicleError = (error) => ({
    type: Types.UPDATE_VEHICLE_ERROR_FEED,
    payload: error
});

const formatNumberLessTen = (number) => {
    if (number < 10) {
        number = `0${number}`;
    }

    return number;
};

export const addOccurrence = (userID, occurrenceType, vehicle, photo) => (dispatch) => {
    dispatch({
        type: Types.SAVING_OCCURRENCE,
    });

    const date = new Date();
    const year = date.getFullYear();
    const month = formatNumberLessTen(date.getMonth() + 1);
    const day = formatNumberLessTen(date.getDate());
    const dateOccurrence = `${day}/${month}/${year}`;

    let occurrenceTypeKey;
    const occurrencesOfTime = [];
    let lastOccurrenceKey;

    const hour = formatNumberLessTen(date.getHours());
    const minute = formatNumberLessTen(date.getMinutes());
    const time = `${hour}:${minute}`;

    firebaseApp.database().ref(`/occurrences/${year}/${month}/${day}/`)
        .push()
        .set({ 
            userID, 
            vehicle: vehicle.toUpperCase(), 
            occurrence_type: occurrenceType, 
            time, 
            date: dateOccurrence, 
            photo 
        })
        .then(() => dispatch({ type: Types.ADD_OCCURRENCE_SUCCESS }))
        .then(() => {
            firebaseApp.database().ref('/occurrence_types/')
            .orderByChild('type')
            .equalTo(occurrenceType)
            .on('value', (snapshot) => {
                occurrenceTypeKey = Object.keys(snapshot.val())[0];

                firebaseApp.database().ref(`/occurrences/${year}/${month}/${day}/`)
                .orderByChild('time')
                .equalTo(time)
                .on('value', (snapshotOccurrence) => {
                    snapshotOccurrence.forEach((data) => {
                        occurrencesOfTime.push(data.key);
                    });
                    
                    lastOccurrenceKey = occurrencesOfTime.slice(-1)[0];

                    firebaseApp.database().ref(`/occurrence_types/${occurrenceTypeKey}/occurrences`)
                    .child(lastOccurrenceKey)
                    .set(true)
                    .then(() => dispatch({
                        type: Types.ADD_OCCURRENCE_TYPE_COUNT_SUCCESS,
                    }))
                    .catch(error => dispatch({
                        type: Types.ADD_OCCURRENCE_TYPE_COUNT_ERROR,
                        payload: error
                    }));
                });
            });
        })
        .catch(error => dispatch({
            type: Types.ADD_OCCURRENCE_ERROR,
            payload: error
        }));
    
    firebaseApp.database().ref(`/users/${userID}/`)
        .child('occurrencesCount')
        .transaction(occurrencesCount => occurrencesCount + 1);
};

export const changeOccurrenceType = (occurrenceType) => ({
    type: Types.CHANGE_OCCURRENCE_TYPE,
    payload: occurrenceType
});

export const fetchOccurrencesOfTheDay = userID => dispatch => {
    const date = new Date();
    const year = date.getFullYear();
    const month = formatNumberLessTen(date.getMonth() + 1);
    const day = formatNumberLessTen(date.getDate());
    
    dispatch({ type: Types.FETCH_OCCURRENCES_IS_LOADING });

    const vehicles = [];

    firebaseApp.database().ref(`users/${userID}/vehicles`)
        .on('value', snapshot => {
            snapshot.forEach(item => { vehicles.push(item.key); });
        });

    firebaseApp.database().ref(`/occurrences/${year}/${month}/${day}/`)
        .orderByChild('time')
        .limitToLast(10)
        .on('value', snapshot => {
            const occurrences = [];

            snapshot.forEach(item => {
                for (let i = 0; i < vehicles.length; i++) {
                    if (item.val().vehicle === vehicles[i]) {
                        occurrences.push({ key: item.key, occurrence: item.val() });
                    }
                }
            });

            dispatch({
                type: Types.FETCH_OCCURRENCES_OF_THE_DAY,
                payload: occurrences.reverse()
            });
        });
};
