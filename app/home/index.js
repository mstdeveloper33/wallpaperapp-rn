import { View, Text, Pressable , StyleSheet, ScrollView, TextInput  } from 'react-native'
import React, { useCallback } from 'react'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { wp , hp } from '../../helpers/common';
import { useState , useRef , useEffect } from 'react';
import Categories from '../../components/categories';
import ImageGrid from '../../components/imageGrid';
import { apiCall } from '../../api';
import { debounce } from 'lodash';


var page = 1;


const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const paddingTop = top>0 ?  top + 10 : 30;
  const [search , setSearch] = useState('');
  const [activeCategory , setActiveCategory] = useState(null);
  const [images , setImages] = useState([]);
  const searchInputRef = useRef(null);


  useEffect(() => {
    fetchImages();
  }, []);


  const fetchImages = async (params = {page:1} , append = false) => {
    console.log(params,append);
    let res = await apiCall(params);
    if(res.success && res?.data?.hits){
      if(append) 
        setImages([ ...images, ...res.data.hits])
    else 
        setImages([...res.data.hits]);
  }
  }



  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {page};
    if(cat) params.category = cat;
    fetchImages(params); 
  }

  const handleSearch = (text) => {
   setSearch(text);
   if(text.length > 2){
    page = 1;
    setImages([]);
    setActiveCategory(null);
    fetchImages({page , q: text}, false);
   }
   if(text == ""){
    page = 1;
    searchInputRef?.current?.clear();
    setImages([]);
    setActiveCategory(null);
    fetchImages({page},false );
     
   }
  }


  const clearSearch = () => {
    setSearch('');
    searchInputRef?.current?.clear();
  }




  const handleTextDebounce = useCallback(
    debounce(handleSearch , 400), []
  )

  


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
           //value = {search}
           ref = {searchInputRef}     
           onChangeText = {handleTextDebounce}
           style = {styles.searchInput}
          ></TextInput>
          {
            search && (
              <Pressable 
              onPress = {() => handleSearch("")}
              style = {styles.closeIcon}
            >
              <Ionicons name = "close" size = {24} color = {theme.colors.neutral(0.6)} ></Ionicons>
            </Pressable>
            )
          }


        </View>

          {/* categories */}
          <View style = {styles.categories}>
            <Categories activeCategory = {activeCategory} handleChangeCategory = {handleChangeCategory} ></Categories>
          </View>
          
          {/* images grid */}
          <View>
             { images.length > 0 && <ImageGrid images={images} /> }
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
  },
  categories : {
    
  }
  
})


export default HomeScreen