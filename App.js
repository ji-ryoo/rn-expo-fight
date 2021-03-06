import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import logo from './assets/image.jpg'
import * as Sharing from 'expo-sharing'
import * as ImagePicker from 'expo-image-picker'
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {
 const [selectedImage, setSelectedImage] = React.useState(null); 
  let openImagePickerAsync = async() =>{
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if(permissionResult.granted == false){
      alert("Permission to access camera roll is required");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if(pickerResult.cancelled == true){
      return;
    }
    
    if(Platform.OS === 'web'){
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: remoteUri});
      //let test = { localUri: pickerResult.uri, remoteUri};
    }else{

      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null});
    }
  };


  let openSharingDialogAsync = async() => {
    if(!(await Sharing.isAvailableAsync())){
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri);
  };


  if(selectedImage != null){
    return(
          <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
      <TouchableOpacity onPress={openSharingDialogAsync} style={styles.button}>
        <Text style={styles.buttonText}>Share this photo</Text>
      </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo}/>
      <Text style = {styles.instructions}>It's Gogh.</Text>
      <TouchableOpacity
        onPress={openImagePickerAsync}
        style={{ backgroundColor: 'blue' }}>
    <Text style={{ fontSize: 20, color: '#fff' }}>Pick a photo</Text>
    </TouchableOpacity>
    <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
