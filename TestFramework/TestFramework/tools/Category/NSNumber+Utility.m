//
//  NSNumber+Utility.m
//  FamilyNetwork
//
//  Created by wuyj on 14-12-12.
//  Copyright (c) 2014年 伍友健. All rights reserved.
//

#import "NSNumber+Utility.h"

@implementation NSNumber (Utility)

- (NSString *)toMMSS{
    return [NSString stringWithFormat:@"%02d:%02d",[self integerValue]/60,[self integerValue] % 60];
}

@end
