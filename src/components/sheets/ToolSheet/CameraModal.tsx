import { X } from '@tamagui/lucide-icons'
import { CameraView } from 'expo-camera'
import React from 'react'
import { Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { View } from 'tamagui'

import { useCameraHandler } from './useCameraHandler'

interface CameraModalProps {
  onPhotoTaken: (photoUri: string) => void
  onSuccess?: () => void
}

export const useCameraModal = (props: CameraModalProps) => {
  const { isCameraVisible, cameraRef, handleOpenCamera, handleCloseCamera, handleTakePicture } = useCameraHandler(props)

  const modal = (
    <Modal backdropColor="black" visible={isCameraVisible} animationType="slide" onRequestClose={handleCloseCamera}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef} autofocus="on" />

      <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
        <X size={32} color="white" />
      </TouchableOpacity>

      <View style={styles.captureButtonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture} />
      </View>
    </Modal>
  )

  return {
    isCameraVisible,
    handleOpenCamera,
    modal
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'rgba(0,0,0,0.3)'
  }
})
