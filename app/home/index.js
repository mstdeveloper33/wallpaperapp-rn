import { View, Text, Pressable , StyleSheet, ScrollView, TextInput  } from 'react-native'
import React from 'react'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { wp , hp } from '../../helpers/common';
import { useState , useRef } from 'react';


const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const paddingTop = top>0 ?  top + 10 : 30;
  const [search , setSearch] = useState('');
  const searchInputRef = useRef(null);



  return (
    <View style = {[styles.container , {paddingTop}]}>
       <StatusBar style='dark'></StatusBar>
      <View style = {styles.header}>
        <Pressable>
          <Text style = {styles.title}>
              Pixels
          </Text>
        </Pressable>
        <Pressable>
          <FontAwesome6 name = "bars-staggered" size = {22} color = {theme.colors.neutral(0.7)} ></FontAwesome6>
        </Pressable>
      </View>
      <ScrollView
      contentContainerStyle = {{gap : 15}}
      >
        <View style = {styles.searchBar}>
          <View style = {styles.searchIcon}>
            <Feather name = "search" size = {24} color = {theme.colors.neutral(0.4)} ></Feather>
          </View>
          <TextInput
           placeholder='Search for photos...'
           value = {search}
           ref = {searchInputRef}     
           onChangeText = {value => setSearch(value)}
           style = {styles.searchInput}
          ></TextInput>
          {
            search && (
              <Pressable
              style = {styles.closeIcon}
            >
              <Ionicons name = "close" size = {24} color = {theme.colors.neutral(0.6)} ></Ionicons>
            </Pressable>
            )
          }
        
        </View>

      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container : {
    flex : 1,
    gap : 15,
  },
  header : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    marginHorizontal : wp(4)
  },
  title : {
    fontSize : hp(4),
    fontWeight : theme.fontWeights.bold,
    color : theme.colors.neutral(0.9)
  },
  searchBar : {
    marginHorizontal : wp(4),
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    borderWidth : 1,
    borderColor : theme.colors.grayBG,
    backgroundColor : theme.colors.neutral(0.1),
    padding :6,
    paddingLeft : 10,
    borderRadius : theme.radius.lg
  },
  searchIcon : {
    padding : 10,
  },
  searchInput : {
    flex : 1,
    borderRadius : theme.radius.sm,
    paddingVertical : 10,
    fonstSize : hp(1.8),

  },
  closeIcon : {
    backgroundColor : theme.colors.neutral(0.1),
    padding : 8,
    borderRadius : theme.radius.sm
  }

})

export default HomeScreen