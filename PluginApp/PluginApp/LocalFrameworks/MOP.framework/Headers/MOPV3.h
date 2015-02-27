//
//  Created by Zhangyigang on 14-8-3.
//  Copyright (c) 2014年 baidu.inc All rights reserved.
//


#import <Foundation/Foundation.h>
#define MOPDEBUG 1

@interface MOPV3 : NSObject

/**
 * 向Http请求追加MOP需要的签名等信息
 * @param urlRequest Http请求对象
 * @param appSecret MOP平台为App分配的秘钥
 */
+ (void) signRequest:(NSMutableURLRequest *) urlRequest
                                          appSecret:(NSString *) appSecret;

/**
 * 获得MOP需要的，以Http Header形式追加的签名等信息
 * @param appSecret MOP平台为App分配的秘钥
 * @return 所有MOP需要的Http Header的集合
 */

+ (NSDictionary *) createSignHeadersWithAppSecret:(NSString *) appSecret;

@end
