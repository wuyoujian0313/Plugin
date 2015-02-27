//
//  BaseViewController.h
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EnterProtocol.h"

#define IsIOS7 ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7.0)
#define navigationBarHeight (IsIOS7 ? 64 : 44)

@interface BaseViewController : UIViewController<EnterProtocol>


-(void)setImage:(UIImage*)image;
-(void)setWhoLaunchMe:(NSString *)name;

@end
