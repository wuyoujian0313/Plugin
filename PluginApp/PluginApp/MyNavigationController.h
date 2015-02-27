//
//  MyNavigationController.h
//  TestProject
//
//  Created by wuyj on 15-1-5.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EnterProtocol.h"

@interface MyNavigationController : UINavigationController

- (instancetype)initWithRootViewController:(UIViewController<EnterProtocol> *)rootViewController;

@end
