import {StyleSheet, View, Image, Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { NativeModules } from 'react-native';

const { ImageCropperModule } = NativeModules;

interface ImageCropperProps {
  source: any; // Замените any на конкретный тип
}

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(Image);

const ImageCropper: React.FC<ImageCropperProps> = ({source}) => {
  // Изначальное положение
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0); 
  const offsetY = useSharedValue(0);
  const MIN_SCALE = 1; // Минимальный масштаб
  const MAX_SCALE = 10; // Максимальный масштаб

  // Функция для возвращения изображения в допустимые границы
  const adjustOffsetToBounds = () => {
    'worklet';
    const maxX = Math.max((windowWidth * (scale.value - 1)) / 2, 0);
    const maxY = Math.max((windowHeight * (scale.value - 1)) / 2, 0);
    
    offsetX.value = withTiming(Math.min(Math.max(offsetX.value, -maxX), maxX));
    offsetY.value = withTiming(Math.min(Math.max(offsetY.value, -maxY), maxY));
  };

  const context = useSharedValue({x: 0, y: 0});

  // ImageCropperModule.cropImage('https://files.oaiusercontent.com/file-bhQRX2dhgF4FPvupJi6vx3mJ?se=2024-02-15T01%3A07%3A19Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Dbe2856a7-cf75-4d39-990b-ad286f7a1d54.webp&sig=g/neio1ALfHxOiUo4oTZyErJhl8jN63ZQkIZDQ%2B16NM%3D')
  // .then((croppedImagePath) => {
  //   console.log('Обрезанное изображение сохранено в:', croppedImagePath);
  // })
  // .catch((error) => {
  //   console.error(error);
  // });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      //Сохраняем текущие значение положения
      context.value = {x: offsetX.value, y: offsetY.value};
    })
    .onUpdate(event => {
      offsetX.value = event.translationX + context.value.x;  //Добавляем его к новому значению 
      offsetY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      if (scale.value < MIN_SCALE) {
        scale.value = withSpring(MIN_SCALE);
      } else if (scale.value > MAX_SCALE) {
        scale.value = withSpring(MAX_SCALE);
      }
      adjustOffsetToBounds();
    });

    const focalPoint = useSharedValue({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    });
    
  const pinchGesture = Gesture.Pinch()
  .shouldCancelWhenOutside(true)
  .onStart(() => {
    // Сохраняем текущие значения масштаба и положения
    focalPoint.value = {
      scale: scale.value,
      offsetX: offsetX.value,
      offsetY: offsetY.value,
    };
  })
  .onUpdate((event) => {
    // Вычисляем новый масштаб
    const newScale = Math.min(Math.max(focalPoint.value.scale * event.scale, MIN_SCALE), MAX_SCALE);
    
    // Рассчитываем разницу в масштабе относительно предыдущего состояния
    const scaleDifference = newScale / focalPoint.value.scale;
  
    // Обновляем масштаб
    scale.value = newScale;
    
    // Вычисляем смещение с учетом фокальной точки
    const focalX = event.focalX - windowWidth / 2;
    const focalY = event.focalY - windowHeight / 2;
    
    // Рассчитываем новое смещение с учетом фокальной точки
    offsetX.value = focalPoint.value.offsetX + (focalX - focalPoint.value.offsetX) * (1 - scaleDifference);
    offsetY.value = focalPoint.value.offsetY + (focalY - focalPoint.value.offsetY) * (1 - scaleDifference);
  })
  .onEnd(() => {
    adjustOffsetToBounds();
  });

  const combinedGesture = Gesture.Race(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offsetX.value},
        {translateY: offsetY.value},
        {scale: scale.value},
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.imageWrapper ]}>
          <AnimatedImage
            source={source}
            style={[styles.image, animatedStyle]}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: windowWidth,
    height: windowHeight,
  },
});


export default ImageCropper;
