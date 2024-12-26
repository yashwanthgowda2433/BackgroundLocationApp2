import React,{useState, useEffect} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Location from "expo-location";
import * as TaskManager from 'expo-task-manager';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log('Background location:', locations);
  }
});

const HomePage = ()=>{
    const navigation = useNavigation();
    const [show, setShow] = useState(true);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [latlng, setLatLng] = useState([]); 
    const [location, setLocation] = useState(null);

    const [isTracking, setIsTracking] = useState(false);


    useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
          }
    
          const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
          if (backgroundStatus.status !== 'granted') {
            console.error('Permission to access background location was denied');
          }
        })();
      }, []);
    
      const startLocationUpdates = async () => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (!hasStarted) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000, // Get location every 10 seconds
            distanceInterval: 50, // Get location when the user moves 50 meters
            foregroundService: {
              notificationTitle: 'Location Tracking',
              notificationBody: 'We are tracking your location in the background.',
            },
          });
          setIsTracking(true);
        }
      };
    
      const stopLocationUpdates = async () => {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        setIsTracking(false);
      };
    
      const getLocation = async () => {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      };
      

    const startForegroundService = async () => {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Foreground location access is required.");
          return;
        }
  
        // Start location updates
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 1, // Update every 50 meters
          },
          (newLocation) => {
            console.log("Updated Location:", newLocation.coords);
            setLocation(newLocation.coords);
            setLatLng((prev) => [...prev , {lat:newLocation.coords.latitude, lng:newLocation.coords.longitude}]);
            // const id = setInterval(() => {
            //     setTimer((prev) => prev + 1);
            // }, 1000);
            // setIntervalId(id);
          }
        );
      };
    useEffect(() => {

        const getAsyncData = async ()=>{
            const getlatlngArr = await AsyncStorage.getItem('latLng');
            if(getlatlngArr){
                setLatLng(JSON.parse(getlatlngArr));
            }

        }
        getAsyncData();
        return async() => {
          // Stop location updates when the component unmounts
          Location.hasStartedLocationUpdatesAsync().then(async(started) => {
            if (started) {
              Location.stopLocationUpdatesAsync();
              await AsyncStorage.setItem('latLng', JSON.stringify(latlng));
            }
          });
        await AsyncStorage.setItem('latLng', JSON.stringify(latlng));

        };
      }, []);

    // Function to format time as hh:mm:ss
    const formatTime = (seconds) => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    function startTimer() {
        const id = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
        startForegroundService();
    }

    const endTimer = async() =>{
        clearInterval(intervalId);
        setIntervalId(null);
        setTimer(0);
        Location.hasStartedLocationUpdatesAsync().then(async(started) => {
            if (started) {
              Location.stopLocationUpdatesAsync();
              await AsyncStorage.setItem('latLng', JSON.stringify(latlng));

            }
        });
        await AsyncStorage.setItem('latLng', JSON.stringify(latlng));

        console.log(latlng)
    }

    return (
        <>
            <View style={styles.maincontainer}>
                <View style={styles.header}>
                    <Text style={{fontWeight:"bold",fontSize:22,color:"#666" }}>Home</Text>
                </View>
                <View style={styles.container}>
                  {show?
                    <TouchableOpacity onPress={()=>{setShow(!show);startTimer();startLocationUpdates }} style={styles.start}>
                        <Text style={{color:"#fff"}}> Start</Text>
                    </TouchableOpacity>
                  :
                    <TouchableOpacity onPress={()=>{setShow(!show); endTimer(); stopLocationUpdates}} style={styles.end}>
                        <Text style={{color:"#fff"}}>{formatTime(timer)}</Text>
                        <Text style={{color:"#fff"}}>End</Text>
                    </TouchableOpacity>
                  }

                    <Text style={{alignContent:"center", margin:10}}>{location? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`: ""}</Text>
                    <TouchableOpacity onPress={()=>{navigation.navigate('View') }} style={styles.viewButton}>
                        <Text style={{color:"#fff"}}>Locations History</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default HomePage;

const styles = StyleSheet.create({
    maincontainer:{
        position:"relative",
        width:"100%",
        height:"100%"
    },
    header:{
        marginTop:35,
        position:"fixed",
        top:0,
        padding:10,
        backgroundColor:"#ADD8E6"
    },
    container : {
        width:"100%",
        height:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:'center',
        alignContent:"center",
        paddingLeft:20,
        paddingRight:20,

    },
    start:{
        width:150,
        height:150,
        padding:20,
        marginLeft:"auto",
        marginRight:"auto",
        backgroundColor:"green",
        borderRadius:"50%",
        alignItems:"center",
        justifyContent:"center",
        alignContent:"center",
        color:"#fff",
    },
    end:{
        width:150,
        height:150,
        padding:20,
        marginLeft:"auto",
        marginRight:"auto",
        backgroundColor:"red",
        borderRadius:"50%",
        alignItems:"center",
        justifyContent:"center",
        alignContent:"center",
        color:"#fff",

    },
    viewButton:{
        width:150,
        padding:20,
        marginTop:20,
        marginLeft:"auto",
        marginRight:"auto",
        backgroundColor:"blue",
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
        alignContent:"center",
        color:"#fff",
    }
})