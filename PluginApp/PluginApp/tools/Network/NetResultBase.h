//
//  NetResultBase.h
//
//
//  Created by wuyj on 14-9-2.
//  Copyright (c) 2014年 wuyj. All rights reserved.
//

#import <Foundation/Foundation.h>

#define BaiduParserArray(key,type)    key##__Array__##type

@interface NetResultBase : NSObject

@property (nonatomic, copy)NSNumber *ret;       // 返回代码


// 自动解析Json
// ！！！！！！目前仅支持整个报文解析成字典类型
-(void)autoParseJsonData:(NSData*)result;

- (void)parseNetResult:(NSDictionary *)jsonDictionary;


@end
