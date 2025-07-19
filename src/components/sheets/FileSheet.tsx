import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Camera as CameraIcon, FolderClosed, Image, X } from '@tamagui/lucide-icons'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import React, { forwardRef, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
// Import Modal and StyleSheet from react-native
import { Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, Text, useTheme, View, XStack, YStack } from 'tamagui'

import { uploadFiles } from '@/services/FileService'
import { loggerService } from '@/services/LoggerService'
import { FileType, FileTypes } from '@/types/file'
import { useIsDark, uuid } from '@/utils'
import { getTextPrimaryColor } from '@/utils/color'
import { getFileType } from '@/utils/file'
const logger = loggerService.withContext('File Sheet')

interface FileSheetProps {
  files: FileType[]
  setFiles: (files: FileType[]) => void
}

const FileSheet = forwardRef<BottomSheetModal, FileSheetProps>(({ files, setFiles }, ref) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = useIsDark()
  const [_permission, requestPermission] = useCameraPermissions()

  // 1. State to control the full-screen camera modal
  const [isCameraVisible, setCameraVisible] = useState(false)
  const cameraRef = useRef<CameraView>(null)

  const handleAddCamera = async () => {
    const cameraPermission = await requestPermission()

    if (!cameraPermission.granted) {
      logger.info('Camera permission denied')
      return
    }

    ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    setCameraVisible(true)
  }

  const handleCloseCamera = () => {
    setCameraVisible(false)
  }

  const handleTakePicture = async () => {
    if (!cameraRef.current) {
      return
    }

    try {
      const photo = await cameraRef.current.takePictureAsync()

      if (photo) {
        const id = uuid()
        const fileName = photo.uri.split('/').pop() || `${id}.jpg`
        const _file: Omit<FileType, 'md5'> = {
          id: id,
          name: fileName,
          origin_name: fileName,
          path: photo.uri,
          size: 0,
          ext: 'jpg',
          type: FileTypes.IMAGE,
          mime_type: 'image/jpeg',
          created_at: new Date().toISOString(),
          count: 1
        }

        const uploadedFiles = await uploadFiles([_file])
        setFiles([...files, ...uploadedFiles])
      }
    } catch (error) {
      logger.error('Error taking picture:', error)
    } finally {
      setCameraVisible(false)
    }
  }

  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true
      })

      if (result.canceled) {
        return
      }

      const _files: Omit<FileType, 'md5'>[] = result.assets.map(asset => {
        const id = uuid()
        return {
          id: id,
          name: asset.fileName || id,
          origin_name: asset.fileName || id,
          path: asset.uri,
          size: asset.fileSize || 0,
          ext: asset.fileName?.split('.').pop() || 'png',
          type: getFileType(asset.fileName?.split('.').pop() || 'png'),
          mime_type: asset.mimeType || '',
          created_at: new Date().toISOString(),
          count: 1
        }
      })
      const uploadedFiles = await uploadFiles(_files)
      setFiles([...files, ...uploadedFiles])
    } catch (error) {
      logger.error('Error selecting image:', error)
    } finally {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }
  }

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true })

      if (result.canceled) {
        return
      }

      const _files: Omit<FileType, 'md5'>[] = result.assets.map(asset => {
        return {
          id: uuid(),
          name: asset.name,
          origin_name: asset.name,
          path: asset.uri,
          size: asset.size || 0,
          ext: asset.name.split('.').pop() || '',
          type: getFileType(asset.name.split('.').pop() || ''),
          mime_type: asset.mimeType || '',
          created_at: new Date().toISOString(),
          count: 1
        }
      })
      const uploadedFiles = await uploadFiles(_files)
      setFiles([...files, ...uploadedFiles])
    } catch (error) {
      logger.error('Error selecting file:', error)
    } finally {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }
  }

  const options = [
    {
      key: 'camera',
      label: t('common.camera'),
      icon: <CameraIcon size={24} />,
      onPress: handleAddCamera
    },
    {
      key: 'photo',
      label: t('common.photo'),
      icon: <Image size={24} />,
      onPress: handleAddImage
    },
    {
      key: 'file',
      label: t('common.file'),
      icon: <FolderClosed size={24} />,
      onPress: handleAddFile
    }
  ]

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  return (
    <>
      <BottomSheetModal
        snapPoints={['25%']}
        enableDynamicSizing={false}
        ref={ref}
        backgroundStyle={{
          borderRadius: 30,
          backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.color.val
        }}
        backdropComponent={renderBackdrop}>
        <BottomSheetView>
          <XStack gap={12} padding={20} justifyContent="space-between">
            {options.map(option => (
              <Button
                key={option.key}
                backgroundColor="$gray20"
                aspectRatio={1.618}
                onPress={option.onPress}
                justifyContent="center"
                alignItems="center"
                flex={1}>
                <YStack gap={8} alignItems="center">
                  {option.icon}
                  <Text color={getTextPrimaryColor(isDark)} fontSize={14} textAlign="center">
                    {option.label}
                  </Text>
                </YStack>
              </Button>
            ))}
          </XStack>
        </BottomSheetView>
      </BottomSheetModal>

      <Modal backdropColor="black" visible={isCameraVisible} animationType="slide" onRequestClose={handleCloseCamera}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef} autofocus="on" />

        <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
          <X size={32} color="white" />
        </TouchableOpacity>

        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture} />
        </View>
      </Modal>
    </>
  )
})

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

FileSheet.displayName = 'FileSheet'

export default FileSheet
