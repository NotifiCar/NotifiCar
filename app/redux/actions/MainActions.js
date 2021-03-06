import firebaseApp from '../../services/firebase';

import * as Types from './types';

export const fetchOccurrencesTypes = () => dispatch => {
    dispatch({ type: Types.FETCH_OCCURRENCES_TYPES });

    firebaseApp.database()
        .ref('/occurrence_types/')
        .orderByChild('type')
        .once('value')
        .then(snapshot => {
            const occurrencesTypes = [{ value: 0, label: 'Selecione um Problema...' }];
            let i = 1;

            snapshot.forEach(item => {
                occurrencesTypes.push({ value: i, label: item.val().type });
                i++;
            });

            dispatch({
                type: Types.FETCH_OCCURRENCES_TYPES_SUCCESS,
                payload: occurrencesTypes
            });
        });
};
