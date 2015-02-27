//
//  NSData+Utility.m
//  FamilyNetwork
//
//  Created by wuyj on 14-12-18.
//  Copyright (c) 2014年 伍友健. All rights reserved.
//

#import "NSData+Utility.h"
#import <CommonCrypto/CommonDigest.h>

@implementation NSData (Utility)

-(NSString*)md5String {
    
    unsigned char r[CC_MD5_DIGEST_LENGTH];
    CC_MD5(self.bytes, (CC_LONG)self.length, r);
    NSString *md5 = [[NSString alloc] initWithFormat:@"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]];
    
    
    return md5;
}

@end
