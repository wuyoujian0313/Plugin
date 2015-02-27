//
//  NSString+Utility.m
//
//
//  Created by wuyj on 14/11/21.
//  Copyright (c) 2014年 baidu. All rights reserved.
//

#import "NSString+Utility.h"
#import <CommonCrypto/CommonDigest.h>

@implementation NSString (Utility)

-(NSString*)encodeURL{
    CFStringRef escapedUrlRef = CFURLCreateStringByAddingPercentEscapes(kCFAllocatorDefault,
                                                                        (CFStringRef)self,
                                                                        (CFStringRef)@"!$&'()*+,-./:;=?@_~%#[]",
                                                                        NULL,
                                                                        kCFStringEncodingUTF8);
    NSString* escapedUrlString = (__bridge NSString*)escapedUrlRef;
    //escapedUrlString = [escapedUrlString stringByAddingPercentEscapesUsingEncoding:kCFStringEncodingUTF8];
    NSString* result = [NSString stringWithFormat:@"%@",escapedUrlString];
    CFRelease(escapedUrlRef);
    return result;
}


- (NSString *)decodeURL{
    NSMutableString *outputStr = [NSMutableString stringWithString:self];
    [outputStr replaceOccurrencesOfString:@"+"
                               withString:@" "
                                  options:NSLiteralSearch
                                    range:NSMakeRange(0,[outputStr length])];
    
    return [outputStr stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
}


- (CGSize)sizeWithFontCompatible:(UIFont *)font
{
    if([self respondsToSelector:@selector(sizeWithAttributes:)] == YES)
    {
        NSDictionary *dictionaryAttributes = @{NSFontAttributeName:font};
        CGSize stringSize = [self sizeWithAttributes:dictionaryAttributes];
        return CGSizeMake(ceil(stringSize.width), ceil(stringSize.height));
    }
    else
    {
        return [self sizeWithFont:font];
    }
}

- (CGSize)sizeWithFontCompatible:(UIFont *)font constrainedToSize:(CGSize)size lineBreakMode:(NSLineBreakMode)lineBreakMode
{
    if([self respondsToSelector:@selector(boundingRectWithSize:options:attributes:context:)] == YES)
    {
        NSDictionary *dictionaryAttributes = @{NSFontAttributeName:font,};
        CGRect stringRect = [self boundingRectWithSize:size
                                               options:NSStringDrawingUsesLineFragmentOrigin
                                            attributes:dictionaryAttributes
                                               context:nil];
        
        return CGSizeMake(ceil(stringRect.size.width), ceil(stringRect.size.height));
    }
    else
    {
        return [self sizeWithFont:font constrainedToSize:size lineBreakMode:lineBreakMode];
  
    }
}

-(NSString*)md5EncodeUpper:(BOOL)upper
{
    const char *cStr = [self UTF8String];
    unsigned char result[CC_MD5_DIGEST_LENGTH];
    CC_MD5(cStr, strlen(cStr), result);
    
    
    char* encodeBuffer = (char*)malloc(CC_MD5_DIGEST_LENGTH*2);
    memset(encodeBuffer, 0x00, CC_MD5_DIGEST_LENGTH*2);
    
    char* p = encodeBuffer;
    for (int i = 0; i < CC_MD5_DIGEST_LENGTH; i++) {
        if (upper) {
            sprintf(p, "%02X", (unsigned char)result[i]);
        }else{
            sprintf(p, "%02x", (unsigned char)result[i]);
        }
        
        p+=2;
    }
    
    NSString* enccyptStr = [NSString stringWithUTF8String:encodeBuffer];
    return enccyptStr;
}

+(NSString *)UUID{
    
    CFUUIDRef uuid = CFUUIDCreate(kCFAllocatorDefault);
    CFStringRef cfstring = CFUUIDCreateString(kCFAllocatorDefault, uuid);
    const char *cStr = CFStringGetCStringPtr(cfstring,CFStringGetFastestEncoding(cfstring));
    unsigned char result[16];
    CC_MD5( cStr, strlen(cStr), result );
    CFRelease(uuid);
    
    return [NSString stringWithFormat:
                 @"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%08x",
                 result[0], result[1], result[2], result[3],
                 result[4], result[5], result[6], result[7],
                 result[8], result[9], result[10], result[11],
                 result[12], result[13], result[14], result[15],
                 (NSUInteger)(arc4random() % NSUIntegerMax)];
}

-(BOOL)isValidateEmail{
    NSString *emailRegex = @"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}";
    NSPredicate *emailPredicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    return [emailPredicate evaluateWithObject:self];
}


-(BOOL)isValidateMobile {
    //手机号以13， 15，18开头，八个 \d 数字字符
    NSString *phoneRegex = @"^((13[0-9])|(15[^4,\\D])|(18[0,0-9]))\\d{8}$";
    NSPredicate *phonePredicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",phoneRegex];
    return [phonePredicate evaluateWithObject:self];
}

@end
