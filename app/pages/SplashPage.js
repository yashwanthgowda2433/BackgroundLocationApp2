import React,{useEffect} from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';


const SplashPage = () => {
    const navigation = useNavigation();

    useEffect(() => {
      const checkUser = async () => {
          navigation.navigate('Home'); 
      };
  
      const timer = setTimeout(checkUser, 2000);
  
      return () => {clearTimeout(timer);} // Cleanup timer on unmount

    }, [navigation]);
  
    return (
      <View style={styles.container}>

        <View style={styles.logo}><Text style={styles.logoText}>RealTime Location Fetch</Text></View>
        
        <View style={styles.loadingContainer}>
           <Text>Loading...</Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      width:"100%",
      height:"100%",
      color:"#fff",
      flex: 1,
      backgroundColor:'#fff',
      justifyContent: 'center',
      position:'relative',
      alignItems: 'center',
    },
    logo:{
        color:"#888",
        fontSize:25,
        fontWeight:"bold"
    },
    logoText:{
      fontSize:28,
      fontWeight:"bold",
      color:"#ADD8E6"
    },
    loadingContainer:{
      position:'absolute',
      bottom:0,
      margin:20
    }
  });
  
  export default SplashPage;