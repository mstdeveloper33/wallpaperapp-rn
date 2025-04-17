import { View, Text , StyleSheet} from 'react-native'
import React from 'react'
import { BottomSheetModal , BottomSheetView } from '@gorhom/bottom-sheet'
import { useMemo } from 'react'
import { BlurView } from 'expo-blur'
import Animated , { useAnimatedStyle , interpolate , Extrapolation, FadeInDown } from 'react-native-reanimated'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'
import { SectionView, ColorFilter, CommonFilterRow } from './filterViews'
import { capitalize } from '../helpers/common'
import { data } from '../constants/data'
import { Pressable } from 'react-native'




const FiltersModal = ({modalRef , filters , setFilters , onClose , onApply , onReset}) => {
    const snapPoints = useMemo(() => ['75%'], []);
  return (
   <BottomSheetModal
   ref = {modalRef}
   index = {0}
   snapPoints = {snapPoints}
   enablePanDownToClose = {true}
   backdropComponent = {CustomBackrop}
  // onChange = {handleSheetChange}
    >
    <BottomSheetView style = {styles.contentContainer}>
      <View style = {styles.content}>
        <Text style = {styles.filterText}>Filters</Text>
        {
            Object.keys(sections).map((sectionName, index) => {
                let sectionView = sections[sectionName];
                let sectionData = data.filters[sectionName];
                let title = capitalize(sectionName);
                return (
                    <Animated.View key = {sectionName}
                    entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
                    >
                      <SectionView
                      title = {title}
                      content = {sectionView({
                        data : sectionData,
                        filters : filters,
                        setFilters : setFilters,
                        filterName : sectionName
                      })}
                      />
                    </Animated.View>
                )
            })
        }

        <Animated.View 
        entering= {FadeInDown.delay(500).springify().damping(11)}
        style = {styles.buttons}>
            <Pressable style = {styles.resetButton} onPress = {onReset}>
                <Text style = {[styles.buttonText , {color : theme.colors.neutral(0.9)}]}>Reset</Text>
            </Pressable>

            <Pressable style = {styles.applyButton} onPress = {onApply}>
                <Text style = {[styles.buttonText , {color : theme.colors.white}]}>Apply</Text>
            </Pressable>
        </Animated.View>


      </View>
    </BottomSheetView>
   </BottomSheetModal>
  )
}

const sections = {
    "order" : (props) => <CommonFilterRow {...props} />,
    "orientation" : (props) => <CommonFilterRow {...props} />,
    "type" : (props) => <CommonFilterRow {...props} />,
    "colors" : (props) => <ColorFilter {...props} />,
}



const CustomBackrop = ({style , animatedIndex}) => {

    const  containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(animatedIndex.value , [-1,0] , [0,1],
            Extrapolation.CLAMP
        )
        return {
            opacity
        }
    })


    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay
    ]
    return (
        <Animated.View style = {containerStyle}>
            <BlurView
            intensity = {75}
            tint = 'dark'
            style = {StyleSheet.absoluteFill}
            />

        </Animated.View>
    )
}

const styles = StyleSheet.create({
overlay : {
        backgroundColor : 'rgba(0,0,0,0)',
    },

contentContainer : {
    flex : 1,
    alignItems : 'center',
  },

content : {
   flex : 1,
   gap : 15,
   paddingHorizontal : 10,
   paddingVertical : 20,
  },

  filterText : {
    fontSize : hp(4),
    fontWeight : theme.fontWeights.semiBold,
    color : theme.colors.neutral(0.8),
    marginBottom : 5,
  },

  buttons : {
   flex : 1,
   flexDirection : 'row',
   alignItems : 'center',
   gap : 10,
},

  resetButton : {
   flex : 1,
   backgroundColor : theme.colors.neutral(0.03),
   padding : 5,
   alignItems : 'center',
   justifyContent : 'center',
   borderRadius : theme.radius.md,
   borderCurve : 'continuous',
   borderWidth : 2,
   borderColor : theme.colors.grayBG,
  },

  applyButton : {
   flex : 1,
   backgroundColor : theme.colors.neutral(0.8),
   padding : 5,
   alignItems : 'center',
   justifyContent : 'center',
   borderRadius : theme.radius.md,
   borderCurve : 'continuous',
  },

  buttonText : {
    fontSize : hp(2.2),
  
  },
  
  

  


})



export default FiltersModal