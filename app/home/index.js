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
import FiltersModal from '../../components/filtersModal';
import { useRouter } from 'expo-router';
var page = 1;


const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const paddingTop = top>0 ?  top + 10 : 30;
  const [search , setSearch] = useState('');
  const [activeCategory , setActiveCategory] = useState(null);
  const [images , setImages] = useState([]);
  const [filters , setFilters] = useState({});
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const [ isEndReached , setIsEndReached] = useState(false);
  const router = useRouter();


  useEffect(() => {
    fetchImages();
  }, []);


  const fetchImages = async (params = {page:1} , append = true) => {
    console.log(params,append);
    let res = await apiCall(params);
    if(res.success && res?.data?.hits){
      if(append) 
        setImages([ ...images, ...res.data.hits])
    else 
        setImages([...res.data.hits]);
  }
  }

  const openFiltersModal = () => {
    modalRef.current?.present();
  }

  const closeFiltersModal = () => {
    modalRef.current?.close();
  }


  const applyFilters = (filters) => {
    if(filters){
      page = 1;
      setImages([]);
      let params = {page, ...filters};
      if(activeCategory) params.category = activeCategory;
      if(search) params.q = search;
      fetchImages(params , false);
    }
    closeFiltersModal();
    
  }

  const resetFilters = () => {
    if(filters){
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {page};
      if(activeCategory) params.category = activeCategory;
      if(search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  }


  const clearThisFilter = (filterName) => {
   let filterz = {...filters};
   delete filterz[filterName];
   setFilters({...filterz});
   page = 1;
   setImages([]);
   let params = {page, 
    ...filterz
   };
     if(activeCategory) params.category = activeCategory;
      if(search) params.q = search;
      fetchImages(params, false);
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
    fetchImages({page , q: text , ...filters}, false);
   }
   if(text == ""){
    page = 1;
    searchInputRef?.current?.clear();
    setImages([]);
    setActiveCategory(null);
    fetchImages({page, ...filters},false );
     
   }
  }


  const clearSearch = () => {
    setSearch('');
    searchInputRef?.current?.clear();
  }


  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPossition = contentHeight - scrollViewHeight;
    if(scrollOffset >= bottomPossition-1){
      if(!isEndReached){
        setIsEndReached(true);
        ++page;
        let params = {page, ...filters};
        if(activeCategory) params.category = activeCategory;
        if(search) params.q = search;
        fetchImages(params);
      }
    }else if(isEndReached){
      setIsEndReached(false);
    }
  }

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({y : 0, animated : true});
  }

  const handleTextDebounce = useCallback(
    debounce(handleSearch , 400), []
  )

  


  return (
    <View style = {[styles.container , {paddingTop}]}>
       <StatusBar style='dark'></StatusBar>
      <View style = {styles.header}>
        <Pressabl onPress = {handleScrollUp}>
          <Text style = {styles.title}>
              Pixels
          </Text>
        </Pressabl>
        <Pressable onPress = {openFiltersModal}>
          <FontAwesome6 name = "bars-staggered" size = {22} color = {theme.colors.neutral(0.7)} ></FontAwesome6>
        </Pressable>
      </View>
      <ScrollView
      onScroll = {handleScroll}
      scrollEventThrottle = {5}
      ref = {scrollRef}

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

          {
            filters && (
             <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {styles.filters}>
              {
                Object.keys(filters).map((key , index) => {
                  return (
                    <View key = {key} style = {styles.filterItem}>

                      {
                        key == "colors"?(
                          <View style = {{
                            height : 20,
                            width : 30,
                            backgroundColor : filters[key],
                            borderRadius : 7
                          }}>
                          </View>
                        ):(
                          <Text style = {styles.filteItemText}>{filters[key]}</Text>
                        )
                      }
                      <Pressable style = {styles.filterCloseIcon} onPress = {() => clearThisFilter(key)}>
                        <Ionicons name = "close" size = {24} color = {theme.colors.neutral(0.9)} ></Ionicons>
                      </Pressable>
                    </View>
                  )
                })
              }
             </ScrollView>
            )
          }







          
          {/* images grid */}
          <View>
             { images.length > 0 && <ImageGrid images={images} router = {router} /> }
          </View>

          <View style = {{marginBottom :70 , marginTop : images.length > 0 ? 15 : 70.7}}>
            <ActivityIndicator size = "large" ></ActivityIndicator>
          </View>
      </ScrollView>

      <FiltersModal 
      modalRef = {modalRef}
      filters = {filters}
      setFilters = {setFilters}
      onClose = {closeFiltersModal}
      onApply = {applyFilters}
      onReset = {resetFilters}
      ></FiltersModal>
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
  filterItem : {
    flexDirection : 'row',
    padding : 8,
    alignItems : 'center',
    gap : 10,
    backgroundColor : theme.colors.grayBG,
    paddingHorizontal : 10,
    borderRadius : theme.radius.xs
    
  },
  filteItemText : {
    fontSize : hp(1.8),
   
  },
  filterCloseIcon : {
    backgroundColor : theme.colors.neutral(0.2),
    padding : 4,
    borderRadius : 7
  },
  categories : {
    marginHorizontal : wp(4)
  }
})


export default HomeScreen