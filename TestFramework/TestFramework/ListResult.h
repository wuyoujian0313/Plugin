//
//  ListResult.h
//  TestFramework
//
//  Created by wuyj on 15-1-13.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "NetResultBase.h"
#import "Info.h"

@interface ListResult : NetResultBase

@property(nonatomic,strong,getter=arrayList)NSArray        *BaiduParserArray(result,Info);

@end
