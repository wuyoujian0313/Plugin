//
//  Menu.h
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Menu : NSObject

@property(nonatomic,copy)NSString *name;
@property(nonatomic,copy)NSString *type;
@property(nonatomic,copy)NSString *url;
@property(nonatomic,copy)NSString *packname;
@property(nonatomic,copy)NSString *icon;
@property(nonatomic,copy)NSString *desc;
@property(nonatomic,copy)NSString *enabled;//enabled

@end
