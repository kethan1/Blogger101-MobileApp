import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    border: {
        borderColor: 'blue',
        borderWidth: 3,
        padding: 10
    },
    header: {
        marginTop: 0, 
        shadowOffset: { width: 100,  height: 100 }, 
        shadowColor: "black", 
        shadowOpacity: 1.0
    },
    oneLineView: {
        flexDirection: 'row', 
        alignItems: 'center'
    }
});