import LottieView from "lottie-react-native"

export default function AnimatedSplash() {
    return
    <>
        <LottieView
            autoPlay
            loop={false}
            ref={animation}
            style={{
                width: 200,
                height: 200,
                backgroundColor: '#eee',
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require('../assets/animations/Animation - 1729146201385.json')}
            onAnimationFinish={onAnimationFinish}
        />
    </>
}