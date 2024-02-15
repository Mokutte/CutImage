// ImageCropperModule.swift

import Foundation
import UIKit

@objc(ImageCropperModule)
class ImageCropperModule: NSObject {
  
    // Внутри класса ImageCropperModule

    @objc(cropImage:withResolver:withRejecter:)
    func cropImage(imagePath: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      // Преобразование строки пути в URL и загрузка изображения
      guard let imageUrl = URL(string: imagePath),
            let imageData = try? Data(contentsOf: imageUrl),
            let image = UIImage(data: imageData) else {
        reject("E_IMAGE_ERROR", "Не удалось загрузить изображение", nil)
        return
      }
      
      // Рассчитываем размер и положение области для обрезки...
      let rect = CGRect(x: 0, y: 0, width: image.size.width / 2, height: image.size.height / 2) // Пример
      
      // Выполняем обрезку
      guard let cgImage = image.cgImage?.cropping(to: rect) else {
        reject("E_CROP_ERROR", "Не удалось обрезать изображение", nil)
        return
      }
      
      let croppedImage = UIImage(cgImage: cgImage)
      
      // Сохраняем обрезанное изображение в временный файл
      guard let data = croppedImage.jpegData(compressionQuality: 0.8),
            let tempFileUrl = NSURL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(UUID().uuidString + ".jpg") else {
        reject("E_FILE_ERROR", "Не удалось сохранить файл", nil)
        return
      }
      
      do {
        try data.write(to: tempFileUrl)
        resolve(tempFileUrl.absoluteString)
      } catch {
        reject("E_FILE_ERROR", "Не удалось сохранить файл", error)
      }
    }

  
}
