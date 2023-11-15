import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, TouchableOpacity, TouchableOpacityComponent } from 'react-native';
import Device from 'expo-device';
import * as Location from 'expo-location';
import { calculateBearing, calculateDistance } from './lib/gps';

//GPS/Location math functions

//Seattle Central College GPS co-ordinates
const CF_LAT = 47.6167265; 
const CF_LON = -122.3241714;

export default function App() {
  const [bookMarkLoc, setBookMarkLoc] = useState(null);
  //const [distance, setDistance] = useState(null);
  //const [bearing, setBearing] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


//=== Testing: useEffect subscriber for location ===//

useEffect(() => {( async () => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  let locationSubscription = null;
  if (status !== 'granted') {
    console.log('Permission to access location was denied')
  } else {
    locationSubscription = await Location.watchPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
    }, (location) => {
      setLocation(location)
      //console.log('New location update: ' + location.coords.latitude + ', ' + location.coords.longitude)
    })
  } return () => locationSubscription.remove()
})()}, [])

  // Get GPS location on app load
/*
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
*/
  let text = 'Waiting..';
  let lat, long, distance, bearing = '';

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {

  const { longitude, latitude, heading } = location.coords;
  distance = calculateDistance( latitude, longitude, bookMarkLoc.lat, bookMarkLoc.lon, unit = 'imperial' ); //CF_LAT, CF_LON
  bearing = calculateBearing( latitude, longitude, bookMarkLoc.lat, bookMarkLoc.lon );

  long = JSON.stringify(location.coords.longitude);
  lat = JSON.stringify(location.coords.latitude);
  head = JSON.stringify(location.coords.heading);

  }
   //location.coords.latitude,
   //location.coords.longitude
  function _onPressButton(type) {
    if (type === 'loc') {
      console.log('You tapped the button!');
      setBookMarkLoc({
        lat: lat,
        lon: long,
      })
    }
    if (type === 'cf') {
      console.log('You tapped the button!');
      setBookMarkLoc({
        lat: CF_LAT,
        lon: CF_LON,
      })
    }
  }



//${ distance.distance } ${ distance.unit }
//{ `Distance: ${ distance.distance } ${ distance.unit }` }
  return (
    <View style={[styles.container,
      {
        // Try setting `flexDirection` to `"row"`.
        flexDirection: 'column',
      }
    ]}>
      <View style={{}} >
          <Text style={{textAlign: 'center', fontSize: 40, marginBottom: 20}}>GPS Bookmark</Text>
          <Text style={styles.paragraph}>{ bookMarkLoc ? `Your bookmarked location:` : '' }</Text>
          <Text style={styles.paragraph}>{ bookMarkLoc ? `Longitude: ${ bookMarkLoc.lon }` : '' }</Text>
          <Text style={styles.paragraph}>{ bookMarkLoc ? `Latitude: ${ bookMarkLoc.lat }` : '' }</Text>
       </View>
      <View style={{marginTop: 15, marginBottom: 200, backgroundColor: 'darkorange'}}>
        <Text style={styles.paragraph}>{ distance ? `Distance: ${ distance.distance } ${ distance.unit }` : '' }</Text>
        <Text style={styles.paragraph}>{ bearing ? `Bearing: ${bearing}` : '' }</Text>
      </View>
      <TouchableOpacity onPress={() => _onPressButton('loc')}>
      <View style={[styles.button, {backgroundColor: 'grey'}]}>
      <Text style={styles.buttonText}>Bookmark</Text>
      </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => _onPressButton('cf')}>
      <View style={[styles.button, {backgroundColor: 'grey'}]}>
      <Text style={styles.buttonText}>Distance to CF HQ</Text>
      </View>
      </TouchableOpacity>

    </View>
  );
}
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
*/

const styles = StyleSheet.create({
  container: {
    
    alignItems: 'center',
    /*justifyContent: 'center',*/
    marginTop: 160,
    width: '100%',
    /*padding: 40,*/
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
    fontSize: 20
  },
  paragraph: {
    fontSize: 22,
    textAlign: 'center',
  },
});