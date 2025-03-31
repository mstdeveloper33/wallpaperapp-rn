import { View, Text, FlatList , StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { data } from '../constants/data'
import { wp , hp ,  } from '../helpers/common'
import { theme } from '../constants/theme'
import Animated, { FadeInRight } from 'react-native-reanimated'

const Categories = ({activeCategory , handleChangeCategory}) => {
  return (
    <FlatList
     horizontal
     contentContainerStyle = {styles.flatlistContainer}
     showsHorizontalScrollIndicator = {false}
     data={data.categories}
     keyExtractor={(item) => item}
     renderItem={({item , index}) => (
     <CategoryItem
     isActive = {activeCategory == item}
     handleChangeCategory = {handleChangeCategory}
     title={item}
     index={index}
     >
     </CategoryItem>
     )}
    >
    </FlatList>
  )
}

const CategoryItem = ({title , index , isActive, handleChangeCategory}) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let backgroundColor = isActive ? theme.colors.neutral(0.9) : theme.colors.white;
  return (
    <Animated.View entering={FadeInRight.duration(700).delay(index * 200)}>
     <Pressable onPress={ () => handleChangeCategory(isActive ? null : title)} style = {[styles.category , {backgroundColor}]} >
      <Text style = {[styles.title, {color} ]} >{title}</Text>
     </Pressable>
    </Animated.View>
  )
}














const styles = StyleSheet.create({
  flatlistContainer : {
    gap : 8,
    paddingHorizontal : wp(4),
   
  },
  category : {
    backgroundColor : theme.colors.neutral(0.1),
    padding : 12,
    borderWidth : 1,
    borderColor : theme.colors.grayBG,
    paddingHorizontal : 15,
    borderRadius : theme.radius.lg,
    borderCurve : "continuous"
  },
  title : {
    color : theme.colors.neutral(0.9),
    fontSize : hp(1.8),
    fontWeight : theme.fontWeights.medium  
  }

})

export default Categories