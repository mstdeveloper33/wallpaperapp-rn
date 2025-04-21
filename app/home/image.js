import { View, Text, StyleSheet, Platform, Pressable , ActivityIndicator , Animated } from 'react-native'
import React from 'react'
import { BlurView } from '@react-native-community/blur'
import { useRouter , useLocalSearchParams } from 'expo-router';
import { wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { Octicons, Entypo } from '@expo/vector-icons';
import { Image } from 'expo-image';


const ImageScreen = () => {
    const router = useRouter();
    const item = useLocalSearchParams();
    const [status , setStatus] = useState("loading");
    let uri = item?.webformatURL;
    const fileName = item?.previewURL.split("/").pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`
    

    const onLoad = () => {
        setStatus("");
    }

    const getSize = () => {

        const aspectRatio = item?.imageWidth / item?.imageHeight;
        const maxWidht = Platform.OS == "web" ? wp(50) : wp(92);
        let calculatedHeight = maxWidht / aspectRatio;
        let calculatedWidth = maxWidht;

        if(aspectRatio < 1){
            calculatedWidth = calculatedHeight * aspectRatio;
        }

        return {
            width : calculatedWidth,
            height : calculatedHeight,
        }
    }

    const handleDownloadImage = async () => {
        setStatus("downloading");
     let uri = await downloadFile();
     if(uri){
       console.log(uri);
     }
    }



    const handleShareImage = async () => {
      setStatus("sharing");
      let uri = await downloadFile();
      if(uri){
        await Sharing.shareAsync(uri);
      }
    }



    const downloadFile = async () => {
        try {
          const {uri} = await FileSystem.downloadAsync(imageUrl, filePath);
          setStatus("");
          return uri;
        } catch (err) {
            setStatus("");
            Alert.alert("Error", err.message);
            return null;
            
        }
    }


  return (
  <BlurView style = {styles.container} intensity = {60} tint = "dark">
    <View style = {getSize()}>
        <View style = {styles.loading} > 
            {
                status == "loading" && <ActivityIndicator size = "large" color = "white"></ActivityIndicator>
            }

        </View>
         <Image source = {uri} style = {[styles.image , getSize()]} transition={100} onLoad={onLoad}></Image>
    </View>
    <View style = {styles.buttons}>
       <Animated.View entering = {FadeInDown.springify()}>
        <Pressable style = {styles.button} onPress = {() => router.back()}>
            <Octicons name = "x" size = {24} color = "white"></Octicons>
        </Pressable>
       </Animated.View>
       <Animated.View entering = {FadeInDown.springify().delay(100)}>
        {
            status == "downloading"? (
                <ActivityIndicator size = "small" color = "white"></ActivityIndicator>
            ) : (
                <Pressable style = {styles.button} onPress = {handleDownloadImage}>
                    <Octicons name = "download" size = {24} color = "white"></Octicons>
                </Pressable>
            )
        }
        
       </Animated.View>
       <Animated.View entering = {FadeInDown.springify().delay(200)}>
       {
            status == "sharing"? (
                <ActivityIndicator size = "small" color = "white"></ActivityIndicator>
            ) : (
                <Pressable style = {styles.button} onPress = {handleShareImage}>
                <Entypo name = "share" size = {24} color = "white"></Entypo>
            </Pressable>
            )
        }
        
       </Animated.View>
    </View>
  

  </BlurView>
  )
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    paddingHorizontal : wp(4),
    backgroundColor : "rgba(0,0,0,0.5)"
  },
  image : {
   borderRadius : theme.borderRadius.lg,
   borderWidth : 2,
   backgroundColor : "rgba(255,255,255,0.1)",
   borderColor : "rgba(255,255,255,0.1)"
  },
  loading : {
    position : "absolute",
    width : "100%",
    height : "100%",
    justifyContent : "center",
    alignItems : "center",
  },
  buttons : {
    marginTop : 40,
    flexDirection : "row",
    gap : 50,
  },
  button : {
    width : wp(6),
    height : wp(6),
    justifyContent : "center",
    alignItems : "center",
    backgroundColor : "rgba(255,255,255,0.2)",
    borderRadius : theme.borderRadius.lg,
    borderCurve : "continuous",
  }
})

export default ImageScreen;               