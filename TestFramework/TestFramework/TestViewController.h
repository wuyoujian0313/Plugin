//
//  TestViewController.h
//  TestFramework
//
//  Created by wuyj on 15-1-5.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EnterProtocol.h"

@interface TestViewController : UIViewController<EnterProtocol>

-(void)setImage:(UIImage *)image;

@end
