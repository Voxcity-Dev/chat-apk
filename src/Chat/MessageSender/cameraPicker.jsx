import React, { useState, useRef, } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Icon } from '@rneui/themed';

export default function CameraPicker(props) {
    const cameraRef = useRef(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [isRecording, setIsRecording] = useState(false);



    async function handleCameraIconPress() {
        if (cameraRef.current) {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === 'granted') {
                let photo = await cameraRef.current.takePictureAsync()

                .catch((error) => {
                    console.log('Erro ao tirar foto:', error);
                });
                console.log('Foto tirada:', photo);
                let filesX;
                if (photo) {
                    photo.mimeType = 'image/jpg';
                    photo.name = photo.uri.split('/').pop();
                    filesX = [...props.files, photo];
                    props.setFiles(filesX);
                    props.setIsCameraOpen(false);
                }
            }
        }
    }

    async function handleRecordButtonPress() {
        setIsRecording(true);
        if (cameraRef.current) {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === 'granted') {
                let video = await cameraRef.current.recordAsync()
                .catch((error) => {
                    console.log('Erro ao gravar vídeo:', error);
                });
                console.log('Vídeo gravado:', video);
                let filesX;
                if (video) {
                    video.mimeType = 'video/mp4';
                    video.name = video.uri.split('/').pop();
                    filesX = [...props.files, video];
                    props.setFiles(filesX);
                    props.setIsCameraOpen(false);
                }
            }
        }
    }

    function stopRecording() {
        setIsRecording(false);
        cameraRef.current.stopRecording();
    }


    function toggleCameraType() {
        setCameraType(current => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
    }

    function toggleFlashlight() {
        setFlashMode((currentMode) =>
            currentMode === Camera.Constants.FlashMode.torch
                ? Camera.Constants.FlashMode.off
                : Camera.Constants.FlashMode.torch
        );
    }

    function handleCameraClose() {
        props.setIsCameraOpen(false);
        setIsRecording(false);
    }

    return (
        <View >
            {
                props.isCameraOpen ?
                    <View style={styles.container}>
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            type={cameraType}
                            flashMode={flashMode}
                        >
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={handleCameraClose}>
                                    <Icon name="close-sharp" type="ionicon" size={30} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.switchCameraButton} onPress={toggleFlashlight}>
                                    <Icon
                                        name={
                                            flashMode === Camera.Constants.FlashMode.torch
                                                ? 'flash-off-sharp'
                                                : 'flash-sharp'
                                        }
                                        type="ionicon"
                                        size={30}
                                        color="#fff"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.switchCameraButton} onPress={toggleCameraType}>
                                    <Icon name="camera-reverse-sharp" type="ionicon" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cameraActions}>
                                <TouchableOpacity style={styles.cameraButton} onPress={handleCameraIconPress}>
                                    <Icon name="camera-sharp" type="ionicon" size={30} color="#fff" />
                                </TouchableOpacity>
                                {
                                    isRecording === false ? (
                                        <TouchableOpacity style={styles.recordButton} onPress={handleRecordButtonPress}>
                                            <Icon name="videocam-sharp" type="ionicon" size={30} color="#fff" />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.recordButton} onPress={stopRecording}>
                                            <Icon name="stop-sharp" type="ionicon" size={30} color="#fff" />
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </Camera>
                    </View>
                    :
                    <TouchableOpacity onPress={() => props.setIsCameraOpen(true)} style={styles.cameraButton} >
                        <Icon name="camera-sharp" type="ionicon" color={'#9ac31c'} />
                    </TouchableOpacity>
            }

        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        right: 30,
    },
    camera: {
        display: 'flex',
        width: windowWidth,
        height: windowHeight,
        zIndex: 99999,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
    },
    cameraActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: windowHeight - 200,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    cameraButton: {
        marginLeft: 20,
    },
    recordButton: {
        marginRight: 20,
    },
    switchCameraButton: {
        alignSelf: 'flex-start',
    }
});
