/*
 * Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses>.
 */

#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>
#import <Security/Security.h>
#import <UIKit/UIKit.h>

extern "C" NSString* getIdentifierForVendor()
{
    NSString *key = @"com.niliBOX.siteID";

    NSDictionary *query = @{
        (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
        (__bridge id)kSecAttrAccount: key,
        (__bridge id)kSecReturnData: @YES,
        (__bridge id)kSecMatchLimit: (__bridge id)kSecMatchLimitOne
    };

    CFTypeRef result = NULL;
    OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, &result);
    if (status == errSecSuccess && result) {
        NSData *data = ( NSData *)result;
        NSString *savedID = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        return savedID;
    }

    NSString *newID = [[NSUUID UUID] UUIDString];
    NSData *data = [newID dataUsingEncoding:NSUTF8StringEncoding];

    NSDictionary *addQuery = @{
        (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
        (__bridge id)kSecAttrAccount: key,
        (__bridge id)kSecValueData: data
    };

    SecItemAdd((__bridge CFDictionaryRef)addQuery, NULL);
    return newID;
}


extern "C" bool isRunningOniPhone()
{
    return UIDevice.currentDevice.userInterfaceIdiom == UIUserInterfaceIdiomPhone;
}


extern "C" void forceiOSSpeaker() {
    AVAudioSession *session = [AVAudioSession sharedInstance];
    NSError *error = nil;

    [session setCategory:AVAudioSessionCategoryPlayAndRecord
             withOptions:(AVAudioSessionCategoryOptionDefaultToSpeaker |
                          AVAudioSessionCategoryOptionAllowBluetooth )
             error:&error];

    if (error)
        return;

    [session setActive:YES error:&error];

    if (error)
        return;

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)),
                   dispatch_get_main_queue(), ^{
        AVAudioSessionRouteDescription *route = [session currentRoute];
        BOOL externaloutput = false;

        for (AVAudioSessionPortDescription *output in route.outputs) {
            NSString *portType = output.portType;

            if ([portType isEqualToString:AVAudioSessionPortHeadphones] ||
                [portType isEqualToString:AVAudioSessionPortBluetoothA2DP] ||
                [portType isEqualToString:AVAudioSessionPortBluetoothLE] ||
                [portType isEqualToString:AVAudioSessionPortBluetoothHFP]) {
                externaloutput = true;
                break;
            }
        }

        if (!externaloutput) {
            NSError *error = nil;
            [session overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:&error];
        }
    });
}

extern "C" void ios_getSafeAreaInsets(int *top, int *left, int *bottom, int *right)
{
    if (!top || !left || !bottom || !right)
        return;

    *top = *left = *bottom = *right = 0;

    if (@available(iOS 11.0, *)) {
        UIWindow *window = UIApplication.sharedApplication.keyWindow;

        if (!window) {
            for (UIWindow *w in UIApplication.sharedApplication.windows) {
                if (w.isKeyWindow) {
                    window = w;
                    break;
                }
            }
        }

        if (window) {
            UIEdgeInsets insets = window.safeAreaInsets;

            *top    = (int)insets.top;
            *left   = (int)insets.left;
            *bottom = (int)insets.bottom;
            *right  = (int)insets.right;
        }
    }
}
