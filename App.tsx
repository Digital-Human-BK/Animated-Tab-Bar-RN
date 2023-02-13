import {
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
  LayoutChangeEvent,
} from 'react-native';

import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {useEffect, useReducer, useRef} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Lottie from 'lottie-react-native';
import Svg, {Path} from 'react-native-svg';
import {NavigationContainer} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

function App(): JSX.Element {
  useEffect(() => {
    console.log('Initial App loading');
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator tabBar={props => <AnimatedTabBar {...props} />}>
          <Tab.Screen
            name="Home"
            options={{
              // @ts-ignore
              tabBarIcon: ({ref}) => (
                <Lottie
                  ref={ref}
                  loop={false}
                  source={require('./src/assets/lottie/home.icon.json')}
                  style={styles.icon}
                />
              ),
            }}
            component={PlaceholderScreen}
          />
          <Tab.Screen
            name="Upload"
            options={{
              // @ts-ignore
              tabBarIcon: ({ref}) => (
                <Lottie
                  ref={ref}
                  loop={false}
                  source={require('./src/assets/lottie/upload.icon.json')}
                  style={styles.icon}
                />
              ),
            }}
            component={PlaceholderScreen}
          />
          <Tab.Screen
            name="Chat"
            options={{
              // @ts-ignore
              tabBarIcon: ({ref}) => (
                <Lottie
                  ref={ref}
                  loop={false}
                  source={require('./src/assets/lottie/chat.icon.json')}
                  style={styles.icon}
                />
              ),
            }}
            component={PlaceholderScreen}
          />
          <Tab.Screen
            name="Settings"
            options={{
              // @ts-ignore
              tabBarIcon: ({ref}) => (
                <Lottie
                  ref={ref}
                  loop={false}
                  source={require('./src/assets/lottie/settings.icon.json')}
                  style={styles.icon}
                />
              ),
            }}
            component={PlaceholderScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

//============================================================================
// PLACEHOLDER SCREEN
//============================================================================

const PlaceholderScreen = () => {
  return <View style={{flex: 1, backgroundColor: '#604AE6'}} />;
};

//============================================================================
// ANIMATED TAB BAR
//============================================================================

const AnimatedTabBar = ({
  state: {index: activeIndex, routes},
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const {bottom} = useSafeAreaInsets();
  // position ----------------------------------------------------------

  const reducer = (state: any, action: {x: number; index: number}) => {
    // Add the new value to the state
    return [...state, {x: action.x, index: action.index}];
  };

  const [layout, dispatch] = useReducer(reducer, []);

  const handleLayout = (event: LayoutChangeEvent, index: number) => {
    dispatch({x: event.nativeEvent.layout.x, index});
  };

  // animations --------------------------------------------------------

  const xOffset = useDerivedValue(() => {
    if (layout.length !== routes.length) {
      return 0;
    }

    return [...layout].find(({index}) => index === activeIndex).x - 25;
  }, [activeIndex, layout]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(xOffset.value, {duration: 250})}],
    };
  });

  return (
    <View
      style={[
        styles.tabBar,
        {paddingBottom: Platform.OS === 'android' ? bottom + 16 : 0},
      ]}>
      <AnimatedSvg
        width={110}
        height={60}
        viewBox="0 0 110 60"
        fill="none"
        style={[styles.activeBackground, animatedStyles]}>
        <Path
          fill="#604AE6"
          d="M20 0H0c11.046 0 20 8.954 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.046 8.954-20 20-20H20z"
        />
      </AnimatedSvg>

      <View style={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const active = index === activeIndex;
          const {options} = descriptors[route.key];

          return (
            <TabBarComponent
              key={route.key}
              active={active}
              options={options}
              onLayout={e => handleLayout(e, index)}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
};

//============================================================================
// TAB BAR COMPONENT
//============================================================================

type TabBarComponentProps = {
  active?: boolean;
  options: BottomTabNavigationOptions;
  onLayout: (e: LayoutChangeEvent) => void;
  onPress: () => void;
};

const TabBarComponent = ({
  active,
  options,
  onPress,
  onLayout,
}: TabBarComponentProps) => {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref?.current) {
      // @ts-ignore
      ref.current.play();
    }
  }, [active]);

  const animatedComponentCircleStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(active ? 1 : 0, {duration: 250}),
        },
      ],
    };
  });

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active ? 1 : 0.5, {duration: 250}),
    };
  });

  return (
    <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
      <Animated.View
        style={[styles.componentCircle, animatedComponentCircleStyles]}
      />
      <Animated.View
        style={[styles.iconContainer, animatedIconContainerStyles]}>
        {/* @ts-ignore */}
        {options.tabBarIcon ? options.tabBarIcon({ref}) : <Text>?</Text>}
      </Animated.View>
    </Pressable>
  );
};

//============================================================================
// STYLES
//============================================================================

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  activeBackground: {
    backgroundColor: 'white',
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 36,
    width: 36,
  },
});

export default App;
