//
//  MOP.h
//  MOP
//
//  Created by ZhouWeiping on 13-9-12.
//  Copyright (c) 2013年 baidu.inc All rights reserved.
//


/*
 !!以下方法在更改header的同时也设置了body,选用外部http框架的同学请自行测试,自己选用的框架是否能复写body.
 一般无需考虑.第二个方法只输出加密map,可在特殊情况下使用
 */
#import <Foundation/Foundation.h>
//#define MOPDEBUG 1

@interface MOPNew : NSObject

/**
 * signRequestForPostForm 追加加密信息
 * @param urlRequest
 * @param httpMethod
 * @param appSecret
 * @param appKey
 * @param url
 * @param params
 * @param contentType(1="POST"|2="JSON")
 * @return 追加所有参数后的request对象
 */
+ (NSMutableURLRequest *) signRequestForPostForm:(NSMutableURLRequest *) urlRequest
                                      HTTPMethod:(NSString *)            httpMethod
                                          Secret:(NSString *)            appSecret
                                          appKey:(NSString *)            appKey
                                         apiName:(NSString *)            apiName
                                             url:(NSString *)            url
                                          params:(NSDictionary *)        params
                                     contentType:(int)                   contentType;

/**
 * signAsMapWithSecret (非JSON格式)
 * @param httpMethod
 * @param appSecret
 * @param appKey
 * @param url
 * @param params
 * @param contentType (1=form|2=json)
 * @return 追加所有参数的集合
 */

+ (NSMutableDictionary *) createSignMapWithHTTPMethod:(NSString *)     httpMethod
                                               Secret:(NSString *)     appSecret
                                               appKey:(NSString *)     appKey
                                              apiName:(NSString *)     apiName
                                                  url:(NSString *)     url
                                               params:(NSDictionary *) params
                                          contentType:(int)            contentType;

@end
