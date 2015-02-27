//
//  MOPUtils.h
//  Heino
//
//  Created by ZhouWeiping on 13-9-13.
//  Copyright (c) 2013年 baidu.inc All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MOPUtils:NSObject

/**
 * SHA1
 * @params NSString *input
 */
+ (NSString *) SHA1:(NSString *) input;

/**
 * MD5
 * @param NSString *input
 */
+ (NSString *) MD5: (NSString *) input;

/**
 * create UUID
 */
+ (NSString *) createUUID;

/**
 * create timeStamp(in microsecond)
 */
+ (NSString *) createTimeStamp;

+ (NSString *) encodeURIComponent:(NSString *)string;

/*
 * serializeParams(dic->queryStr)
 * @param NSDictionary *params
 */
+ (NSString *) serializeParams:(NSDictionary *)params;

/**
 * create HmacSHA1
 * @param NSString *text
 * @param NSString *secret(KEY)
 */
+ (NSString *) hmacsha1:(NSString *)text key:(NSString *)secret;
@end
