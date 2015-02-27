//
//  MenuResult.h
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "NetResultBase.h"
#import "Menu.h"

@interface MenuResult : NetResultBase

@property(nonatomic,strong,getter=arrayMenu)NSArray        *BaiduParserArray(result,Menu);

@end
