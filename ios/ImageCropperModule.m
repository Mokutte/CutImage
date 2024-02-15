// ImageCropperModule.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ImageCropperModule, NSObject)

RCT_EXTERN_METHOD(cropImage:(NSString *)imagePath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
