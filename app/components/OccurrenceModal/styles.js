import { 
    StyleSheet, 
    Platform,
    PixelRatio 
} from 'react-native';

import { Colors, Values } from '../../commom';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        padding: 15,
    },
    inputField: {
        width: '80%',
        fontSize: 0.120 * Values.SCREEN_WIDTH,
        alignSelf: 'center',
        textAlign: 'center',
        ...Platform.select({
            ios: {
                borderBottomWidth: 1,
                borderBottomColor: Colors.BLACK,
            }
        })
    },
    title: {
        fontSize: 0.07 * Values.SCREEN_WIDTH,
        alignSelf: 'center',
    },
    type_occurrence: {
        fontSize: 0.04 * Values.SCREEN_WIDTH,
        alignSelf: 'center',
        color: Colors.BLACK,
    },
    picker: {
        marginVertical: 10,
    },
    error: {
        color: Colors.RED,
        alignSelf: 'flex-start',
    },
    photoContainer: {
        borderColor: Colors.GRAY,
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    photo: {
        borderRadius: 75,
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
    photoText: {
        color: Colors.BLACK,
        alignSelf: 'center',
    },
    optional: {
        color: Colors.RED,
        alignSelf: 'center',
    },
});

export default styles;
