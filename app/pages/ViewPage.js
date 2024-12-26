import React,{useEffect, useState} from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ViewPage = () => {
    const navigation = useNavigation();
    const [latlng, setLatLng] = useState([]); 
    
    useEffect(() => {
        const getAsyncData = async ()=>{
            const getlatlngArr = await AsyncStorage.getItem('latLng');
            if(getlatlngArr){
                const jsonarr = JSON.parse(getlatlngArr)
                
                setLatLng(jsonarr);
            }

        }
        getAsyncData();
    }, []);
  
    return (
        <>
            <View style={styles.maincontainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                               <Text style={{fontWeight:"bold",fontSize:22,color:"#666",width:20 }}>{"<"}</Text>
                        </TouchableOpacity>
                        <Text style={{fontWeight:"bold",fontSize:22,color:"#666" }}>Location History</Text>
                    </View>
                    <View style={styles.container}>

                        <View style={styles.container_row}>
                            <View style={styles.col}>
                                <Text style={{fontWeight:"bold", fontSize:20}}>Sl.NO</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={{fontWeight:"bold", fontSize:20}}>Latitude</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={{fontWeight:"bold", fontSize:20}}>Longitude</Text>
                            </View>
                        </View>
                        

                        {
                            latlng?
                                latlng.map((item,index)=>(
                                    <View style={styles.container_row}>
                                        <View style={styles.col}>
                                            <Text>{index}</Text>
                                        </View>
                                        <View style={styles.col}>
                                            <Text>{item.lat}</Text>
                                        </View>
                                        <View style={styles.col}>
                                            <Text>{item.lng}</Text>
                                        </View>
                                    </View>
                                ))
                            :<></>
                        }

                    </View>
            </View>
        </>
    );
  };
  
  const styles = StyleSheet.create({
    maincontainer:{
        position:"relative",
        width:"100%",
        height:"100%"
    },
    header:{
        marginTop:35,
        position:"fixed",
        display:"flex",
        flexDirection:"row",
        top:0,
        padding:10,
        backgroundColor:"#ADD8E6"
    },
    container : {
        width:"100%",
        height:"100%",
        display:"flex",
        flexDirection:"column",
        alignContent:"center",
        paddingLeft:20,
        paddingRight:20,

    },
    container_row:{
        width:"100%",
        
        display:"flex",
        flexDirection:"row",
        alignContent:"center",
        paddingLeft:20,
        paddingRight:20,
    },
    col:{
        width:"33%",
        alignContent:"center",
        marginTop:6,
        marginBottom:6
    }
  });
  
  export default ViewPage;